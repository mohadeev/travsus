// SkeletonLoader.js
export const SkeletonLoader = () => {
    return (
      <div className="animate-pulse">
        <div className="relative grid grid-cols-4 gap-1 sm:gap-2">
          <div className="relative col-span-2 row-span-2 cursor-pointer overflow-hidden rounded-md sm:rounded-xl bg-gray-300 h-48 sm:h-64"></div>
          <div className="relative col-span-1 row-span-2 cursor-pointer overflow-hidden rounded-md sm:rounded-xl bg-gray-300 h-48 sm:h-64"></div>
          <div className="relative overflow-hidden rounded-md sm:rounded-xl bg-gray-300 h-24 sm:h-36"></div>
          <div className="relative overflow-hidden rounded-md sm:rounded-xl bg-gray-300 h-24 sm:h-36"></div>
        </div>
      </div>
    );
  };
  