"use client"

import React from 'react'
import { CldUploadButton } from 'next-cloudinary'
import Image from 'next/image'

interface ImageUploadProps {
  value: string
  onChange: (src: string) => void
}

const ImageUpload = ({ value, onChange }: ImageUploadProps) => {

  const [isMounted, setIsMounted] = React.useState(false)
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  console.log(value)

  return (
    <div className='space-y-4 w-full flex flex-col items-center justify-center'>
      <CldUploadButton
        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        onUpload={(result: any) => {
          onChange(result.info.secure_url)
        }}
        options={{
          maxFiles: 1,
        }}
        uploadPreset='hmmmmmmmm'
      >
        <div className='p-4 border-4 border-dashed border-primary/10 rounded-lg hover:opacity-75 transition flex flex-col space-y-2 items-center justify-center'>
          <div className='relative h-40 w-40'>
            <Image fill alt='Upload' src={value || '/placeholder.svg'} className='rounded-lg object-cover' />
          </div>
        </div>
      </CldUploadButton>

    </div>
  )
}

export default ImageUpload
