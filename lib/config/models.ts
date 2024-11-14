export const MODEL_PROVIDERS = {
  groq: {
    id: 'groq',
    name: 'Groq (Llama-3-70b)',
    description: 'Fastest inference',
    baseUrl: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'mixtral-8x7b-32768',
    envKey: 'GROQ_API_KEY'
  },
  together: {
    id: 'together',
    name: 'Together (Llama-3-70b)',
    description: 'High performance',
    baseUrl: 'https://api.together.xyz/v1/chat/completions',
    model: 'togethercomputer/llama-2-70b-chat',
    envKey: 'TOGETHER_API_KEY'
  }
} as const

export type ModelProvider = keyof typeof MODEL_PROVIDERS
