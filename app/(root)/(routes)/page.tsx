import Categories from '@/components/categories';
import SearchInput from '@/components/SearchInput'
import prismadb from '@/lib/prismadb';
import React, { Suspense } from 'react';

const RootPage = async () => {

  const categories = await prismadb.category.findMany()

  return (
    <div className='h-full p-4 space-y-2'>
      <Suspense fallback={<div>Loading Search...</div>}>
        <SearchInput />
        <Categories data={categories} />
      </Suspense>
    </div>
  )
}

export default RootPage
