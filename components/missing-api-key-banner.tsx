import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Button, buttonVariants } from '@/components/ui/button'

type ApiProviderKey = 'GROQ_API_KEY' | 'TOGETHER_API_KEY'

const API_PROVIDERS: Record<ApiProviderKey, { name: string; url: string }> = {
  GROQ_API_KEY: {
    name: 'Groq',
    url: 'https://console.groq.com/keys'
  },
  TOGETHER_API_KEY: {
    name: 'Together AI',
    url: 'https://api.together.xyz/settings/api-keys'
  }
}

export function MissingApiKeyBanner({
  missingKeys
}: {
  missingKeys: string[]
}) {
  if (missingKeys.length === 0) {
    return null
  }

  return (
    <div className="border p-4">
      <div className="font-medium text-red-700">
        Missing API key{missingKeys.length > 1 ? 's' : ''} for:{' '}
        {missingKeys
          .map(key => API_PROVIDERS[key as ApiProviderKey]?.name)
          .join(', ')}
      </div>
      <div className="mt-2 flex flex-col gap-2">
        {missingKeys.map(key => (
          <a
            key={key}
            href={API_PROVIDERS[key as ApiProviderKey]?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-red-800 hover:text-red-900"
          >
            <span
              className="ml-1 font-semibold text-primary"
              style={{ textDecoration: 'underline' }}
            >
              Get a {API_PROVIDERS[key as ApiProviderKey]?.name} API Key
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
