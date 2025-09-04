'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, ExternalLink } from 'lucide-react'
import HealthVectorLogo from './HealthVectorLogo'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 text-white border-t border-slate-800"
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="medical-gradient p-2.5 rounded-lg">
                <HealthVectorLogo size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Health Vector</h3>
                <p className="text-slate-400 text-sm">AI Medical Assistant</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              Advanced AI-powered medical encyclopedia leveraging RAG technology for 
              evidence-based health information and intelligent medical consultations.
            </p>
          </div>

          {/* Project Info */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold text-white mb-4">Technology Stack</h4>
            <div className="space-y-2 text-sm text-slate-300">
              <p>• Next.js 14 with TypeScript</p>
              <p>• Pinecone Vector Database</p>
              <p>• Google Gemini AI</p>
              <p>• Supabase Authentication</p>
              <p>• Tailwind CSS & Framer Motion</p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div>
                <p className="text-slate-400 text-sm">bhavyashah7409@gmail.com</p>
              </div>
              
              <div className="flex space-x-3">
                <motion.a
                  href="https://github.com/BhavyaShah7409"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg transition-colors"
                  title="GitHub"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Github className="h-4 w-4 text-slate-300" />
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/bhavya-shah-101a43248/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg transition-colors"
                  title="LinkedIn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Linkedin className="h-4 w-4 text-slate-300" />
                </motion.a>
                <motion.a
                  href="https://bhavyashah999.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-slate-800 hover:bg-slate-700 p-2.5 rounded-lg transition-colors"
                  title="Portfolio"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink className="h-4 w-4 text-slate-300" />
                </motion.a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-400 text-sm">
              Built for educational and informational purposes.
            </p>
            <p className="text-slate-500 text-xs">
              Always consult healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
