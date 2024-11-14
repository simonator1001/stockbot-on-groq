'use client'

import React, { useEffect, useRef } from 'react'

declare global {
  interface Window {
    TradingView?: any
  }
}

interface BaseWidgetProps {
  scriptSrc: string
  scriptContent: string
  containerHeight: string
  showCopyright?: boolean
  containerId?: string
}

export default function BaseWidget({
  scriptSrc,
  scriptContent,
  containerHeight,
  showCopyright = true,
  containerId
}: BaseWidgetProps) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const currentContainer = container.current
    if (!currentContainer) return

    // Create widget container
    const widgetContainer = document.createElement('div')
    widgetContainer.className = 'tradingview-widget-container__widget'
    if (containerId) {
      widgetContainer.id = containerId
    }
    currentContainer.appendChild(widgetContainer)

    const script = document.createElement('script')
    script.src = scriptSrc
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = scriptContent

    currentContainer.appendChild(script)

    return () => {
      if (currentContainer) {
        const scriptElement = currentContainer.querySelector('script')
        const widgetContainer = currentContainer.querySelector(
          '.tradingview-widget-container__widget'
        )
        if (scriptElement) {
          scriptElement.remove()
        }
        if (widgetContainer) {
          widgetContainer.remove()
        }
      }
    }
  }, [scriptSrc, scriptContent, containerId])

  return (
    <div style={{ height: containerHeight }}>
      <div className="tradingview-widget-container h-full" ref={container}>
        {showCopyright && (
          <div className="tradingview-widget-copyright">
            <a
              href="https://www.tradingview.com/"
              rel="noopener nofollow"
              target="_blank"
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Track all markets on TradingView
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
