import SearchInput from '@/components/SearchInput'
import React, { Suspense } from 'react';

const RootPage = () => {
  return (
    <div className='h-full p-4 space-y-2'>
      <Suspense fallback={<div>Loading Search...</div>}>
        <SearchInput />
      </Suspense>
    </div>
  )
}

export default RootPage
