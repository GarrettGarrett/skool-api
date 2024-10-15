import React from 'react'
import { cn } from "@/lib/utils"

interface CodeProps extends React.HTMLAttributes<HTMLPreElement> {
  children: React.ReactNode
}

export function Code({ children, className, ...props }: CodeProps) {
  return (
    <pre className={cn(
      "bg-muted text-muted-foreground rounded-md p-4 overflow-x-auto",
      className
    )} {...props}>
      <code>{children}</code>
    </pre>
  )
}

