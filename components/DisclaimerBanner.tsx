'use client'

import { motion } from 'framer-motion'
import { Shield, AlertTriangle } from 'lucide-react'

export default function DisclaimerBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card mx-6 my-4 p-4 border-l-4 border-amber-400"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
          <Shield className="h-4 w-4 text-amber-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-sm font-semibold text-slate-800">Medical Disclaimer</h3>
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            This AI provides general health information for educational purposes only. 
            Not a substitute for professional medical advice. Always consult qualified healthcare providers.
          </p>
        </div>
      </div>
    </motion.div>
  )
}
