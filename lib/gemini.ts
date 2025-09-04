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

  const hasRelevantContext = retrievedContext.length > 0 && retrievedContext.some(ctx => ctx.score > 0.1)
  
  const prompt = hasRelevantContext 
    ? `You are Health Vector, an AI medical encyclopedia assistant. Based on the following medical information, provide a comprehensive and helpful response to the user's query.

Retrieved Medical Information:
${contextText}

User Query: ${userQuery}

Please provide:
1. A clear and informative response based on the medical information
2. General overview and definition (if applicable)
3. Common causes or risk factors (if applicable)
4. General prevention tips (if applicable)

Format your response with proper headings and bullet points for readability. Use **bold** for important headings and terms.

Important Safety Guidelines:
- Always maintain a helpful, professional tone. Only include medical disclaimers for actual medical content, not for greetings.
- Remind users to consult healthcare professionals for personalized advice
- Do not provide specific medical diagnoses or treatment recommendations
- Focus on educational and informational content only

Previous conversation context:
${historyText}`
    : `You are Health Vector, an AI medical encyclopedia assistant. The user has asked: "${userQuery}"

If this is a general greeting (like "hello", "hi", etc.) or casual conversation, respond naturally and friendly, then guide them to ask health-related questions.

If this appears to be a medical query but no specific information was found in the database:
1. Provide general health information you know about the topic
2. Use proper medical terminology and structure
3. Include relevant health advice

If it's clearly not a medical query, respond helpfully and redirect them to health topics.

Format your response professionally with proper structure. Use **bold** for headings.

Previous conversation context:
${historyText}

Focus on:
• **General overview and definition**
• **Common causes or risk factors** 
• **General prevention tips**
• **When to seek medical attention**

Always end with a reminder to consult healthcare professionals for medical advice, diagnosis, or treatment.`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error generating response:', error)
    throw new Error('Failed to generate response from AI model')
  }
}
