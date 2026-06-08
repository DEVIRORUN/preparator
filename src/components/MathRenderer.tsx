'use client'

import { InlineMath, BlockMath } from 'react-katex'
import { parseInlineMath } from '../app/_lib/parser'
// git commit -m "EE202 update"

interface InlineMathRendererProps {
  text: string
  className?: string
}

export function InlineMathRenderer({ text, className = '' }: InlineMathRendererProps) {
  const segments = parseInlineMath(text)

  return (
    <span className={className}>
      {segments.map((seg, i) => {
        if (seg.kind === 'math') {
          return (
            <InlineMath key={i} math={seg.value} />
          )
        }
        return <span key={i}>{seg.value}</span>
      })}
    </span>
  )
}

interface BlockMathRendererProps {
  math: string
}

export function BlockMathRenderer({ math }: BlockMathRendererProps) {
  return (
    <div className="my-4 overflow-x-auto">
      <BlockMath math={math} />
    </div>
  )
}