'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  History, 
  LogIn, 
  LogOut, 
  User, 
  BookOpen, 
  Menu, 
  X,
  Plus,
  Trash2,
  Sparkles,
  Shield,
  Activity
} from 'lucide-react'
import HealthVectorLogo from './HealthVectorLogo'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface SidebarProps {
  user: SupabaseUser | null
  onSessionSelect: (sessionId: string) => void
  onNewChat: () => void
  onAuthClick: () => void
  onLogout: () => void
  currentSessionId: string | null
  isOpen: boolean
  onToggle: () => void
}

interface ChatSession {
  id: string
  title: string
  created_at: string
}

export default function Sidebar({
  user,
  onSessionSelect,
  onNewChat,
  onAuthClick,
  onLogout,
  currentSessionId,
  isOpen,
  onToggle
}: SidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(false)

  const handleDeleteSession = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setSessions(prev => prev.filter(session => session.id !== sessionId))
        
        if (currentSessionId === sessionId) {
          onNewChat()
        }
      }
    } catch (error) {
      console.error('Error deleting session:', error)
    }
  }

  const loadSessions = async () => {
    if (!user || isLoadingSessions) return
    
    setIsLoadingSessions(true)
    try {
      const response = await fetch('/api/sessions')
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
      }
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      setIsLoadingSessions(false)
    }
  }

  useEffect(() => {
    if (user) {
      loadSessions()
    } else {
      setSessions([])
    }
  }, [user])

  const sidebarContent = (
    <div className="h-full flex flex-col glass-card border-r-0 rounded-r-none">
      {/* Header with Medical Branding */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="medical-gradient p-2 rounded-lg">
                <HealthVectorLogo size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold medical-text-gradient">Health Vector</h1>
                <div className="flex items-center space-x-1">
                  <div className="status-indicator"></div>
                  <p className="text-xs text-slate-500">AI Medical Assistant</p>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-white/60 transition-colors"
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Quick Actions */}
        <div className="space-y-3">
          <button
            onClick={onNewChat}
            className="btn-primary w-full flex items-center justify-center space-x-3 floating-element"
          >
            <Sparkles className="h-5 w-5" />
            <span>New Consultation</span>
          </button>

          {!user && (
            <button
              onClick={onAuthClick}
              className="btn-secondary w-full flex items-center justify-center space-x-3"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* Chat History */}
        {user && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-semibold text-slate-700 flex items-center space-x-2">
                <History className="h-4 w-4 medical-icon" />
                <span>Recent Consultations</span>
              </h3>
              {isLoadingSessions && (
                <div className="w-4 h-4 border-2 border-teal-200 border-t-teal-500 rounded-full animate-spin"></div>
              )}
            </div>
            
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {sessions.map((session) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    currentSessionId === session.id
                      ? 'glass-card bg-white/90 shadow-md'
                      : 'hover:bg-white/40'
                  }`}
                  onClick={() => onSessionSelect(session.id)}
                >
                  <div className="flex-1 min-w-0 flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {session.title || 'Medical Consultation'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(session.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteSession(session.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded-lg transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-500" />
                  </button>
                </motion.div>
              ))}
              
              {sessions.length === 0 && !isLoadingSessions && (
                <div className="text-center py-8">
                  <Activity className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No consultations yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Profile */}
        {user && (
          <div className="border-t border-white/20 pt-4 space-y-3">
            <div className="glass-card p-4 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="medical-gradient p-2 rounded-lg">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-slate-500">Verified Patient</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={onLogout}
              className="btn-secondary w-full flex items-center justify-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/20">
        <a
          href="https://archive.org/details/a-z-family-medical-encyclopedia_202101/mode/2up"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center space-x-3 p-4 medical-gradient text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg floating-element"
        >
          <BookOpen className="h-5 w-5" />
          <span className="font-medium">Medical Encyclopedia</span>
        </a>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-6 left-6 z-50 p-3 glass-card rounded-xl shadow-lg floating-element"
      >
        <Menu className="h-5 w-5 text-slate-600" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 blur-backdrop z-40"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : '-100%'
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-80 lg:w-80"
      >
        {sidebarContent}
      </motion.aside>
    </>
  )
}
