import { useSession } from "next-auth/react";
import { useRepeatedOverlay } from "./useRepeatedOverlay";

type AuthActionFunction<T = any> = (args: T) => void | Promise<void>;

export const useAuthAction = <T = any>(
  action: AuthActionFunction<T>,
  data?: any,
) => {
  const { data: session } = useSession();
  const { toggleOverlay } = useRepeatedOverlay("authModal");

  const handleAuthAction = (args: T) => {
    if (session) {
      action(args);
    } else {
      handleLogin(data);
      toggleOverlay({
        type: "authModal",
        data: { mode: data?.auth ? data?.auth : "login" },
        isVisible: true,
      });
    }
  };

  return handleAuthAction;
};

interface LoginData {
  auth?: string;
  authMode?: string;
  verificationCodeToken?: string;
}

export const handleLogin = (data: LoginData) => {
  const { auth, authMode, verificationCodeToken } = data || {};

  const currentUrl = new URL(window.location.href);

  // Check and set 'auth' parameter if it exists
  if (auth) {
    currentUrl.searchParams.set("auth", auth);
  }

  // Check and set 'authMode' parameter if it exists
  if (authMode) {
    currentUrl.searchParams.set("authMode", authMode);
  }
  if (verificationCodeToken) {
    currentUrl.searchParams.set("verificationCodeToken", verificationCodeToken);
  }

  // Only update the URL if at least one parameter was added
  if (auth || authMode) {
    // Update the browser's URL without reloading the page
    window.history.pushState({}, "", currentUrl.toString());
  } else {
    console.warn("No valid parameters provided to handleLogin");
  }
};
