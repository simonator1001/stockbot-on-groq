'use client'

import BaseWidget from './base-widget'

export default function MarketHeatmap() {
  const scriptContent = `
    {
      "exchanges": [],
      "dataSource": "SPX500",
      "grouping": "sector",
      "blockSize": "market_cap_basic",
      "blockColor": "change",
      "locale": "en",
      "symbolUrl": "",
      "colorTheme": "light",
      "hasTopBar": false,
      "isDataSetEnabled": false,
      "isZoomEnabled": true,
      "hasSymbolTooltip": true,
      "width": "100%",
      "height": "100%"
    }`

  return (
    <BaseWidget
      scriptSrc="https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js"
      scriptContent={scriptContent}
      containerHeight="600px"
      showCopyright={false}
    />
  )
}
