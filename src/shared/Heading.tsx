import React, { HTMLAttributes, ReactNode } from "react";
import  { FC } from 'react'

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  fontClass?: string;
  desc?: ReactNode;
  isCenter?: boolean;
}

const Heading: React.FC<HeadingProps> = ({
  children,
  desc = "Discover the most outstanding articles in all topics of life. ",
  className = "mb-10 text-neutral-900 dark:text-neutral-50",
  isCenter = false,
  ...args
}) => {
  return (
    <div className={`nc-Section-Heading relative ${className}`}>
      <div
        className={
          isCenter ? "text-center w-full max-w-2xl mx-auto mb-4" : "max-w-2xl"
        }
      >
        <h2 className={`text-3xl md:text-4xl font-semibold`} {...args}>
          {children || `Section Heading`}
        </h2>
        {desc && (
          <span className="block mt-2 md:mt-3 font-normal text-base sm:text-lg text-neutral-500 dark:text-neutral-400">
            {desc}
          </span>
        )}
      </div>
    </div>
  );
};

export default Heading;

export interface HeadingSkeletonProps {
  className?: string
  isCenter?: boolean
}
export const HeadingSkeleton : FC<HeadingSkeletonProps> = ({
  className = 'mb-10',
  isCenter = false,
}) => {
  return (
    <div className={`nc-Section-Heading relative ${className} animate-pulse`}>
      <div className={isCenter ? 'text-center w-full max-w-2xl mx-auto mb-4' : 'max-w-2xl'}>
        <div className={`h-8 bg-gray-300 rounded w-3/4 ${isCenter ? 'mx-auto' : ''}`}></div>
        <div className={`h-5 bg-gray-300 rounded w-1/2 mt-3 ${isCenter ? 'mx-auto' : ''}`}></div>
      </div>
    </div>
  )
}

