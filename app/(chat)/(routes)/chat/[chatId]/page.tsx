import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import React from 'react'
import prismadb from '@/lib/prismadb'
import ChatClient from '@/components/ChatClient'

interface ChatIdPageProps {
  params: Promise<{
    chatId: string
  }>
}

export default async function ChatIdPage({ params }: ChatIdPageProps) {
  const { userId } = await auth()


  if (!userId) {
    return redirect('/sign-in')
  }

  const companion = await prismadb.companion.findUnique({
    where: {
      id: (await params).chatId
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc"
        },
        where: {
          userId
        }
      },
      _count: {
        select: {
          messages: true
        }
      }
    },
  })

  if (!companion) {
    return redirect('/')
  }

  return (
    <ChatClient companion={companion} />
  )
}

