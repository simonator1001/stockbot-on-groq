'use client'

import { IconGroq, IconUser } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import { spinner } from './spinner'
import { CodeBlock } from '../ui/codeblock'
import { MemoizedReactMarkdown } from '../markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { StreamableValue } from 'ai/rsc'
import { useStreamableText } from '@/lib/hooks/use-streamable-text'
import dynamic from 'next/dynamic'
import React from 'react'

// Dynamically import TradingView components
const MarketHeatmap = dynamic(() => import('../tradingview/market-heatmap'))
const MarketTrending = dynamic(() => import('../tradingview/market-trending'))
const StockChart = dynamic(() => import('../tradingview/stock-chart'))
const StockNews = dynamic(() => import('../tradingview/stock-news'))
const StockFinancials = dynamic(() => import('../tradingview/stock-financials'))
const MarketOverview = dynamic(() => import('../tradingview/market-overview'))
const StockScreener = dynamic(() => import('../tradingview/stock-screener'))
const ETFHeatmap = dynamic(() => import('../tradingview/etf-heatmap'))

// Different types of message bubbles.

export function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[25px] shrink-0 select-none items-center justify-center rounded-md border bg-background shadow-sm">
        <IconUser />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden pl-2">
        {children}
      </div>
    </div>
  )
}

// Move renderComponent outside of BotMessage and make it a proper React component
function RenderTradingViewComponent({ toolCall }: { toolCall: string }) {
  const wrapperStyle = {
    color: '#000000',
    backgroundColor: '#ffffff',
    padding: '1rem',
    borderRadius: '0.5rem',
    marginTop: '1rem',
    marginBottom: '1rem',
    width: '100%',
    minHeight: '500px',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  }

  // Parse tool call format [Tool:param] first
  const match = toolCall.match(/\[(\w+):?(.*?)\]/)
  const [_, tool = '', param = ''] = match || ['', '', '']
  const symbol = param?.trim()

  const component = React.useMemo(() => {
    if (!match) return null

    switch (tool.toLowerCase()) {
      case 'stockchart':
        return <StockChart symbol={symbol} comparisonSymbols={[]} />
      case 'stocknews':
        return <StockNews symbol={symbol} />
      case 'stockfinancials':
        return <StockFinancials symbol={symbol} />
      case 'marketheatmap':
        return <MarketHeatmap />
      case 'marketoverview':
        return <MarketOverview />
      case 'stockscreener':
        return <StockScreener />
      case 'etfheatmap':
        return <ETFHeatmap />
      case 'markettrending':
        return <MarketTrending />
      default:
        return null
    }
  }, [tool, symbol, match])

  if (!component) return null

  return (
    <div style={wrapperStyle}>
      <React.Suspense
        fallback={
          <div className="flex h-[500px] items-center justify-center bg-white">
            <div className="size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
          </div>
        }
      >
        {component}
      </React.Suspense>
    </div>
  )
}

export function BotMessage({
  content,
  className
}: {
  content: string | StreamableValue<string>
  className?: string
}) {
  const text = useStreamableText(content)

  // Process text to replace tool calls with components
  const processText = (text: string) => {
    const parts = text.split(/(\[.*?\])/)
    return parts.map((part, index) => {
      if (part.startsWith('[') && part.endsWith(']')) {
        return <RenderTradingViewComponent key={index} toolCall={part} />
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <div className={cn('group relative flex items-start md:-ml-12', className)}>
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-[#f55036] text-primary-foreground shadow-sm">
        <IconGroq />
      </div>
      <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
        <div className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
          {processText(text)}
        </div>
      </div>
    </div>
  )
}

export function BotCard({
  children,
  showAvatar = true
}: {
  children: React.ReactNode
  showAvatar?: boolean
}) {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div
        className={cn(
          'flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-[#f55036] text-primary-foreground shadow-sm',
          !showAvatar && 'invisible'
        )}
      >
        <IconGroq />
      </div>
      <div className="ml-4 flex-1 pl-2">{children}</div>
    </div>
  )
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        'mt-2 flex items-center justify-center gap-2 text-xs text-gray-500'
      }
    >
      <div className={'max-w-[600px] flex-initial p-2'}>{children}</div>
    </div>
  )
}

export function SpinnerMessage() {
  return (
    <div className="group relative flex items-start md:-ml-12">
      <div className="flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-[#f55036] text-primary-foreground shadow-sm">
        <IconGroq />
      </div>
      <div className="ml-4 flex h-[24px] flex-1 flex-row items-center space-y-2 overflow-hidden px-1">
        {spinner}
      </div>
    </div>
  )
}
