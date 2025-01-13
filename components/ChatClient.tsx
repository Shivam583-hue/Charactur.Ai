"use client"

import { useCompletion } from "ai/react"
import { Companion } from '@prisma/client'
import React, { FormEvent, useState } from 'react'
import { Message } from 'react-hook-form'
import ChatHeader from '@/components/ChatHeader'
import { useRouter } from 'next/navigation'
import ChatForm from "./ChatForm"

interface ChatClientProps {
  companion: Companion & { _count: { messages: number }, messages: Message[] }
}

interface Message2 {
  id: string
  content: string
  companionId: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

const ChatClient = ({ companion }: ChatClientProps) => {

  const router = useRouter()

  const [messages, setMessages] = useState<any[]>(companion.messages)

  const {
    input,
    isLoading,
    handleSubmit,
    handleInputChange,
    setInput
  } = useCompletion({
    api: `/api/chat/${companion.id}`,
    onFinish(prompt, completion) {
      const systemMessage = {
        role: "system",
        content: completion,
      }
      setMessages((current) => [...current, systemMessage])
      setInput("")

      router.refresh()
    }
  })

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const userMessage = { role: "user", content: input }
    setMessages((current) => [...current, userMessage])

    handleSubmit(e)
  }

  return (
    <div className='flex flex-col h-full p-4 space-y-2'>
      <ChatHeader companion={companion} />
      <div>
        {/*Messages*/}
      </div>
      <ChatForm isLoading={isLoading} onSubmit={handleSubmit} input={input} handleInputChange={handleInputChange} />
    </div>
  )
}

export default ChatClient
