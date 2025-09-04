'use client'

import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export default function SafetyDisclaimer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6"
    >
      <div className="flex items-start space-x-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-medium mb-1">Important Medical Disclaimer</p>
          <p>
            This chatbot provides informational content only and is not a substitute for professional medical advice. 
            Always consult a healthcare professional for medical concerns, diagnosis, or treatment decisions.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
