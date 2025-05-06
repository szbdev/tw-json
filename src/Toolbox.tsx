'use client'
import {useState, useRef} from 'react'
// src/app/Toolbox.tsx
import React from 'react'

interface ToolboxProps {
	onSearch: (query: string) => void
	onExport: () => void
	theme: 'light' | 'dark'
	onNext: () => void // Add onNext prop
	onPrev: () => void // Add onPrev prop
	hasResults: boolean
	onCopy: () => string | Promise<string> // Add onCopy prop
	toolboxOptions?: {
		showSearch?: boolean
		showExport?: boolean
		showCopy?: boolean
	}
	// Add any other props you need
}

const Toolbox: React.FC<ToolboxProps> = ({onSearch, onExport, theme, onNext, onPrev, hasResults, onCopy, toolboxOptions}) => {
	const [searchQuery, setSearchQuery] = useState('')
	const searchInputRef = useRef<HTMLInputElement>(null)

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value
		setSearchQuery(query)

		if (query.trim() === '') {
			// If the query is empty
			onSearch('') // Notify parent to clear highlights
		} else {
			onSearch(query) // Perform the search
		}
	}

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			event.preventDefault()
			if (document.activeElement === searchInputRef.current) {
				onNext()
			}
		}
	}

	const handleCopyClick = async () => {
		try {
			const textToCopy = await onCopy()
			await navigator.clipboard.writeText(textToCopy)
			// You might want to add some visual feedback here, like a tooltip or
			// changing the button text temporarily to "Copied!"
			console.log('Content copied to clipboard!')
		} catch (err) {
			console.error('Failed to copy content:', err)
			// Handle errors, perhaps show a message to the user
		}
	}

	const isDarkTheme = theme === 'dark'

	const toolboxThemeClasses = isDarkTheme ? 'bg-[#282828] border-[#202020] text-white' : 'bg-gray-100 border-gray-300'

	const inputThemeClasses = isDarkTheme ? 'border-[#202020] text-white bg-[#08090a] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500' : 'focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'

	const buttonThemeClasses = isDarkTheme ? 'bg-blue-500 hover:bg-blue-700 text-white disabled:bg-[#08090a]/30 disabled:opacity-50 disabled:cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed'
	if (!toolboxOptions?.showSearch && !toolboxOptions?.showCopy && !toolboxOptions?.showExport) {
		return null
	}
	return (
		<div className={`p-2 border-b flex items-center justify-between ${toolboxThemeClasses}`}>
			<div className='flex items-center'>
				{toolboxOptions?.showSearch !== false && (
					<>
						<input type='text' id='search' placeholder='Search...' className={`border rounded-md p-1 text-sm ${inputThemeClasses}`} value={searchQuery} onChange={handleSearchChange} onKeyDown={handleKeyDown} ref={searchInputRef} />
						<button className={`ml-2 font-bold py-1 px-3 rounded text-sm ${buttonThemeClasses}`} onClick={onPrev} disabled={!hasResults}>
							Prev
						</button>
						<button className={`ml-2 font-bold py-1 px-3 rounded text-sm ${buttonThemeClasses}`} onClick={onNext} disabled={!hasResults}>
							Next
						</button>
					</>
				)}
			</div>

			<div className='flex items-center'>
				{toolboxOptions?.showCopy !== false && (
					<button className={`font-bold py-1 px-3 rounded-lg text-sm cursor-pointer ${buttonThemeClasses} mr-2`} onClick={handleCopyClick}>
						Copy
					</button>
				)}
				{toolboxOptions?.showExport !== false && (
					<button className={`font-bold py-1 px-3 rounded-lg text-sm cursor-pointer ${buttonThemeClasses}`} onClick={onExport}>
						Export
					</button>
				)}
			</div>
		</div>
	)
}

export default Toolbox
