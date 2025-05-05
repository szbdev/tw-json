import {useState} from 'react'
// src/app/Toolbox.tsx
import React from 'react'

interface ToolboxProps {
	onSearch: (query: string) => void
	onExport: () => void
	theme: 'light' | 'dark'
	onNext: () => void // Add onNext prop
	onPrev: () => void // Add onPrev prop
	hasResults: boolean
}

const Toolbox: React.FC<ToolboxProps> = ({onSearch, onExport, theme, onNext, onPrev, hasResults}) => {
	const [searchQuery, setSearchQuery] = useState('')

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const query = event.target.value
		setSearchQuery(query)
		onSearch(query)
	}

	const isDarkTheme = theme === 'dark'

	const toolboxThemeClasses = isDarkTheme ? 'bg-[#282828] border-[#202020] text-white' : 'bg-gray-100 border-gray-300'

	const inputThemeClasses = isDarkTheme ? 'border-[#202020] text-white bg-[#08090a]' : ''

	const buttonThemeClasses = isDarkTheme ? 'bg-blue-500 hover:bg-blue-700 text-white disabled:bg-[#08090a]/30 disabled:opacity-50 disabled:cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed'

	return (
		<div className={`p-2 border-b flex items-center justify-between ${toolboxThemeClasses}`}>
			<div className='flex items-center'>
				<input type='text' id='search' placeholder='Search...' className={`border rounded-md p-1 text-sm ${inputThemeClasses}`} value={searchQuery} onChange={handleSearchChange} />
				<button className={`ml-2 font-bold py-1 px-3 rounded text-sm ${buttonThemeClasses}`} onClick={onPrev} disabled={!hasResults}>
					Prev
				</button>
				<button className={`ml-2 font-bold py-1 px-3 rounded text-sm ${buttonThemeClasses}`} onClick={onNext} disabled={!hasResults}>
					Next
				</button>
			</div>
			<button className={`font-bold py-1 px-3 rounded-lg text-sm cursor-pointer ${buttonThemeClasses}`} onClick={onExport}>
				Export
			</button>
		</div>
	)
}

export default Toolbox
