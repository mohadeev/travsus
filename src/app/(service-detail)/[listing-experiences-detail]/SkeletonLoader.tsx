// SkeletonLoader.js
export const SkeletonLoader = () => {
    return (
      <header className="rounded-md sm:rounded-xl">
  <div className="relative grid grid-cols-4 gap-1 sm:gap-2">
    {/* Large Image Placeholder */}
    <div className="relative col-span-2 row-span-2 rounded-md sm:rounded-xl bg-gray-200 dark:bg-neutral-700 animate-pulse">
      <div className="absolute inset-0 bg-neutral-900 bg-opacity-20"></div>
    </div>

    {/* Small Image Placeholder 1 */}
    <div className="relative col-span-1 row-span-2 rounded-md sm:rounded-xl bg-gray-200 dark:bg-neutral-700 animate-pulse">
      <div className="absolute inset-0 bg-neutral-900 bg-opacity-20"></div>
    </div>

    {/* Small Image Placeholders 2 & 3 */}
    <div className="relative overflow-hidden rounded-md sm:rounded-xl bg-gray-200 dark:bg-neutral-700 animate-pulse">
      <div className="aspect-h-3 aspect-w-4 bg-gray-200 dark:bg-neutral-700"></div>
      <div className="absolute inset-0 bg-neutral-900 bg-opacity-20"></div>
    </div>
    <div className="relative overflow-hidden rounded-md sm:rounded-xl bg-gray-200 dark:bg-neutral-700 animate-pulse">
      <div className="aspect-h-3 aspect-w-4 bg-gray-200 dark:bg-neutral-700"></div>
      <div className="absolute inset-0 bg-neutral-900 bg-opacity-20"></div>
    </div>

    {/* "Show all photos" button Placeholder */}
    <div className="absolute bottom-3 left-3 z-10 hidden md:flex items-center justify-center cursor-pointer rounded-xl bg-gray-200 dark:bg-neutral-700 px-4 py-2 text-neutral-500 animate-pulse">
      <div className="h-5 w-5 bg-gray-300 dark:bg-neutral-600 rounded"></div>
      <span className="ml-2 text-sm bg-gray-300 dark:bg-neutral-600 rounded w-16 h-5"></span>
    </div>
  </div>
</header>


    );
  };
  