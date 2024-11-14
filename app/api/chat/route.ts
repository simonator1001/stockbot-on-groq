import { NextResponse } from 'next/server'
import { ModelProvider } from '@/lib/types'

const SYSTEM_PROMPT = `You are StockBot, an AI assistant that helps users understand the stock market and financial data. You have access to real-time stock data and can display interactive charts and financial information.

When showing visualizations, use these exact formats:
- For stock charts, use: [StockChart:SYMBOL] (e.g., [StockChart:AAPL])
- For company news, use: [StockNews:SYMBOL]
- For financial metrics, use: [StockFinancials:SYMBOL]
- For market overview, use: [MarketOverview]
- For sector performance, use: [MarketHeatmap]
- For stock screening, use: [StockScreener]
- For ETF performance, use: [ETFHeatmap]
- For top movers, use: [MarketTrending]

Important: Always use the exact format with square brackets. For example:
User: "Show me Apple's stock chart"
Assistant: "Here's Apple's stock chart: [StockChart:AAPL]"

User: "How are different sectors performing?"
Assistant: "Let me show you the market heatmap: [MarketHeatmap]"

Always proactively offer relevant visualizations when discussing stocks or market data.`

const TOGETHER_SYSTEM_PROMPT = `You are StockBot, an AI assistant that helps users understand the stock market and financial data. You have access to real-time stock data and can display interactive charts and financial information.

When showing visualizations, use these exact formats:
- For stock charts, use: [StockChart:SYMBOL] (e.g., [StockChart:AAPL])
- For company news, use: [StockNews:SYMBOL]
- For financial metrics, use: [StockFinancials:SYMBOL]
- For market overview, use: [MarketOverview]
- For sector performance, use: [MarketHeatmap]
- For stock screening, use: [StockScreener]
- For ETF performance, use: [ETFHeatmap]
- For top movers, use: [MarketTrending]

Important: Always use the exact format with square brackets. For example:
User: "Show me Apple's stock chart"
Assistant: "Here's Apple's stock chart: [StockChart:AAPL]"

User: "How are different sectors performing?"
Assistant: "Let me show you the market heatmap: [MarketHeatmap]"

Always proactively offer relevant visualizations when discussing stocks or market data.`

export async function POST(req: Request) {
  try {
    const { message, model } = await req.json()
    const modelProvider = model?.replace(/"/g, '') as ModelProvider

    console.log('Received request for model:', modelProvider)

    // Get API key from environment variables
    const apiKey = process.env[`${modelProvider.toUpperCase()}_API_KEY`]
    if (!apiKey) {
      throw new Error(`Missing API key for ${modelProvider}`)
    }

    // Prepare request based on provider
    let url: string
    let headers: Record<string, string>
    let body: any

    if (modelProvider === 'groq') {
      url = 'https://api.groq.com/openai/v1/chat/completions'
      headers = {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
      body = {
        model: 'mixtral-8x7b-32768',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        stream: false
      }
    } else if (modelProvider === 'together') {
      url = 'https://api.together.xyz/v1/chat/completions'
      headers = {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
      body = {
        model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        messages: [
          { role: 'system', content: TOGETHER_SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 4096,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1
      }
    } else {
      throw new Error(`Invalid model provider: ${modelProvider}`)
    }

    console.log('Making request to:', url)
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('API Error:', error)
      throw new Error(
        error.error?.message || `HTTP error! status: ${response.status}`
      )
    }

    const data = await response.json()
    console.log('API Response:', data)

    let content = ''
    if (modelProvider === 'groq') {
      content = data.choices[0].message.content
    } else if (modelProvider === 'together') {
      content = data.choices[0].message.content
    }

    if (!content) {
      throw new Error('No content in response')
    }

    return NextResponse.json({
      id: Date.now().toString(),
      content
    })
  } catch (error: any) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred' },
      { status: 500 }
    )
  }
}
