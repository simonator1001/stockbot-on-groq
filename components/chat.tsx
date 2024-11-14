'use client'

import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useEffect, useState } from 'react'
import { Message, Session, UIState } from '@/lib/types'
import { usePathname, useRouter } from 'next/navigation'
import { useScrollAnchor } from '@/lib/hooks/use-scroll-anchor'
import { toast } from 'sonner'
import { TickerTape } from '@/components/tradingview/ticker-tape'
import { MissingApiKeyBanner } from '@/components/missing-api-key-banner'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
  session?: Session
  missingKeys: string[]
}

export function Chat({ id, className, session, missingKeys }: ChatProps) {
  const router = useRouter()
  const path = usePathname()
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<UIState>([])
  const [mounted, setMounted] = useState(false)
  const [_, setNewChatId] = useLocalStorage('newChatId', id)

  const { scrollRef, messagesRef, visibilityRef, isAtBottom, scrollToBottom } =
    useScrollAnchor()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (session?.user) {
      if (!path.includes('chat') && messages.length === 1) {
        window.history.replaceState({}, '', `/chat/${id}`)
      }
    }
  }, [id, path, session?.user, messages])

  useEffect(() => {
    setNewChatId(id)
  }, [id, setNewChatId])

  useEffect(() => {
    if (mounted) {
      missingKeys.forEach(key => {
        toast.error(`Missing ${key} environment variable!`)
      })
    }
  }, [missingKeys, mounted])

  if (!mounted) return null

  return (
    <div className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      {messages.length ? (
        <MissingApiKeyBanner missingKeys={missingKeys} />
      ) : (
        <TickerTape />
      )}

      <div
        ref={scrollRef}
        className={cn('pb-[200px] pt-4 md:pt-10', className)}
      >
        <div className="relative mx-auto max-w-2xl px-4">
          <div ref={messagesRef}>
            {messages.length ? (
              <ChatList
                messages={messages}
                isShared={false}
                session={session}
              />
            ) : (
              <EmptyScreen />
            )}
            <div ref={visibilityRef} className="h-px" />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0">
        <div className="mx-auto max-w-2xl px-4">
          <div className="bg-gradient-to-b from-muted/50 from-0% to-muted/30 to-50%">
            <ChatPanel
              id={id}
              input={input}
              setInput={setInput}
              isAtBottom={isAtBottom}
              scrollToBottom={scrollToBottom}
              messages={messages}
              setMessages={setMessages}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
