"use client"

import { cn } from '@/lib/utils'
import qs from 'query-string'
import { useRouter, useSearchParams } from 'next/navigation'
import { Category } from '@prisma/client'
import React from 'react'

interface CategoryProps {
  data: Category[]
}

const Categories = ({ data }: CategoryProps) => {

  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryId = searchParams.get('categoryId')

  const onClick = (id: string | undefined) => {
    const query = {
      categoryId: id
    }

    const url = qs.stringifyUrl({
      url: window.location.href,
      query,
    }, { skipNull: true })

    router.push(url)
  }

  return (
    <div className='w-full overflow-x-auto space-x-2 flex p-1'>
      <button onClick={() => onClick(undefined)} className={cn("flex items-center text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 rounded-md transition hover:opacity-75", !categoryId ? "bg-primary/25" : "bg-primary/10")}>
        Newest
      </button>
      {data.map((category) => (
        <button key={category.id} onClick={() => onClick(category.id)} className={cn("flex items-center text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 rounded-md transition hover:opacity-75", category.id === categoryId ? "bg-primary/25" : "bg-primary/10")}>
          {category.name}
        </button>
      ))}

    </div>
  )
}

export default Categories
