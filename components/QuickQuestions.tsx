'use client'

import { motion } from 'framer-motion'
import { QuickQuestion } from '@/lib/types'

interface QuickQuestionsProps {
  onQuestionClick: (question: string) => void
}

const quickQuestions: QuickQuestion[] = [
  { id: '1', text: 'What causes fever?', category: 'symptoms' },
  { id: '2', text: 'Symptom: chest pain', category: 'symptoms' },
  { id: '3', text: 'How to treat headaches?', category: 'treatment' },
  { id: '4', text: 'Signs of dehydration', category: 'symptoms' },
  { id: '5', text: 'Common cold remedies', category: 'treatment' },
  { id: '6', text: 'When to see a doctor?', category: 'general' },
]

export default function QuickQuestions({ onQuestionClick }: QuickQuestionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mb-6"
    >
      <h3 className="text-sm font-medium text-gray-600 mb-3">Quick questions to get started:</h3>
      <div className="flex flex-wrap gap-2">
        {quickQuestions.map((question, index) => (
          <motion.button
            key={question.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onQuestionClick(question.text)}
            className="quick-question-chip"
          >
            {question.text}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
