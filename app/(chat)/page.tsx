'use client'

import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { getMissingKeys } from '@/app/actions'
import { useEffect, useState } from 'react'

export default function ChatPage() {
  const id = nanoid()
  const [missingKeys, setMissingKeys] = useState<string[]>([])

  useEffect(() => {
    const fetchMissingKeys = async () => {
      const keys = await getMissingKeys()
      setMissingKeys(keys)
    }
    fetchMissingKeys()
  }, [])

  return <Chat id={id} missingKeys={missingKeys} />
}
