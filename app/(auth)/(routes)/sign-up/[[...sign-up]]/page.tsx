import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center bg-white min-w-screen'>
      <SignUp />
    </div>
  )
}
