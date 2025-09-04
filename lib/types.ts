export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: RetrievedContext[]
}

export interface RetrievedContext {
  id: string
  text: string
  score: number
  metadata?: {
    title?: string
    section?: string
    page?: number
  }
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
}

export interface QuickQuestion {
  id: string
  text: string
  category: string
}
