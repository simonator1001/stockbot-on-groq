import { useCallback, useEffect, useRef, useState } from 'react'

export function useScrollAnchor() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesRef = useRef<HTMLDivElement>(null)
  const visibilityRef = useRef<HTMLDivElement>(null)
  const [isAtBottom, setIsAtBottom] = useState(true)

  const checkIfAtBottom = useCallback(() => {
    if (!scrollRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    const atBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 100
    setIsAtBottom(atBottom)
  }, [])

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (scrollElement) {
      const handleScroll = () => {
        checkIfAtBottom()
      }

      scrollElement.addEventListener('scroll', handleScroll, { passive: true })
      return () => scrollElement.removeEventListener('scroll', handleScroll)
    }
  }, [checkIfAtBottom])

  const scrollToBottom = useCallback(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
      setIsAtBottom(true)
    }
  }, [])

  return {
    scrollRef,
    messagesRef,
    visibilityRef,
    isAtBottom,
    scrollToBottom
  }
}
