"use client"

import { useToast } from '@/hooks/use-toast'
import { BeatLoader } from 'react-spinners'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import React from 'react'
import BotAvatar from '@/components/BotAvatar'
import UserAvatar from '@/components/UserAvatar'
import { Button } from './ui/button'
import { Copy } from 'lucide-react'

export interface ChatMessageProps {
  role: "user" | "system",
  content?: string
  isLoading?: boolean
  src?: string
}

const ChatMessage = ({ role, content, isLoading, src }: ChatMessageProps) => {

  const { toast } = useToast()
  const { theme } = useTheme()

  const onCopy = () => {
    if (!content) {
      return;
    }

    navigator.clipboard.writeText(content)
    toast({
      description: "Message copied to clipboard"
    })
  }

  return (
    <div className={cn("group flex items-start gap-x-3 py-4 w-full",
      role === "user" && "justify-end",
    )}>
      {role !== "user" && src && <BotAvatar src={src} />}
      <div className='rounded-md px-4 py-2 max-w-full text-sm bg-primary/10'>
        {isLoading ? <BeatLoader color={theme === "light" ? "black" : "white"} size={5} /> : content}
      </div>
      {role === "user" && <UserAvatar />}
      {role !== "user" && !isLoading && <Button onClick={onCopy} className='opacity-0 group-hover:opacity-100 transition' size='icon' variant='ghost'><Copy className='w-4 h-4' /></Button>}
    </div>
  )
}

export default ChatMessage
