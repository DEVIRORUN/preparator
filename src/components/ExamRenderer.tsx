'use client'

import { ParsedBlock } from '../app/_lib/parser'
import { InlineMathRenderer, BlockMathRenderer } from './MathRenderer'
import clsx from 'clsx'

interface ExamRendererProps {
  blocks: ParsedBlock[]
}

// Section colors cycled by order
const SECTION_COLORS = [
  { border: 'border-[#00d4aa]', bg: 'bg-[#00d4aa]/5', text: 'text-[#00d4aa]', dot: 'bg-[#00d4aa]' },
  { border: 'border-[#818cf8]', bg: 'bg-[#818cf8]/5', text: 'text-[#818cf8]', dot: 'bg-[#818cf8]' },
  { border: 'border-[#f59e0b]', bg: 'bg-[#f59e0b]/5', text: 'text-[#f59e0b]', dot: 'bg-[#f59e0b]' },
  { border: 'border-[#f472b6]', bg: 'bg-[#f472b6]/5', text: 'text-[#f472b6]', dot: 'bg-[#f472b6]' },
]

export default function ExamRenderer({ blocks }: ExamRendererProps) {
  let sectionIndex = -1
  let questionIndex = -1

  return (
    <div className="space-y-1 animate-fade-in">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'section_header': {
            sectionIndex++
            const color = SECTION_COLORS[sectionIndex % SECTION_COLORS.length]
            return (
              <div
                key={block.id}
                className={clsx(
                  'section-block mt-8 mb-4 px-5 py-3 rounded-lg border-l-4',
                  color.border,
                  color.bg,
                  'first:mt-0'
                )}
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <p className={clsx('font-display font-bold text-sm tracking-[0.15em] uppercase', color.text)}>
                  <InlineMathRenderer text={block.content} />
                </p>
              </div>
            )
          }

          case 'question_header': {
            questionIndex++
            return (
              <div
                key={block.id}
                className="section-block mt-6 mb-3 flex items-start gap-3"
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <span className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full bg-[#00d4aa]/15 border border-[#00d4aa]/40 flex items-center justify-center text-[#00d4aa] text-xs font-mono font-bold">
                  {questionIndex + 1}
                </span>
                <h3 className="font-display font-semibold text-base text-white leading-tight">
                  <InlineMathRenderer text={block.content} />
                </h3>
              </div>
            )
          }

          case 'sub_question': {
            return (
              <div
                key={block.id}
                className="section-block ml-9 mt-2 flex items-start gap-3 group"
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <span className="flex-shrink-0 w-6 h-6 rounded bg-[#1e1e2e] border border-[#2d2d44] flex items-center justify-center text-[#00d4aa] text-xs font-mono font-semibold mt-0.5">
                  {block.label?.replace(')', '')}
                </span>
                <p className="text-[#cbd5e1] text-sm leading-relaxed font-body">
                  <InlineMathRenderer text={block.content} />
                </p>
              </div>
            )
          }

          case 'bullet': {
            return (
              <div
                key={block.id}
                className="section-block ml-4 mt-1.5 flex items-start gap-3"
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#00d4aa]/60 mt-2" />
                <p className="text-[#cbd5e1] text-sm leading-relaxed font-body">
                  <InlineMathRenderer text={block.content} />
                </p>
              </div>
            )
          }

          case 'equation_block': {
            return (
              <div
                key={block.id}
                className="section-block ml-4 my-4"
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <BlockMathRenderer math={block.content} />
              </div>
            )
          }

          case 'given_line': {
            return (
              <div
                key={block.id}
                className="section-block ml-9 mt-3 mb-2 px-4 py-2.5 bg-[#0f1923] border border-[#1e3a4a] rounded-md"
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <p className="text-[#7dd3fc] text-xs font-mono leading-relaxed">
                  <InlineMathRenderer text={block.content} />
                </p>
              </div>
            )
          }

          case 'divider': {
            return (
              <hr
                key={block.id}
                className="my-6 border-[#1e1e2e]"
              />
            )
          }

          case 'paragraph':
          default: {
            // Check if the line looks like a bold answer/result (contains **)
            const isResult = block.content.includes('**')
            const cleanContent = block.content.replace(/\*\*(.*?)\*\*/g, '$1')

            if (isResult) {
              return (
                <div
                  key={block.id}
                  className="section-block ml-4 mt-2"
                  style={{ animationDelay: `${idx * 0.03}s` }}
                >
                  <p className="text-[#e2e8f0] text-sm font-semibold leading-relaxed font-body">
                    <InlineMathRenderer text={cleanContent} />
                  </p>
                </div>
              )
            }

            return (
              <div
                key={block.id}
                className="section-block ml-4 mt-2"
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                <p className="text-[#94a3b8] text-sm leading-relaxed font-body">
                  <InlineMathRenderer text={block.content} />
                </p>
              </div>
            )
          }
        }
      })}
    </div>
  )
}