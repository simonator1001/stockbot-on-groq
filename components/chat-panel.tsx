import * as React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { FooterText } from '@/components/footer'
import { nanoid } from 'nanoid'
import { UserMessage, BotMessage } from './stocks/message'
import { Message, Session, UIState } from '@/lib/types'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
  messages: UIState
  setMessages: React.Dispatch<React.SetStateAction<UIState>>
}

const exampleMessages = [
  {
    heading: 'What is the price',
    subheading: 'of Apple Inc.?',
    message: 'What is the price of Apple stock?'
  },
  {
    heading: 'Show me a stock chart',
    subheading: 'for $GOOGL',
    message: 'Show me a stock chart for $GOOGL'
  },
  {
    heading: 'What are some recent',
    subheading: `events about Amazon?`,
    message: `What are some recent events about Amazon?`
  },
  {
    heading: `What are Microsoft's`,
    subheading: 'latest financials?',
    message: `What are Microsoft's latest financials?`
  },
  {
    heading: 'How is the stock market',
    subheading: 'performing today by sector?',
    message: `How is the stock market performing today by sector?`
  },
  {
    heading: 'Show me a screener',
    subheading: 'to find new stocks',
    message: 'Show me a screener to find new stocks'
  }
]

interface ExampleMessage {
  heading: string
  subheading: string
  message: string
}

export function ChatPanel({
  id,
  title,
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
  messages,
  setMessages
}: ChatPanelProps) {
  const [randExamples, setRandExamples] = useState<ExampleMessage[]>([])

  useEffect(() => {
    setRandExamples([...exampleMessages].sort(() => 0.5 - Math.random()))
  }, [])

  return (
    <div className="relative px-4">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="space-y-4 py-4">
        {messages.length === 0 && (
          <div className="grid grid-cols-2 gap-2">
            {randExamples.map((example, index) => (
              <div
                key={example.heading}
                className={`cursor-pointer border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${index >= 4 ? 'hidden md:block' : ''} ${index >= 2 ? 'hidden 2xl:block' : ''} `}
                onClick={async () => {
                  setMessages(currentMessages => [
                    ...currentMessages,
                    {
                      id: nanoid(),
                      display: <UserMessage>{example.message}</UserMessage>
                    }
                  ])

                  try {
                    const responseMessage = await fetch('/api/chat', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({
                        message: example.message,
                        model: localStorage.getItem('selectedModel') || 'groq'
                      })
                    })

                    const data = await responseMessage.json()
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
                          <BotMessage content="Sorry, there was an error. Please try again." />
                        )
                      }
                    ])
                  }
                }}
              >
                <div className="text-sm font-semibold">{example.heading}</div>
                <div className="text-sm text-zinc-600">
                  {example.subheading}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <PromptForm
            input={input}
            setInput={setInput}
            messages={messages}
            setMessages={setMessages}
          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
