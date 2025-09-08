import { GoogleGenerativeAI } from '@google/generative-ai'
import { RetrievedContext, Message } from './types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export const generateResponse = async (
  userQuery: string,
  retrievedContext: RetrievedContext[],
  conversationHistory: Message[] = []
) => {
  const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL! })

  // Build context from retrieved documents
  const contextText = retrievedContext
    .map((ctx, index) => `[${index + 1}] ${ctx.text}`)
    .join('\n\n')

  // Build conversation history
  const historyText = conversationHistory
    .slice(-6) // Keep last 6 messages for context
    .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
    .join('\n')

  const hasRelevantContext = retrievedContext.length > 0 && retrievedContext.some(ctx => ctx.score > 0.3)
  
  const prompt = hasRelevantContext 
    ? `You are Health Vector, an AI medical assistant. Based on the retrieved medical information, provide a comprehensive response to the user's query.

Retrieved Medical Information:
${contextText}

User Query: ${userQuery}

Instructions:
- Provide accurate medical information based on the retrieved context
- Use clear, professional language with proper medical terminology
- Structure your response with headings and bullet points for readability
- Include relevant causes, symptoms, treatments, or prevention tips as applicable
- Always end with a medical disclaimer

Previous conversation:
${historyText}`
    : `You are Health Vector, an AI medical assistant specialized exclusively in health and medical topics.

User Query: "${userQuery}"

Instructions:
- ONLY respond to medical, health, wellness, or healthcare-related questions
- If the query is NOT medical/health related, politely decline and redirect to medical topics
- For medical queries without specific context, provide general medical knowledge
- Always maintain a professional medical tone
- Structure responses with clear headings and bullet points

Previous conversation:
${historyText}

Response format for non-medical queries:
"I'm Health Vector, a medical assistant focused exclusively on health and medical topics. I can't provide information about [topic]. However, I'd be happy to help you with any questions about health conditions, symptoms, treatments, prevention, or general wellness. What health-related question can I assist you with?"

Always end medical responses with: "This information is for educational purposes only. Please consult a healthcare professional for personalized medical advice, diagnosis, or treatment."`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error generating response:', error)
    throw new Error('Failed to generate response from AI model')
  }
}
