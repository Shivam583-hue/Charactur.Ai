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

  const [fakeLoading, setFakeLoading] = React.useState(messages.length === 0 ? true : false)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFakeLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='flex-1 overflow-y-auto pr-4'>
      <ChatMessage isLoading={fakeLoading} src={companion.src} role="system" content={`Hello, I am ${companion.name}, ${companion.description}`} />
      {messages.map((message) => (
        <ChatMessage key={message.content} isLoading={isLoading} src={companion.src} role={message.role} content={message.content} />
      ))}
      {isLoading && <ChatMessage isLoading src={companion.src} role="system" />}
      <div ref={scrollRef} />
    </div>
  )
}

export default ChatMessages
