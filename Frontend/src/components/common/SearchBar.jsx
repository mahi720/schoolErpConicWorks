import React, { useState } from 'react'
import { Search, X } from 'lucide-react'

export default function SearchBar({ 
  placeholder = 'Search...', 
  onSearch, 
  onClear,
  value = '',
  className = ''
}) {
  const [query, setQuery] = useState(value)

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    onSearch(val)
  }

  const handleClear = () => {
    setQuery('')
    onClear?.()
    onSearch('')
  }

  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="absolute left-3 top-2.5 text-gray-600 dark:text-gray-300 pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="w-full pl-10 pr-10 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-2.5 text-gray-600 dark:text-gray-300 hover:text-black dark:text-white transition-colors"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
