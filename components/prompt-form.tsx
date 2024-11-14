'use client'

import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import { useActions, useUIState } from 'ai/rsc'

import { UserMessage } from './stocks/message'
import { AI } from '@/lib/chat/actions'
import { Button } from '@/components/ui/button'
import { IconArrowDown, IconPlus } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { nanoid } from 'nanoid'
import { useRouter } from 'next/navigation'

import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { ModelProvider } from '@/lib/types'
import { BotMessage } from '@/components/stocks/message'
import { UIState } from '@/lib/types'

type UIMessage = {
  id: string
  display: React.ReactNode
}

type Messages = UIMessage[]

export function PromptForm({
  input,
  setInput,
  messages,
  setMessages
}: {
  input: string
  setInput: (value: string) => void
  messages: UIState
  setMessages: React.Dispatch<React.SetStateAction<UIState>>
}) {
  const router = useRouter()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const [selectedModel] = useLocalStorage('selectedModel', 'groq')

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      ref={formRef}
      onSubmit={async (e: React.FormEvent) => {
        e.preventDefault()

        if (window.innerWidth < 600) {
          const target = e.target as HTMLFormElement
          target['message']?.blur()
        }

        const value = input.trim()
        setInput('')
        if (!value) return

        setMessages(currentMessages => [
          ...currentMessages,
          {
            id: nanoid(),
            display: <UserMessage>{value}</UserMessage>
          }
        ])

        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: value,
              model: selectedModel
            })
          })

          const data = await response.json()
          if (data.error) throw new Error(data.error)

          setMessages(currentMessages => [
            ...currentMessages,
            {
              id: nanoid(),
              display: <BotMessage content={data.content} />
            }
          ])
        } catch (error) {
          console.error('Error:', error)
          setMessages(currentMessages => [
            ...currentMessages,
            {
              id: nanoid(),
              display: (
                <BotMessage content="Sorry, there was an error processing your message. Please try again." />
              )
            }
          ])
        }
      }}
    >
      <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:border sm:px-12">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-[14px] size-8 rounded-full bg-background p-0 sm:left-4"
              onClick={() => {
                router.push('/new')
              }}
            >
              <IconPlus />
              <span className="sr-only">New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder="Send a message."
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          name="message"
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="absolute right-0 top-[13px] sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" size="icon" disabled={input === ''}>
                <div className="rotate-180">
                  <IconArrowDown />
                </div>
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}
