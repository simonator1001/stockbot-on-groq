'use client'

import React, { useEffect, useRef } from 'react'
import BaseWidget from './base-widget'

interface StockChartProps {
  symbol: string
  comparisonSymbols?: string[]
}

export default function StockChart({
  symbol,
  comparisonSymbols = []
}: StockChartProps) {
  // Clean symbol (remove $ if present and ensure uppercase)
  const cleanSymbol = symbol.replace('$', '').toUpperCase()

  const scriptContent = `
    {
      "width": "100%",
      "height": "100%",
      "symbol": "${cleanSymbol}",
      "interval": "D",
      "timezone": "exchange",
      "theme": "light",
      "style": "1",
      "locale": "en",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "hide_top_toolbar": false,
      "hide_legend": false,
      "save_image": false,
      "studies": [
        "MASimple@tv-basicstudies"
      ],
      "show_popup_button": false,
      "withdateranges": true,
      "hide_side_toolbar": false,
      "details": true,
      "hotlist": true,
      "calendar": true,
      "news": ["${cleanSymbol}"],
      "studies_overrides": {},
      "container_id": "tradingview_${cleanSymbol}"
    }`

  return (
    <BaseWidget
      scriptSrc="https://s3.tradingview.com/tv.js"
      scriptContent={scriptContent}
      containerHeight="600px"
      showCopyright={true}
      containerId={`tradingview_${cleanSymbol}`}
    />
  )
}
