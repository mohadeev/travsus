'use client'
import { useTranslations } from '@/lib/i18n'
import { ChevronDown, ChevronRight, Camera, Heart } from 'lucide-react'

const DestinationPageSkeleton = () => {
    const t = useTranslations('destinations_code_page')

    return (
        <div className="animate-pulse">
            <div className="mx-auto max-w-6xl">
                <div className="px-4 md:px-0">
                    {/* Navigation Bar Skeleton */}
                    <nav className="relative flex items-center border-b border-neutral-200 py-3">
                        <div className="hide-scrollbar flex items-center overflow-x-auto">
                            {Array.from({ length: 9 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`mr-4 flex flex-shrink-0 items-center whitespace-nowrap md:mr-6 ${
                                        index === 0
                                            ? 'h-8 w-20 rounded-full bg-neutral-300 md:h-10 md:w-24'
                                            : 'h-4 w-16 rounded bg-neutral-200 md:w-20'
                                    }`}
                                />
                            ))}
                        </div>
                    </nav>
                </div>

                {/* Breadcrumb Skeleton */}
                <div className="mt-2 flex flex-col px-4 py-2 text-xs md:mt-4 md:flex-row md:items-center md:justify-between md:px-0">
                    <div className="mb-1 flex items-center md:mb-0">
                        <div className="h-3 w-16 rounded bg-neutral-200"></div>
                        <ChevronRight className="mx-1 h-2.5 w-2.5 text-neutral-300" />
                        <div className="flex items-center">
                            <div className="h-3 w-20 rounded bg-neutral-200"></div>
                            <ChevronDown className="ml-1 h-2.5 w-2.5 text-neutral-300" />
                        </div>
                    </div>
                    <div className="text-neutral-300">
                        <div className="h-3 w-48 rounded bg-neutral-200 md:w-64"></div>
                    </div>
                </div>

                {/* Hero Image Skeleton */}
                <div className="px-0 pb-3 pt-3 md:pb-4 md:pt-4">
                    <div className="relative h-[300px] w-full overflow-hidden bg-neutral-200 md:h-[500px] md:rounded-[16px]">
                        <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-neutral-300 px-3 py-1 md:bottom-4 md:right-4 md:px-4 md:py-1.5">
                            <Camera className="h-3 w-3 text-neutral-400 md:h-4 md:w-4" />
                            <div className="h-3 w-2 rounded bg-neutral-400"></div>
                        </div>
                        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 transform space-x-1.5 md:bottom-4 md:space-x-2">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-1.5 w-1.5 rounded-full md:h-2 md:w-2 ${
                                        index === 0 ? 'bg-neutral-300' : 'bg-neutral-400'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="mt-1 px-4 md:mt-2 md:px-0">
                        <div className="h-3 w-32 rounded bg-neutral-200"></div>
                    </div>
                </div>

                {/* Title and Heart Button Skeleton */}
                <div className="px-4 py-5 md:px-0 md:py-8">
                    <div className="mb-4 flex flex-row items-center justify-between md:mb-6">
                        <div className="h-8 w-48 rounded bg-neutral-200 md:h-12 md:w-64"></div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 md:h-12 md:w-12">
                            <Heart className="h-5 w-5 text-neutral-400 md:h-6 md:w-6" />
                        </div>
                    </div>
                    
                    {/* Description Skeleton */}
                    <div className="space-y-2">
                        <div className="h-4 w-full rounded bg-neutral-200"></div>
                        <div className="h-4 w-full rounded bg-neutral-200"></div>
                        <div className="h-4 w-3/4 rounded bg-neutral-200"></div>
                        <div className="h-4 w-20 rounded bg-neutral-300 mt-2"></div>
                    </div>
                </div>

                {/* Collections Grid Skeleton */}
                <div className="px-4 md:px-0 mb-8">
                    <div className="h-6 w-40 rounded bg-neutral-200 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="space-y-2">
                                <div className="h-48 w-full rounded-lg bg-neutral-200"></div>
                                <div className="h-4 w-3/4 rounded bg-neutral-200"></div>
                                <div className="h-3 w-1/2 rounded bg-neutral-200"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Country Card List Skeleton */}
                <div className="px-4 md:px-0">
                    <div className="h-6 w-32 rounded bg-neutral-200 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 9 }).map((_, index) => (
                            <div key={index} className="space-y-2">
                                <div className="h-40 w-full rounded-lg bg-neutral-200"></div>
                                <div className="h-4 w-full rounded bg-neutral-200"></div>
                                <div className="h-3 w-2/3 rounded bg-neutral-200"></div>
                            </div>
                        ))}
                    </div>
                </div>

                <style jsx global>{`
                    .hide-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .hide-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>
            </div>
        </div>
    )
}

export default DestinationPageSkeleton