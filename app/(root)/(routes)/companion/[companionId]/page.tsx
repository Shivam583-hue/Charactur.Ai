import CompanionForm from '@/components/CompanionForm'
import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

interface CompanyionIdPageProps {
  params: {
    companionId: string
  }
}

const CompanionIdPage = async ({ params }: CompanyionIdPageProps) => {
  //TODO : Check subscription

  const { companionId } = await params
  const { userId } = await auth()

  if (!userId) return redirect('/sign-in')

  const companion = await prismadb.companion.findUnique({
    where: {
      id: companionId,
      userId,
    }
  })

  const categories = await prismadb.category.findMany()

  return (
    <CompanionForm
      initialData={companion}
      categories={categories}
    />
  )
}

export default CompanionIdPage
