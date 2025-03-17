"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

interface Category {
  id: string | number;
  title: string;
  slug: string;
}

export function CategoryFilter({ categories, selectedCategory }: { 
  categories: Category[];
  selectedCategory: string;
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Create a new URLSearchParams instance to modify
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )
  
  // Handle category selection without page reload
  const handleCategoryChange = (category: string) => {
    const query = category === 'all' ? '' : createQueryString('category', category)
    router.push(query ? `/?${query}` : '/', { scroll: false })
  }
  
  return (
    <div className="flex flex-wrap gap-2">
      <button 
        onClick={() => handleCategoryChange('all')}
        className={`px-3 sm:px-4 py-1.5 ${selectedCategory === 'all' ? 'bg-[#EBECEB] text-[#171717]' : 'bg-transparent border border-[#333333]/50 text-[#EBECEB]'} rounded-none text-sm`}
      >
        All
      </button>
      
      {categories && categories.length > 0 && (
        <>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.title)}
              className={`px-3 sm:px-4 py-1.5 ${selectedCategory === category.title ? 'bg-[#EBECEB] text-[#171717]' : 'bg-transparent border border-[#333333]/50 text-[#EBECEB]'} rounded-none text-sm`}
            >
              {category.title}
            </button>
          ))}
        </>
      )}
      
      {/* Fallback categories if API fails */}
      {(!categories || categories.length === 0) && (
        <>
          <button 
            onClick={() => handleCategoryChange('Consumer')}
            className={`px-3 sm:px-4 py-1.5 ${selectedCategory === 'Consumer' ? 'bg-[#EBECEB] text-[#171717]' : 'bg-transparent border border-[#333333]/50 text-[#EBECEB]'} rounded-none text-sm`}
          >
            Consumer
          </button>
          <button 
            onClick={() => handleCategoryChange('Onchain')}
            className={`px-3 sm:px-4 py-1.5 ${selectedCategory === 'Onchain' ? 'bg-[#EBECEB] text-[#171717]' : 'bg-transparent border border-[#333333]/50 text-[#EBECEB]'} rounded-none text-sm`}
          >
            Onchain
          </button>
          <button 
            onClick={() => handleCategoryChange('Builder')}
            className={`px-3 sm:px-4 py-1.5 ${selectedCategory === 'Builder' ? 'bg-[#EBECEB] text-[#171717]' : 'bg-transparent border border-[#333333]/50 text-[#EBECEB]'} rounded-none text-sm`}
          >
            Builder
          </button>
        </>
      )}
    </div>
  )
} 