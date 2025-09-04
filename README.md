# Health Vector - AI Medical Encyclopedia

A modern Next.js application that combines RAG (Retrieval-Augmented Generation) technology with AI to create an intelligent medical encyclopedia chatbot.

## Features

- **RAG-powered responses**: Uses Pinecone vector database for context retrieval and Gemini AI for response generation
- **User authentication**: Secure login/signup with Supabase
- **Session management**: Save and manage chat conversations
- **Responsive design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Vector Database**: Pinecone
- **AI Model**: Google Gemini
- **Deployment**: Vercel


### Environment variables:
```env
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
MEDICAL_PDF_URL=https://example.com/medical-encyclopedia.pdf
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_index_name
SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_key
```

### Database Setup

```sql
CREATE TABLE chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own sessions" ON chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON chat_sessions
  FOR DELETE USING (auth.uid() = user_id);
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

### API Routes

- `POST /api/retrieve` - Query Pinecone for relevant context
- `POST /api/generate` - Generate AI responses with retrieved context
- `GET /api/sessions` - Fetch user's chat sessions
- `POST /api/sessions` - Create new chat session
- `PUT /api/sessions/[id]` - Update existing session
- `DELETE /api/sessions/[id]` - Delete session


### Project Structure
```
├── app/
│   ├── api/          # API routes
│   ├── globals.css   # Global styles
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Main page
├── components/       # React components
├── lib/             # Utility functions
│   ├── gemini.ts    # Gemini AI integration
│   ├── pinecone.ts  # Pinecone client
│   ├── supabase.ts  # Supabase client
│   └── types.ts     # TypeScript types
└── public/          # Static assets
```
