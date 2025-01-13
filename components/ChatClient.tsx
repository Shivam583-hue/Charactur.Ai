"use client"

import { Companion } from '@prisma/client'
import React from 'react'
import { Message } from 'react-hook-form'
import ChatHeader from '@/components/ChatHeader'

interface ChatClientProps {
  companion: Companion & { _count: { messages: number }, messages: Message[] }
}

const ChatClient = ({ companion }: ChatClientProps) => {
  return (
    <div className='flex flex-col h-full p-4 space-y-2'>
      <ChatHeader companion={companion} />
    </div>
  )
}

export default ChatClient
