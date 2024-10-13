import React, { useState, useRef } from 'react'
import Input from '@/shared/Input'
import Image from 'next/image'
import ButtonPrimary from '@/shared/ButtonPrimary'
import ButtonSecondary from '@/shared/ButtonSecondary'
import { clientUploadImage } from '@/utils/clientUploadImage'
import avatar1 from '@/images/avatars/user-profile.webp'

const ProfilePhotoColumn = ({ companyData }: any) => {
	const { id: businessId, profileImage } = companyData || {}
	const [file, setFile] = useState<File | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [uploadedImage, setUploadedImage] = useState<string | null>('')
	const [isDragActive, setIsDragActive] = useState(false)

	const fileInputRef = useRef<HTMLInputElement | null>(null) // Ref for file input

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			setFile(event.target.files[0])
			setError(null)
		}
	}

	const handleDragEnter = () => setIsDragActive(true)
	const handleDragLeave = () => setIsDragActive(false)
	const handleDrop = (event: React.DragEvent) => {
		event.preventDefault()
		setIsDragActive(false)
		if (event.dataTransfer.files && event.dataTransfer.files[0]) {
			setFile(event.dataTransfer.files[0])
			setError(null)
		}
	}

	const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!file) {
			setError('Please select a file to upload.')
			return
		}

		setLoading(true)
		setError(null)

		try {
			const result = await clientUploadImage(
				'business',
				businessId,
				file,
				'profile',
			)
			setUploadedImage(result.url || '')
		} catch (err) {
			setError(
				err instanceof Error ? err.message : 'An error occurred during upload',
			)
		} finally {
			setLoading(false)
		}
	}

	const handleFileRemove = () => {
		setFile(null) // Remove the file
		setUploadedImage('') // Reset the uploaded image
		setError(null) // Clear any errors
	}

	const triggerFileInput = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click() // Trigger the hidden input
		}
	}

	return (
		<div className="col-span-5 xl:col-span-2">
			<div className="rounded-xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
				<div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
					<h3 className="font-medium text-black dark:text-white">
						Your Business Photo
					</h3>
				</div>
				<div className="p-7">
					<form onSubmit={handleUpload}>
						<div className="mb-4 flex items-center gap-3">
							<div className="h-14 w-14 rounded-full">
								{profileImage?.url ? (
									<Image
										src={
											uploadedImage !== '' ? uploadedImage : profileImage?.url
										}
										width={55}
										height={55}
										alt="Default User"
										className="h-[55px] w-[55px] rounded-full object-cover object-center"
									/>
								) : uploadedImage ? (
									<Image
										src={avatar1.src}
										width={55}
										height={55}
										alt="Default User"
										className="h-[55px] w-[55px] rounded-full object-cover object-center"
									/>
								) : (
									<Image
										src={avatar1.src}
										width={55}
										height={55}
										alt="Default User"
										className="h-[55px] w-[55px] rounded-full object-cover object-center"
									/>
								)}
							</div>
							<div>
								<span className="mb-1.5 text-black dark:text-white">
									Edit your business photo
								</span>
								<span className="flex gap-2.5">
									<button className="text-sm hover:text-primary" type="button">
										Delete
									</button>
									<button
										className="text-sm hover:text-primary"
										type="submit"
										disabled={loading}
									>
										Update
									</button>
								</span>
							</div>
						</div>

						{/* File upload area */}
						<div
							id="FileUpload"
							className={`relative mb-5.5 block w-full cursor-pointer appearance-none rounded border ${
								isDragActive
									? 'border-blue-500 bg-blue-50 shadow-lg'
									: 'border-dashed border-primary bg-gray dark:bg-meta-4'
							} px-4 py-4 sm:py-7.5`}
							onDragEnter={handleDragEnter}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
							onDragOver={(e) => e.preventDefault()}
							onClick={triggerFileInput} // Trigger file input on click
						>
							{/* Hidden file input */}
							<input
								type="file"
								ref={fileInputRef} // Attach the ref
								onChange={handleFileChange}
								style={{ display: 'none' }} // Hide the input element
							/>
							{file ? (
								<div className="flex items-center justify-between">
									{/* Show the name of the uploaded file and an "X" to remove */}
									<p className="text-black dark:text-white">{file.name}</p>
									<button
										type="button"
										className="text-red-500 hover:text-red-700"
										onClick={handleFileRemove}
									>
										X
									</button>
								</div>
							) : (
								<div className="flex flex-col items-center justify-center space-y-3">
									<span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
										<svg
											width="16"
											height="16"
											viewBox="0 0 16 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
												fill="#3C50E0"
											/>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.9429L5.13811 5.80478C4.87777 6.06513 4.45565 6.06513 4.19531 5.80478C3.93496 5.54443 3.93496 5.12232 4.19531 4.86197L7.5286 1.52864Z"
												fill="#3C50E0"
											/>
											<path
												fillRule="evenodd"
												clipRule="evenodd"
												d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
												fill="#3C50E0"
											/>
										</svg>
									</span>
									<p>
										<span className="text-primary">Click to upload</span> or
										drag and drop
									</p>
									<p className="mt-1.5">SVG, PNG, JPG or GIF</p>
									<p>(max, 800 X 800px)</p>
								</div>
							)}
						</div>

						<div className="flex justify-end gap-4.5">
							<ButtonSecondary
								type="button"
								onClick={() => setFile(null)} // Reset file on cancel
							>
								Cancel
							</ButtonSecondary>
							<ButtonPrimary type="submit" disabled={loading}>
								{loading ? 'Uploading...' : 'Save'}
							</ButtonPrimary>
						</div>

						{error && <p className="text-red-500">{error}</p>}
					</form>
				</div>
			</div>
		</div>
	)
}

export default ProfilePhotoColumn
