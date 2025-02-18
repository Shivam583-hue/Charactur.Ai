"use client"

import React, { useEffect } from 'react'
import qs from 'query-string'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search } from 'lucide-react'
import useDebounce from '@/hooks/useDebounce'

const SearchInput = () => {

  const router = useRouter()
  const searchParams = useSearchParams()

  const categoryId = searchParams.get('categoryId')
  const name = searchParams.get('name')

  const [value, setValue] = useState(name || '')
  const debouncedValue = useDebounce<string>(value, 500)

  useEffect(() => {
    const query = {
      name: debouncedValue,
      categoryId: categoryId
    }

    const url = qs.stringifyUrl({
      url: window.location.href,
      query,
    }, { skipEmptyString: true, skipNull: true })

    router.push(url)

  }, [debouncedValue, router, categoryId])

  return (
    <div className='relative'>
      <Search className='absolute w-4 h-4 top-3 left-4 text-muted-foreground' />
      <Input className='pl-10 bg-primary/10' placeholder='Search...' onChange={(e) => setValue(e.target.value)} value={value} />
    </div>
  )
}

export default SearchInput
