import { defineConfig, type Plugin } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { patchCssModules } from "vite-css-modules";
import path from "node:path";

const src = (file: string) => path.resolve(import.meta.dirname, "src", file);
const MESSAGES_LOADER = src("i18n/loadMessages.ts");
const IMAGE_WRAPPER = src("lib/cloudflare/image.tsx");
const VINEXT_IMAGE = path.resolve(import.meta.dirname, "node_modules/vinext/dist/shims/image.js");
const YOGA_BASE64 = /"data:application\/octet-stream;base64,[A-Za-z0-9+/=]+"/;

/**
 * yoga-layout (used by @react-pdf for the booking PDF) ships its WebAssembly as
 * base64 and compiles it at runtime, which Cloudflare Workers don't allow. The
 * server build gets the same bytes as a .wasm module instead (precompiled at deploy).
 */
function yogaWasmFile(): string {
  const require = createRequire(import.meta.url);
  const loader = path.join(path.dirname(require.resolve("yoga-layout")), "..", "binaries", "yoga-wasm-base64-esm.js");
  const base64 = readFileSync(loader, "utf8").match(YOGA_BASE64)?.[0].slice(38, -1);
  if (!base64) throw new Error("yoga-layout: embedded WebAssembly not found");
  const file = path.resolve(import.meta.dirname, "node_modules/.cache/travsus/yoga.wasm");
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, Buffer.from(base64, "base64"));
  return file;
}

/**
 * What Cloudflare Workers need, without changing what the site does:
 * - the site's texts are read from static assets (public/messages) instead of
 *   being bundled into the Worker (size limit);
 * - @react-pdf/renderer is left out of the server-side HTML render of client
 *   components, where it is never used (the GDPR form is ssr:false). Server
 *   PDFs (bookingPdf) and the browser keep the real library;
 * - yoga-layout's WebAssembly is loaded as a module (see yogaWasmFile);
 * - next/image: vinext ignores images.loaderFile, so Cloudinary photos go through
 *   src/lib/cloudflare/image.tsx to keep the same resized URLs and srcset;
 * - the `cloudinary` Node SDK is replaced by a small REST version with the same
 *   calls (src/lib/cloudflare/cloudinary.ts): smaller, and no Node http streams;
 * - on the server, fontkit's Brotli decoder (only for .woff2 fonts; the booking
 *   PDF uses the built-in Helvetica) is left out (size limit).
 */
function cloudflareWorker(): Plugin {
  let yogaWasm: string | undefined;
  return {
    name: "travsus:cloudflare-worker",
    enforce: "pre",
    async resolveId(id, importer, options) {
      if (id === "travsus:vinext-image") return VINEXT_IMAGE;
      if ((id === "next/image" || id === VINEXT_IMAGE) && importer !== IMAGE_WRAPPER) {
        return IMAGE_WRAPPER;
      }
      if (id === "cloudinary" && this.environment?.name !== "client") {
        return src("lib/cloudflare/cloudinary.ts");
      }
      if (id === "brotli/decompress.js" && this.environment?.name !== "client") {
        return "\0travsus:no-brotli";
      }
      if (id === "@react-pdf/renderer" && this.environment?.name === "ssr") {
        return src("lib/cloudflare/react-pdf-ssr-stub.tsx");
      }
      if (id.endsWith("loadMessages")) {
        const resolved = await this.resolve(id, importer, { ...options, skipSelf: true });
        if (resolved?.id === MESSAGES_LOADER) return src("i18n/loadMessages.cloudflare.ts");
      }
    },
    load(id) {
      if (id === "\0travsus:no-brotli") {
        return 'export default function decompress() { throw new Error("WOFF2 fonts are not supported in server-side PDFs; use .ttf"); }';
      }
    },
    transform(code, id) {
      if (this.environment?.name === "client" || !id.includes("/yoga-layout/dist/")) return;
      if (id.endsWith("/binaries/yoga-wasm-base64-esm.js")) {
        // The bytes come from the .wasm module now; drop the base64 copy
        return { code: code.replace(YOGA_BASE64, '"data:application/octet-stream;base64,"'), map: null };
      }
      // Both entry points (index.js and load.js, which @react-pdf uses) call the Emscripten loader
      const call = /await (loadYoga|loadYogaImpl)\(\)/;
      if ((id.endsWith("/src/index.js") || id.endsWith("/src/load.js")) && call.test(code)) {
        yogaWasm ??= yogaWasmFile();
        return {
          code:
            `import __yogaWasm from ${JSON.stringify(yogaWasm + "?module")};\n` +
            code.replace(
              call,
              "await $1({ instantiateWasm(imports, done) { const instance = new WebAssembly.Instance(__yogaWasm, imports); done(instance, __yogaWasm); return instance.exports; } })",
            ),
          map: null,
        };
      }
    },
  };
}

export default defineConfig({
  plugins: [
    cloudflareWorker(),
    patchCssModules({ exportMode: "default" }),
    vinext(),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
  ],
  css: {
    modules: {
      generateScopedName(name: string, filename: string) {
        const relativePath = path.relative(import.meta.dirname, filename.replace(/\?.*$/, "")).replaceAll("\\", "/");
        return `_${name}_${createHash("sha256").update(relativePath).digest("hex").slice(0, 7)}`;
      },
    },
  },
});
