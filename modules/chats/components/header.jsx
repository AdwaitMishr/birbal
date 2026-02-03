import { ModeToggle } from '@/components/ui/mode-toggle'
import { Sparkles } from 'lucide-react'
import React from 'react'

const Header = () => {
  return (
    <div className='flex h-16 w-full flex-row justify-between items-center border-b border-border bg-sidebar/50 backdrop-blur-sm px-6'>
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-secondary" />
        <span className="text-lg font-semibold text-foreground">Chat</span>
      </div>

      <ModeToggle />
    </div>
  )
}

export default Header