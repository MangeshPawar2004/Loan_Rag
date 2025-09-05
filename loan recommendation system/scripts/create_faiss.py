import os
import json
import faiss
import numpy as np
from PyPDF2 import PdfReader
from google import genai   
from dotenv import load_dotenv

load_dotenv()

PDF_DIR = "public/sample_loans"
OUT_INDEX = "public/embeddings/loan_docs.index"
OUT_META = "public/embeddings/loan_docs_meta.json"
EMBED_MODEL = "models/embedding-001"   # gemini embedding model
DIM = 768  # adjust based on actual output dim (often 768 or 1536+)

# =====================
# INIT GOOGLE GENAI
# =====================
client = genai.Client(api_key=os.getenv("VITE_GEMINI_API_KEY"))

# =====================
# HELPERS
# =====================
def extract_text_from_pdf(path):
    reader = PdfReader(path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

def chunk_text(text, max_chars=1000):
    """Split into chunks for embeddings (simple char-based)"""
    chunks = []
    words = text.split()
    buf = []
    count = 0
    for w in words:
        buf.append(w)
        count += len(w) + 1
        if count >= max_chars:
            chunks.append(" ".join(buf))
            buf = []
            count = 0
    if buf:
        chunks.append(" ".join(buf))
    return chunks

def embed_texts(texts):
    res = client.models.embed_content(
        model=EMBED_MODEL,
        contents=texts
    )
    # Adapt response shape if needed
    vectors = [r.values for r in res.embeddings]
    return np.array(vectors).astype("float32")

# =====================
# MAIN
# =====================
if __name__ == "__main__":
    os.makedirs(os.path.dirname(OUT_INDEX), exist_ok=True)

    all_chunks = []
    metadata = []

    for fname in os.listdir(PDF_DIR):
        if not fname.lower().endswith(".pdf"):
            continue
        fpath = os.path.join(PDF_DIR, fname)
        raw_text = extract_text_from_pdf(fpath)
        chunks = chunk_text(raw_text)

        for i, chunk in enumerate(chunks):
            all_chunks.append(chunk)
            metadata.append({"doc": fname, "chunk_id": i, "text": chunk})

    print(f"Total chunks: {len(all_chunks)}")

    # Embeddings
    vectors = embed_texts(all_chunks)
    dim = vectors.shape[1]

    # Create FAISS index
    index = faiss.IndexFlatL2(dim)
    index.add(vectors)

    # Save
    faiss.write_index(index, OUT_INDEX)
    with open(OUT_META, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)

    print(f"✅ Saved FAISS index to {OUT_INDEX}")
    print(f"✅ Saved metadata to {OUT_META}")
