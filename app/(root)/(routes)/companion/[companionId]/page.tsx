import CompanionForm from '@/components/CompanionForm'
import prismadb from '@/lib/prismadb'
import React from 'react'

interface CompanyionIdPageProps {
  params: {
    companionId: string
  }
}

const CompanionIdPage = async ({ params }: CompanyionIdPageProps) => {
  //TODO : Check subscription

  const { companionId } = await params

  const companion = await prismadb.companion.findUnique({
    where: {
      id: companionId
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
