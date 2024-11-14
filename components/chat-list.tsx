import { Separator } from '@/components/ui/separator'
import { Session } from '@/lib/types'
import { UIState } from '@/lib/types'

export interface ChatList {
  messages: UIState
  session?: Session
  isShared: boolean
}

export function ChatList({ messages, session, isShared }: ChatList) {
  if (!messages.length) {
    return null
  }

  return (
    <div className="w-full">
      {messages.map((message, index: number) => (
        <div key={message.id} className="mb-4">
          {message.display}
          {index < messages.length - 1 && <Separator className="my-4" />}
        </div>
      ))}
    </div>
  )
}
