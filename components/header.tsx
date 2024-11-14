'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { IconGroq, IconSeparator } from '@/components/ui/icons'
import { ModelSelector } from '@/components/model-selector'

function UserOrLogin() {
  return (
    <>
      <Link href="/" rel="nofollow" className="flex items-center">
        <span className="text-base font-semibold" style={{ color: '#F55036' }}>
          SimonLab
        </span>
      </Link>

      <div className="flex items-center">
        <IconSeparator className="size-6 text-muted-foreground/50" />
        <span className="text-base font-semibold">Simon&apos;s Stock.ai</span>
        <IconSeparator className="size-6 text-muted-foreground/50" />
        <Link
          href="/new"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'text-base font-semibold'
          )}
          style={{ borderRadius: 0, color: '#F55036', padding: '4px' }}
        >
          Start New Chat
        </Link>
        <IconSeparator className="size-6 text-muted-foreground/50" />
        <ModelSelector />
      </div>
    </>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-gradient-to-b from-background/10 via-background/50 to-background/80 px-4 backdrop-blur-xl">
      <div className="flex items-center">
        <UserOrLogin />
      </div>
    </header>
  )
}
