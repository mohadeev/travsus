import React, { FC } from 'react'

export interface PaginationProps {
	className?: string
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
}

const Pagination: FC<PaginationProps> = ({
	className = '',
	currentPage,
	totalPages,
	onPageChange,
}) => {
	const renderPageNumbers = () => {
		const pages = []
		for (let i = 1; i <= totalPages; i++) {
			pages.push(
				<button
					key={i}
					onClick={() => onPageChange(i)}
					className={`inline-flex h-11 w-11 items-center justify-center rounded-full ${
						i === currentPage
							? 'bg-primary text-white'
							: 'text-neutral-6000 border border-neutral-200 bg-white hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800'
					}`}
				>
					{i}
				</button>,
			)
		}
		return pages
	}

	return (
		<nav
			className={`nc-Pagination inline-flex space-x-1 text-base font-medium ${className}`}
		>
			{renderPageNumbers()}
		</nav>
	)
}

export default Pagination
