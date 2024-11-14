import 'server-only'

import { nanoid } from 'nanoid'
import {
  Message,
  ModelProvider,
  MODEL_CONFIGS,
  UIState,
  AIState
} from '@/lib/types'
import { BotMessage } from '@/components/stocks/message'
import { StreamingTextResponse, AIStream } from 'ai'

export const AI = {
  initialUIState: [] as UIState,
  initialAIState: { chatId: '', messages: [] } as AIState
}

async function chat(
  messages: Message[],
  modelProvider: ModelProvider = 'groq'
) {
  const config = MODEL_CONFIGS[modelProvider]
  if (!config.apiKey) {
    throw new Error(`Missing API key for ${modelProvider}`)
  }

  try {
    const response = await fetch(config.baseUrl!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(config.headers || {
          Authorization: `Bearer ${config.apiKey}`
        })
      },
      body: JSON.stringify({
        model: config.model,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        temperature: 0.7,
        stream: true
      })
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(
        error.error?.message || `HTTP error! status: ${response.status}`
      )
    }

    // Convert the response into a friendly text-stream
    const stream = AIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('Chat error:', error)
    throw error
  }
}

export async function submitUserMessage(
  message: string,
  modelProvider: ModelProvider = 'groq'
) {
  const messages: Message[] = [
    {
      id: nanoid(),
      role: 'user',
      content: message
    }
  ]

  try {
    const streamingResponse = await chat(messages, modelProvider)
    const reader = streamingResponse.body?.getReader()
    if (!reader) throw new Error('No response body')

    let text = ''
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      text += new TextDecoder().decode(value)
    }

    return {
      id: nanoid(),
      display: <BotMessage content={text} />
    }
  } catch (error: any) {
    console.error('Chat error:', error)
    return {
      id: nanoid(),
      display: (
        <BotMessage content={`Error: ${error?.message || 'Unknown error'}`} />
      )
    }
  }
}
