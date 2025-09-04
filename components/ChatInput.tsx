'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Save, Mic, Sparkles } from 'lucide-react'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  onSaveSession?: () => void
  disabled?: boolean
  showSaveButton?: boolean
  showQuickQuestions?: boolean
}

const quickQuestions = [
  "What are the symptoms of diabetes?",
  "How to prevent heart disease?",
  "What causes high blood pressure?",
  "Signs of vitamin D deficiency",
  "How to boost immune system?",
  "Common causes of headaches",
  "Benefits of regular exercise"
]

export default function ChatInput({ 
  onSendMessage, 
  onSaveSession, 
  disabled = false, 
  showSaveButton = false,
  showQuickQuestions = false 
}: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  const handleQuickQuestion = (question: string) => {
    onSendMessage(question)
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      {/* Input Form */}
      <motion.form 
        onSubmit={handleSubmit} 
        className="glass-card rounded-2xl p-4 shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about health and medicine..."
              className="input-field w-full text-base"
              disabled={disabled}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            {showSaveButton && onSaveSession && (
              <motion.button
                type="button"
                onClick={onSaveSession}
                className="btn-secondary p-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save className="h-5 w-5" />
              </motion.button>
            )}
            
            <motion.button
              type="submit"
              disabled={disabled || !input.trim()}
              className="btn-primary p-3 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: disabled || !input.trim() ? 1 : 1.05 }}
              whileTap={{ scale: disabled || !input.trim() ? 1 : 0.95 }}
            >
              <Send className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
      </motion.form>
    </div>
  )
}
