import { Pinecone } from '@pinecone-database/pinecone'

let pinecone: Pinecone | null = null

export const getPineconeClient = () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    })
  }
  return pinecone
}

// Simple embedding function using text similarity (fallback)
const createSimpleEmbedding = (text: string): number[] => {
  // Create a simple 384-dimensional vector based on text characteristics
  const embedding = new Array(384).fill(0)
  
  // Use text properties to create a pseudo-embedding
  const words = text.toLowerCase().split(/\s+/)
  const textLength = text.length
  
  for (let i = 0; i < 384; i++) {
    let value = 0
    
    // Use character codes and position to create variation
    if (i < textLength) {
      value += text.charCodeAt(i % textLength) / 1000
    }
    
    // Add word-based features
    if (words.length > 0) {
      const wordIndex = i % words.length
      const word = words[wordIndex]
      value += word.length * 0.1
      
      // Add character frequency
      for (let j = 0; j < word.length; j++) {
        value += word.charCodeAt(j) / 10000
      }
    }
    
    // Normalize to reasonable range
    embedding[i] = Math.tanh(value)
  }
  
  return embedding
}

export const queryPinecone = async (query: string, topK: number = 5) => {
  const client = getPineconeClient()
  const index = client.index(process.env.PINECONE_INDEX_NAME!)
  
  try {
    // Create a simple embedding for the query
    const queryVector = createSimpleEmbedding(query)
    
    const queryResponse = await index.query({
      vector: queryVector,
      topK,
      includeMetadata: true,
      includeValues: false,
    })
    
    return queryResponse.matches || []
  } catch (error) {
    console.error('Error querying Pinecone:', error)
    throw new Error('Failed to retrieve context from vector database')
  }
}
