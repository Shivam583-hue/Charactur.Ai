"use client"

import { useCompletion } from "ai/react"
import { Companion, Message } from '@prisma/client'
import React, { FormEvent, useState } from 'react'
import ChatHeader from '@/components/ChatHeader'
import { useRouter } from 'next/navigation'
import ChatForm from "./ChatForm"
import ChatMessages from "./ChatMessages"
import { ChatMessageProps } from "./ChatMessage"

export interface ChatClientProps {
  companion: Companion & { messages: Message[]; _count: { messages: number }; }
}

const ChatClient = ({ companion }: ChatClientProps) => {

  const router = useRouter()

  const [messages, setMessages] = useState<ChatMessageProps[]>(companion.messages)

  const {
    input,
    isLoading,
    handleSubmit,
    handleInputChange,
    setInput
  } = useCompletion({
    api: `/api/chat/${companion.id}`,
    onFinish(prompt, completion) {
      const systemMessage: ChatMessageProps = {
        role: "system",
        content: completion,
      }
      setMessages((current) => [...current, systemMessage])
      setInput("")

      router.refresh()
      router.refresh()
    }
  })

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage: ChatMessageProps = { role: "user", content: input }
    setMessages((current) => [...current, userMessage])

    handleSubmit(e)
  }

  return (
    <div className='flex flex-col h-full p-4 space-y-2'>
      <ChatHeader companion={companion} />
      <ChatMessages companion={companion} isLoading={isLoading} messages={messages} />
      <ChatForm isLoading={isLoading} onSubmit={onSubmit} input={input} handleInputChange={handleInputChange} />
    </div>
  )
}

export default ChatClient
