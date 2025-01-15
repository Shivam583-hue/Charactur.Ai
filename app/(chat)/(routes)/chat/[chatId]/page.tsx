import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import React from 'react'
import prismadb from '@/lib/prismadb'
import ChatClient from '@/components/ChatClient'

interface ChatIdPageProps {
  params: {
    chatId: string
  }
}

const ChatIdPage = async ({ params }: ChatIdPageProps) => {

  const { userId } = await auth()
  //const id = (await params).chatId
  const { chatId } = params

  if (!userId) {
    return redirect('/sign-in')
  }

  const companion = await prismadb.companion.findUnique({
    where: {
      id: chatId,
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

export default ChatIdPage
