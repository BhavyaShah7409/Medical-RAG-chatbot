'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import Footer from '@/components/Footer'
import ChatMessage from '@/components/ChatMessage'
import ChatInput from '@/components/ChatInput'
import TypingIndicator from '@/components/TypingIndicator'
import QuickQuestions from '@/components/QuickQuestions'
import SafetyDisclaimer from '@/components/SafetyDisclaimer'
import HealthVectorLogo from '@/components/HealthVectorLogo'
import Sidebar from '@/components/Sidebar'
import DisclaimerBanner from '@/components/DisclaimerBanner'
import AuthModal from '@/components/AuthModal'

import { createClient } from '@/lib/supabase'
import { Message, ChatSession } from '@/lib/types'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user ?? null)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: content,
          conversationHistory: messages.slice(-6) // Send last 6 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate response')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        sources: data.sources
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error while processing your request. Please try again later.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuestionClick = (question: string) => {
    handleSendMessage(question)
  }

  const handleSessionSelect = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.session.messages || [])
        setCurrentSessionId(sessionId)
      }
    } catch (error) {
      console.error('Error loading session:', error)
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setCurrentSessionId(null)
  }

  const handleRegenerate = () => {
    if (messages.length >= 2) {
      const lastUserMessage = messages[messages.length - 2]
      if (lastUserMessage.role === 'user') {
        // Remove the last assistant message and regenerate
        setMessages(prev => prev.slice(0, -1))
        handleSendMessage(lastUserMessage.content)
      }
    }
  }

  const handleSaveSession = async () => {
    if (!user || messages.length === 0) return

    try {
      const title = messages.find(m => m.role === 'user')?.content.substring(0, 50) + '...' || 'New Chat'
      
      if (currentSessionId) {
        // Update existing session
        await fetch(`/api/sessions/${currentSessionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            messages
          }),
        })
      } else {
        // Create new session
        const response = await fetch('/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            messages
          }),
        })
        
        if (response.ok) {
          const data = await response.json()
          setCurrentSessionId(data.session.id)
        }
      }
    } catch (error) {
      console.error('Error saving session:', error)
    }
  }

  // Auto-save sessions after each message exchange
  useEffect(() => {
    if (user && messages.length > 0 && !isLoading) {
      const timer = setTimeout(() => {
        handleSaveSession()
      }, 1000) // Save 1 second after message is complete
      
      return () => clearTimeout(timer)
    }
  }, [messages, user, isLoading])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setMessages([])
    setCurrentSessionId(null)
  }

  const handleAuthSuccess = () => {
    // Refresh user state after successful auth
    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setUser(session?.user ?? null)
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <Sidebar
          user={user}
          onSessionSelect={handleSessionSelect}
          onNewChat={handleNewChat}
          onAuthClick={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          currentSessionId={currentSessionId}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <main className="flex-1 flex flex-col relative overflow-hidden">
          <DisclaimerBanner />
          
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="h-full flex items-center justify-center px-6"
              >
                <div className="text-center max-w-3xl">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="glass-card p-12 rounded-3xl shadow-2xl"
                  >
                    <div className="p-4 rounded-2xl mx-auto mb-6 flex items-center justify-center">
                      <HealthVectorLogo size={200} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-bold medical-text-gradient mb-4">
                      Health Vector
                    </h1>
                    <p className="text-xl text-slate-600 mb-2">
                      Your AI Medical Assistant
                    </p>
                    <p className="text-sm text-slate-500 max-w-lg mx-auto">
                      Get evidence-based health information powered by advanced AI. 
                      Ask questions about symptoms, conditions, treatments, and wellness.
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4 px-6 py-8">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    message={message}
                    onRegenerate={index === messages.length - 1 && message.role === 'assistant' ? handleRegenerate : undefined}
                    showRegenerate={index === messages.length - 1 && message.role === 'assistant'}
                  />
                ))}
                
                {isLoading && <TypingIndicator />}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          <div className="border-t border-white/20 blur-backdrop">
            <ChatInput
              onSendMessage={handleSendMessage}
              onSaveSession={user ? handleSaveSession : undefined}
              disabled={isLoading}
              showSaveButton={user && messages.length > 0}
              showQuickQuestions={messages.length === 0}
            />
          </div>
        </main>
      </div>

      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </div>
  )
}
