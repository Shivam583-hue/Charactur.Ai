import Categories from '@/components/categories';
import Companions from '@/components/Companions';
import SearchInput from '@/components/SearchInput'
import prismadb from '@/lib/prismadb';
import React, { Suspense } from 'react';

interface RootPageProps {
  searchParams: Promise<{
    categoryId: string
    name: string
  }>
}

const RootPage = async ({ searchParams }: RootPageProps) => {

  const categoryId = (await searchParams).categoryId
  const name = (await searchParams).name

  const data = await prismadb.companion.findMany({
    where: {
      categoryId: categoryId,
      name: {
        search: name,
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      _count: {
        select: {
          messages: true
        }
      }
    }
  });

  const categories = await prismadb.category.findMany()

  return (
    <div className='h-full p-4 space-y-2'>
      <Suspense fallback={<div>Loading Search...</div>}>
        <SearchInput />
        <Categories data={categories} />
        <Companions data={data} />
      </Suspense>
    </div>
  )
}

export default RootPage
