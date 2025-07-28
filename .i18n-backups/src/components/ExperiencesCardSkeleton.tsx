// ExperiencesCardSkeleton.tsx

import React from 'react';

const ExperiencesCardSkeleton: React.FC<{ size?: 'default' | 'small' }> = ({ size = 'default' }) => {
  return (
    <div className={`nc-ExperiencesCardSkeleton group relative rounded-lg overflow-hidden`}>
      {/* Skeleton for gallery slider */}
      <div className={`skeleton-gallery ${size === 'default' ? 'aspect-w-3 aspect-h-3' : 'aspect-w-3 aspect-h-2'}`}>
        {/* Placeholder for loading images */}
        <div className="bg-gray-200 animate-pulse h-full w-full rounded-lg"></div>
      </div>

      {/* Skeleton for content */}
      <div className={size === 'default' ? 'space-y-3 py-4' : 'space-y-1 p-3'}>
        <div className="flex items-center space-x-2 skeleton-title">
          <div className="bg-gray-200 animate-pulse h-4 w-1/2 rounded-lg"></div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-gray-200 animate-pulse h-4 w-1/3 rounded-lg"></div>
        </div>
        {/* <div className="border-b border-neutral-100 dark:border-neutral-800" /> */}
        <div className="flex items-center justify-between">
          <div className="bg-gray-200 animate-pulse h-6 w-1/3 rounded-lg"></div>
          <div className="bg-gray-200 animate-pulse h-6 w-1/5 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default ExperiencesCardSkeleton;
