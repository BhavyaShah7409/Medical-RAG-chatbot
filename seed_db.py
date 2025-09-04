import os
from dotenv import load_dotenv
import fitz
from transformers import AutoTokenizer, AutoModel
import torch
import pinecone

load_dotenv()
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY")
PINECONE_ENV = os.environ.get("PINECONE_ENV")
PINECONE_INDEX = os.environ.get("PINECONE_INDEX_NAME")
PDF_PATH = "./data/medical.pdf"

if not os.path.exists(PDF_PATH):
    raise FileNotFoundError(f"{PDF_PATH} not found")

client = pinecone.Client(api_key=PINECONE_API_KEY, environment=PINECONE_ENV)

# Create index if it doesn't exist
if PINECONE_INDEX not in [idx.name for idx in client.list_indexes()]:
    print(f"[Pinecone] Creating index: {PINECONE_INDEX}")
    client.create_index(
        name=PINECONE_INDEX,
        dimension=384,
        metric="cosine"
    )

index = client.index(PINECONE_INDEX)
 
#loading huggingface
tokenizer = AutoTokenizer.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")
model = AutoModel.from_pretrained("sentence-transformers/all-MiniLM-L6-v2")

def embed_text(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
        embeddings = outputs.last_hidden_state.mean(dim=1)
    return embeddings[0].tolist()

# Extract text from PDF
doc = fitz.open(PDF_PATH)
texts = []
for page_num, page in enumerate(doc, start=1):
    text = page.get_text().replace("\n", " ").strip()
    if text:
        texts.append((f"page_{page_num}", text))

# Chunk text
def chunk_text(text, max_words=400, overlap=40):
    words = text.split()
    chunks = []
    i = 0
    while i < len(words):
        chunk = words[i:i+max_words]
        chunks.append(" ".join(chunk))
        i += max_words - overlap
    return chunks

vectors = []
for page_id, text in texts:
    chunks = chunk_text(text)
    for i, chunk in enumerate(chunks):
        vec = embed_text(chunk)
        vectors.append({
            "id": f"{page_id}_chunk_{i}",
            "values": vec,
            "metadata": {"page": page_id, "text": chunk}
        })

# Upsert vectors to Pinecone
BATCH_SIZE = 100
for i in range(0, len(vectors), BATCH_SIZE):
    batch = vectors[i:i+BATCH_SIZE]
    print(f"[Pinecone] Upserting batch {i//BATCH_SIZE + 1} / {len(vectors)//BATCH_SIZE + 1}")
    index.upsert(batch)

print("[Done] PDF text seeded into Pinecone successfully.")
