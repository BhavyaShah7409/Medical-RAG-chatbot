# Health Vector - AI Medical Encyclopedia

A modern Next.js application that combines RAG (Retrieval-Augmented Generation) technology with AI to create an intelligent medical encyclopedia chatbot.

## Features

- **RAG-powered responses**: Uses Pinecone vector database for context retrieval and Gemini AI for response generation
- **User authentication**: Secure login/signup with Supabase
- **Session management**: Save and manage chat conversations
- **Modern UI**: Beautiful gradient design with Tailwind CSS and Framer Motion animations
- **Safety-first approach**: Built-in medical disclaimers and safety guidelines
- **Responsive design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **Vector Database**: Pinecone
- **AI Model**: Google Gemini
- **Deployment**: Ready for Vercel/Netlify

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Pinecone account with pre-populated vectors (dimension: 384)
- Google AI Studio API key for Gemini

### Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Fill in your environment variables:
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

Create the following table in your Supabase database:

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

## API Routes

- `POST /api/retrieve` - Query Pinecone for relevant context
- `POST /api/generate` - Generate AI responses with retrieved context
- `GET /api/sessions` - Fetch user's chat sessions
- `POST /api/sessions` - Create new chat session
- `PUT /api/sessions/[id]` - Update existing session
- `DELETE /api/sessions/[id]` - Delete session

## Usage

1. **Anonymous Chat**: Start chatting immediately without authentication
2. **Authenticated Chat**: Sign up/login to save conversation history
3. **Quick Questions**: Use pre-defined questions to get started
4. **Source Viewing**: Toggle to see retrieved context sources
5. **Session Management**: Save, load, and manage chat sessions

## Important Notes

- **Medical Disclaimer**: This application provides informational content only and is not a substitute for professional medical advice
- **Vector Database**: Ensure your Pinecone index is populated with medical content vectors (dimension: 384)
- **Embedding Model**: The current implementation assumes you have a separate embedding service for query vectorization

## Development

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

### Building for Production

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Author

**Bhavya Shah**
- GitHub: [@bhavyashah](https://github.com/bhavyashah)
- LinkedIn: [bhavyashah](https://linkedin.com/in/bhavyashah)
- Portfolio: [bhavyashah.dev](https://bhavyashah.dev)

---

Built with ❤️ using Next.js, Supabase, Pinecone, and Gemini AI.
