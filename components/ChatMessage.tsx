'use client'

import { motion } from 'framer-motion'
import { RefreshCw, User, Bot, Sparkles } from 'lucide-react'
import { Message } from '@/lib/types'
import HealthVectorLogo from './HealthVectorLogo'

interface ChatMessageProps {
  message: Message
  onRegenerate?: () => void
  showRegenerate?: boolean
}

export default function ChatMessage({ message, onRegenerate, showRegenerate }: ChatMessageProps) {
  const formatMessage = (content: string) => {
    const paragraphs = content.split('\n\n')
    
    return paragraphs.map(paragraph => {
      let formatted = paragraph
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-800">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-slate-600">$1</em>')
        .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-3 mt-4 text-slate-800">$1</h3>')
        .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-4 mt-5 text-slate-800">$1</h2>')
        .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 mt-5 text-slate-800">$1</h1>')
        .replace(/\n/g, '<br>')
      
      const lines = formatted.split('<br>')
      let inList = false
      let listItems: string[] = []
      let regularContent: string[] = []
      
      lines.forEach(line => {
        const trimmedLine = line.trim()
        if (trimmedLine.match(/^[\*\-] /)) {
          if (!inList) {
            if (regularContent.length > 0) {
              listItems.push(`<p class="mb-4 text-slate-700 leading-relaxed">${regularContent.join('<br>')}</p>`)
              regularContent = []
            }
            listItems.push('<ul class="list-disc list-inside mb-4 space-y-2 pl-2">')
            inList = true
          }
          const itemText = trimmedLine.replace(/^[\*\-] /, '')
          listItems.push(`<li class="text-slate-700">${itemText}</li>`)
        } else if (trimmedLine.match(/^\d+\. /)) {
          if (!inList) {
            if (regularContent.length > 0) {
              listItems.push(`<p class="mb-4 text-slate-700 leading-relaxed">${regularContent.join('<br>')}</p>`)
              regularContent = []
            }
            listItems.push('<ol class="list-decimal list-inside mb-4 space-y-2 pl-2">')
            inList = true
          }
          const itemText = trimmedLine.replace(/^\d+\. /, '')
          listItems.push(`<li class="text-slate-700">${itemText}</li>`)
        } else {
          if (inList) {
            listItems.push('</ul>')
            inList = false
          }
          if (trimmedLine) {
            regularContent.push(line)
          }
        }
      })
      
      if (inList) {
        listItems.push('</ul>')
      }
      
      if (regularContent.length > 0) {
        listItems.push(`<p class="mb-4 text-slate-700 leading-relaxed">${regularContent.join('<br>')}</p>`)
      }
      
      return listItems.join('')
    }).join('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        type: "spring",
        damping: 25,
        stiffness: 200,
        duration: 0.4
      }}
      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`flex items-start space-x-3 max-w-4xl ${
        message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
      }`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
          message.role === 'user' 
            ? 'medical-gradient shadow-lg' 
            : 'glass-card'
        }`}>
          {message.role === 'user' ? (
            <User className="h-5 w-5 text-white" />
          ) : (
            <HealthVectorLogo size={20} className="text-teal-600" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex-1 ${
          message.role === 'user' 
            ? 'chat-bubble-user' 
            : 'chat-bubble-assistant'
        }`}>
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
          />
          
          {showRegenerate && onRegenerate && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRegenerate}
              className="mt-4 flex items-center space-x-2 text-sm text-slate-500 hover:text-teal-600 transition-colors glass-card px-3 py-2 rounded-lg floating-element"
            >
              <Sparkles className="h-4 w-4" />
              <span>Regenerate Response</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
