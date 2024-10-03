// ContainerExperiencesCardSkeleton.tsx

import React from 'react';
import ExperiencesCardSkeleton from './ExperiencesCardSkeleton'; // Import the skeleton component

const ContainerExperiencesCardSkeleton: React.FC = () => {
  // Generate an array of length 10 to create 10 skeleton cards
  const skeletons = Array.from({ length: 10 }, (_, index) => (
    <ExperiencesCardSkeleton key={index} size="default" /> // or size="small" based on your needs
  ));

  return (
    <>
      {skeletons}
    </>
  );
};

export default ContainerExperiencesCardSkeleton;
