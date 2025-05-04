const HeaderSkeleton = () => {
    return (
      <header className="sticky top-0 z-40 shadow-sm dark:border-b dark:border-neutral-700 bg-white">
        <div className="relative flex h-[88px] px-4 lg:container">
          <div className="flex flex-1 justify-between items-center">
            {/* Logo Skeleton */}
            <div className="flex-1 items-center hidden md:flex">
              <div className="w-24 h-12 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded"></div>
            </div>
  
            {/* Center Search Bar Skeleton */}
            <div className="flex-[2] lg:flex-none mx-auto w-full max-w-lg  flex justify-center items-center">
              <div className="relative w-full h-12 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded-full"></div>
            </div>
  
            {/* Right-side Skeleton */}
            <div className="hidden flex-1 justify-end items-center md:flex space-x-4">
              <div className="w-24 h-10 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded-full"></div>
              <div className="w-10 h-10 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded-full"></div>
              <div className="w-10 h-10 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded-full"></div>
              <div className="w-10 h-10 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded-full"></div>
            </div>
          </div>
        </div>
      </header>
    );
  };
  
  export default HeaderSkeleton;
  