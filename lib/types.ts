import { CoreMessage } from 'ai'

export type Message = CoreMessage & {
  id: string
}

export interface Chat extends Record<string, any> {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: Message[]
  sharePath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface Session {
  user: {
    id: string
    email: string
  }
}

export interface AuthResult {
  type: string
  message: string
}

export interface User extends Record<string, any> {
  id: string
  email: string
  password: string
  salt: string
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export type AIState = {
  chatId: string
  messages: Message[]
}

export type ModelProvider = 'groq' | 'together'

export interface ModelConfig {
  apiKey: string | undefined
  model: string
  baseUrl?: string
  headers?: Record<string, string>
}

export const MODEL_CONFIGS: Record<ModelProvider, ModelConfig> = {
  groq: {
    apiKey: undefined,
    model: 'mixtral-8x7b-32768',
    baseUrl: 'https://api.groq.com/openai/v1/chat/completions'
  },
  together: {
    apiKey: undefined,
    model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
    baseUrl: 'https://api.together.xyz/inference',
    headers: {
      Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`
    }
  }
}
