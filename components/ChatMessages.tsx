"use client"

import { Companion } from '@prisma/client'
import React from 'react'
import ChatMessage, { ChatMessageProps } from '@/components/ChatMessage'

interface ChatMessagesProps {
  messages: ChatMessageProps[]
  isLoading: boolean
  companion: Companion
}

const ChatMessages = ({ messages, isLoading, companion }: ChatMessagesProps) => {
  return (
    <div className='flex-1 overflow-y-auto pr-4'>
      <ChatMessage src={companion.src} role="system" content={`Hello, I am ${companion.name}, ${companion.description}`} />
      <ChatMessage src={companion.src} role="user" content={`Hello, I am ${companion.name}, ${companion.description}`} />
    </div>
  )
}

export default ChatMessages
