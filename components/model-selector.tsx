'use client'

import * as React from 'react'
import { useModelSelection } from '@/lib/hooks/use-model-selection'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { IconChevronDown } from '@/components/ui/icons'

export function ModelSelector() {
  const { selectedModel, setModel, models } = useModelSelection()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const currentModel = models[selectedModel]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm font-medium hover:bg-accent">
        {currentModel.name}
        <IconChevronDown className="ml-2 size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.values(models).map(model => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => setModel(model.id)}
            className="flex flex-col items-start"
          >
            <span className="font-medium">{model.name}</span>
            <span className="text-xs text-muted-foreground">
              {model.description}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
