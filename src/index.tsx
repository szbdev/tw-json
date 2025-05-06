'use client'

import {useState, useEffect, useCallback, useRef} from 'react'
import React from 'react'
import Toolbox from './Toolbox'

interface JsonViewerProps {
	jsonData: any
	classNames?: {
		keyClass?: string
		numberClass?: string
		stringClass?: string
		booleanClass?: string
		nullClass?: string
		arrayClass?: string
		objectClass?: string
	}
	defaultExpandAll?: boolean
	showType?: boolean
	theme?: 'light' | 'dark'
	showToolbox?: boolean
	toolboxOptions?: {
		showSearch?: boolean
		showExport?: boolean
		showCopy?: boolean
	}
}

interface ExpandedState {
	[key: string]: boolean
}

const JsonViewer: React.FC<JsonViewerProps> = ({
	jsonData,
	classNames = {},
	defaultExpandAll = false,
	showType = true,
	theme = 'light',
	showToolbox = false,
	toolboxOptions = {
		showSearch: true,
		showExport: true,
		showCopy: true,
	},
}) => {
	const [expanded, setExpanded] = useState<ExpandedState>({})
	const [highlightedPaths, setHighlightedPaths] = useState<string[]>([])
	const [currentHighlightIndex, setCurrentHighlightIndex] = useState<number>(-1)
	const [copiedPath, setCopiedPath] = useState<string | null>(null) // State to track which path was copied
	const contentRef = useRef<HTMLDivElement>(null)
	const highlightedPathsRef = useRef<string[]>([])

	useEffect(() => {
		highlightedPathsRef.current = highlightedPaths
	}, [highlightedPaths])

	// Define default classes based on theme
	const isDarkTheme = theme === 'dark'

	const defaultClasses = {
		keyClass: isDarkTheme ? 'text-gray-400' : 'text-red-500',
		numberClass: isDarkTheme ? 'text-blue-300' : 'text-orange-500',
		stringClass: isDarkTheme ? 'text-emerald-400' : 'text-green-500',
		booleanClass: isDarkTheme ? 'text-rose-300' : 'text-purple-500',
		nullClass: isDarkTheme ? 'text-gray-300' : 'text-gray-500',
		arrayClass: isDarkTheme ? 'text-fuchsia-300' : 'text-teal-500',
		objectClass: isDarkTheme ? 'text-amber-300' : 'text-blue-500',
	}

	// Merge default classes with custom classes, giving priority to custom ones
	const mergedClasses = {
		keyClass: classNames.keyClass ? `${defaultClasses.keyClass} ${classNames.keyClass}` : defaultClasses.keyClass,
		numberClass: classNames.numberClass ? `${defaultClasses.numberClass} ${classNames.numberClass}` : defaultClasses.numberClass,
		stringClass: classNames.stringClass ? `${defaultClasses.stringClass} ${classNames.stringClass}` : defaultClasses.stringClass,
		booleanClass: classNames.booleanClass ? `${defaultClasses.booleanClass} ${classNames.booleanClass}` : defaultClasses.booleanClass,
		nullClass: classNames.nullClass ? `${defaultClasses.nullClass} ${classNames.nullClass}` : defaultClasses.nullClass,
		arrayClass: classNames.arrayClass ? `${defaultClasses.arrayClass} ${classNames.arrayClass}` : defaultClasses.arrayClass,
		objectClass: classNames.objectClass ? `${defaultClasses.objectClass} ${classNames.objectClass}` : defaultClasses.objectClass,
	}

	useEffect(() => {
		if (defaultExpandAll) {
			const newState: ExpandedState = {}
			const traverse = (obj: any, path: string = '') => {
				newState[path] = true
				if (typeof obj === 'object' && obj !== null) {
					if (Array.isArray(obj)) {
						obj.forEach((item, index) => {
							const newPath = `${path}[${index}]`
							traverse(item, newPath)
						})
					} else {
						for (const key in obj) {
							if (obj.hasOwnProperty(key)) {
								const newPath = path ? `${path}.${key}` : key
								traverse(obj[key], newPath)
							}
						}
					}
				}
			}
			traverse(jsonData)
			setExpanded(newState)
		} else {
			setExpanded({'': true})
		}
	}, [defaultExpandAll, jsonData])

	const toggleExpand = (path: string) => {
		setExpanded((prev) => ({...prev, [path]: !prev[path]}))
	}

	const isExpanded = (path: string): boolean => {
		return expanded[path] === true
	}

	const handleSearch = useCallback(
		(query: string) => {
			const newHighlightedPaths: string[] = []
			if (query.trim() === '') {
				setHighlightedPaths([])
				setCurrentHighlightIndex(-1) // Reset index
				return
			}
			const traverse = (obj: any, path: string = '') => {
				if (typeof obj === 'object' && obj !== null) {
					if (Array.isArray(obj)) {
						obj.forEach((item, index) => {
							const newPath = `${path}[${index}]`
							traverse(item, newPath)
						})
					} else {
						for (const key in obj) {
							if (obj.hasOwnProperty(key)) {
								const newPath = path ? `${path}.${key}` : key
								if (key.toLowerCase().includes(query.toLowerCase()) || String(obj[key]).toLowerCase().includes(query.toLowerCase())) {
									newHighlightedPaths.push(newPath)
								}
								traverse(obj[key], newPath)
							}
						}
					}
				} else if (String(obj).toLowerCase().includes(query.toLowerCase())) {
					newHighlightedPaths.push(path)
				}
			}
			traverse(jsonData)

			setHighlightedPaths(newHighlightedPaths)
			setCurrentHighlightIndex(newHighlightedPaths.length > 0 ? 0 : -1) // Reset index
		},
		[jsonData]
	)

	const handleNext = () => {
		if (highlightedPaths.length === 0) return

		setCurrentHighlightIndex((prevIndex) => {
			const newIndex = (prevIndex + 1) % highlightedPaths.length
			// Scroll immediately after calculating newIndex
			scrollToPath(highlightedPaths[newIndex])
			return newIndex
		})
	}

	const handlePrev = () => {
		if (highlightedPaths.length === 0) return

		setCurrentHighlightIndex((prevIndex) => {
			const newIndex = (prevIndex - 1 + highlightedPaths.length) % highlightedPaths.length
			// Scroll immediately after calculating newIndex
			scrollToPath(highlightedPaths[newIndex])
			return newIndex
		})
	}

	const scrollToPath = (path: string) => {
		if (contentRef.current) {
			const element = document.querySelector(`[data-path="${path}"]`)
			if (element) {
				element.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				})
			}
		}
	}

	const handleExport = () => {
		const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(jsonData, null, 2))}`
		const link = document.createElement('a')
		link.href = jsonString
		link.download = 'data.json'
		link.click()
	}

	const handleCopyString = (text: string, path: string) => {
		navigator.clipboard.writeText(text).then(() => {
			setCopiedPath(path)
			setTimeout(() => {
				setCopiedPath(null)
			}, 1000) // Reset copied state after 1 second
		})
	}

	const renderJson = (json: any, path: string = '') => {
		const isHighlighted = highlightedPaths.includes(path)
		const isCurrentHighlight = highlightedPaths.length > 0 && path === highlightedPaths[currentHighlightIndex]

		let highlightClass = ''

		if (isHighlighted) {
			highlightClass = 'bg-blue-500/30 text-white'
		}

		if (isCurrentHighlight) {
			highlightClass = 'bg-orange-500/40 ' // Higher highlight for current
		}

		if (json === null) {
			return (
				<span data-path={path} className={highlightClass}>
					<span className={mergedClasses.nullClass}>null</span>
					{showType && <span className='text-gray-500'> null</span>}
				</span>
			)
		}

		const type = typeof json

		if (type === 'number' || type === 'boolean') {
			return (
				<span data-path={path} className={highlightClass}>
					<span className={type === 'number' ? mergedClasses.numberClass : mergedClasses.booleanClass}>{String(json)}</span>
					{showType && <span className='text-gray-500'> {type}</span>}
				</span>
			)
		}

		if (type === 'string') {
			const isCurrentlyCopied = copiedPath === path
			return (
				<span data-path={path} className={highlightClass}>
					<span className={mergedClasses.stringClass}>"{json}"</span>
					{showType && <span className='text-gray-500'> string</span>}
					<span
						className={`pl-2 text-sm opacity-70 cursor-pointer ${isCurrentlyCopied ? 'text-green-500' : ''}`} // Apply green color if copied
						onClick={() => handleCopyString(json, path)}>
						{isCurrentlyCopied ? 'Copied!' : 'Copy'} {/* Show 'Copied!' or 'Copy' */}
					</span>
				</span>
			)
		}

		if (Array.isArray(json)) {
			const isCurrentlyExpanded = isExpanded(path)

			return (
				<span data-path={path} className={highlightClass}>
					<span className={mergedClasses.arrayClass}>&#91;</span>
					{!isCurrentlyExpanded ? (
						<span className='cursor-pointer ml-1 text-blue-500' onClick={() => toggleExpand(path)}>
							...
						</span>
					) : null}
					{isCurrentlyExpanded && (
						<>
							<span className='cursor-pointer ml-1 text-blue-500' onClick={() => toggleExpand(path)}>
								-
							</span>
							<div className='ml-5'>
								{json.map((item, index) => (
									<div key={index}>
										{renderJson(item, `${path}[${index}]`)}
										{index < json.length - 1 ? <span>, </span> : null}
									</div>
								))}
							</div>
						</>
					)}
					<span className={mergedClasses.arrayClass}>&#93;</span>
					{showType && <span className='text-gray-500'> array</span>}
				</span>
			)
		}

		if (type === 'object') {
			const isCurrentlyExpanded = isExpanded(path)

			return (
				<span data-path={path} className={highlightClass}>
					<span className={mergedClasses.objectClass}>&#123;</span>
					{!isCurrentlyExpanded ? (
						<span className='cursor-pointer ml-1 text-blue-500' onClick={() => toggleExpand(path)}>
							...
						</span>
					) : null}
					{isCurrentlyExpanded && (
						<>
							<span className='cursor-pointer ml-1 text-blue-500' onClick={() => toggleExpand(path)}>
								-
							</span>
							<div className='ml-5'>
								{Object.entries(json).map(([key, value], index) => (
									<div key={key}>
										<span className={mergedClasses.keyClass}>{key}:</span>
										<span> </span>
										{renderJson(value, path ? `${path}.${key}` : key)}
										{index < Object.entries(json).length - 1 ? <span>,</span> : null}
									</div>
								))}
							</div>
						</>
					)}
					<span className={mergedClasses.objectClass}>&#125;</span>
					{showType && <span className='text-gray-500'> object</span>}
				</span>
			)
		}

		return (
			<span data-path={path} className={highlightClass}>
				{String(json)}
			</span>
		)
	}

	const themeClass = isDarkTheme ? 'bg-[#08090a] text-white ' : 'bg-gray-50 border-gray-300 '

	return (
		<div className='w-full h-full flex flex-col rounded-md overflow-hidden border-2 border-[#202020] shadow-md'>
			{showToolbox && (
				<Toolbox
					onCopy={() => {
						const json = JSON.stringify(jsonData, null, 2)
						navigator.clipboard.writeText(json)
						return json
					}}
					onSearch={handleSearch}
					onExport={handleExport}
					theme={theme}
					onNext={handleNext}
					onPrev={handlePrev}
					hasResults={highlightedPaths.length > 0}
					toolboxOptions={toolboxOptions}
				/>
			)}
			<div ref={contentRef} className={`overflow-auto  font-mono whitespace-pre-wrap   p-2 ${themeClass}`}>
				{renderJson(jsonData)}
			</div>
		</div>
	)
}

export default JsonViewer
