import os
import json
from dotenv import load_dotenv
import google.generativeai as genai
from PyPDF2 import PdfReader
import textwrap

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("VITE_GEMINI_API_KEY"))

# Paths
PDF_DIR = "public/sample_loans"
OUTPUT_JSON = "public/embeddings/loan_docs.json"
os.makedirs("public/embeddings", exist_ok=True)

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF file."""
    reader = PdfReader(pdf_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text.strip()

def chunk_text(text, max_chunk_size=2000):
    """Split text into smaller chunks (approx max tokens)."""
    return textwrap.wrap(text, max_chunk_size)

def generate_embedding(text):
    """Generate embedding using Google's embedding model."""
    emb = genai.embed_content(
        model="models/text-embedding-004",
        content=text,
        task_type="retrieval_document"
    )
    return emb["embedding"]

def main():
    all_embeddings = []
    for filename in os.listdir(PDF_DIR):
        if filename.endswith(".pdf"):
            file_path = os.path.join(PDF_DIR, filename)
            print(f"Processing {filename}...")

            text = extract_text_from_pdf(file_path)
            if not text:
                print(f"⚠️ No text found in {filename}")
                continue

            chunks = chunk_text(text, max_chunk_size=2000)
            print(f"  → Splitting into {len(chunks)} chunks")

            for i, chunk in enumerate(chunks):
                embedding = generate_embedding(chunk)

                all_embeddings.append({
                    "filename": filename,
                    "chunk_id": i,
                    "content": chunk,
                    "embedding": embedding
                })

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(all_embeddings, f, indent=2)

    print(f"✅ Embeddings saved to {OUTPUT_JSON}")

if __name__ == "__main__":
    main()
