import { useState } from "react";
import * as genAI from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAIClient = new genAI.GoogleGenerativeAI(API_KEY);

export default function LoanRagApp() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    loanType: "",
    income: "",
    creditScore: "",
  });

  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRecommendation("");

    try {
      // 1. Load embeddings.json
      const res = await fetch("/embeddings.json");
      const embeddingsData = await res.json();

      // 2. Build query from form
      const query = `Suggest best loan options for a person with:
        Name: ${formData.name},
        Age: ${formData.age},
        Loan Type: ${formData.loanType},
        Monthly Income: ${formData.income},
        Credit Score: ${formData.creditScore}`;

      // 3. Embed query using Gemini
      const embeddingModel = genAIClient.getGenerativeModel({ model: "text-embedding-004" });
      const embeddingResp = await embeddingModel.embedContent(query);
      const queryEmbedding = embeddingResp.embedding.values;

      // 4. Compute cosine similarity with chunks
      function cosineSimilarity(a, b) {
        let dot = 0.0;
        let normA = 0.0;
        let normB = 0.0;
        for (let i = 0; i < a.length; i++) {
          dot += a[i] * b[i];
          normA += a[i] * a[i];
          normB += b[i] * b[i];
        }
        return dot / (Math.sqrt(normA) * Math.sqrt(normB));
      }

      const rankedChunks = embeddingsData
        .map((item) => ({
          ...item,
          score: cosineSimilarity(queryEmbedding, item.embedding),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5); // Top 5

      const context = rankedChunks.map((c) => c.text).join("\n\n");

      // 5. Send to Gemini text model
      const textModel = genAIClient.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Based on the following loan documents:\n${context}\n\nAnswer the query:\n${query}\n\nProvide recommendations in simple, user-friendly terms.`;

      const result = await textModel.generateContent(prompt);
      setRecommendation(result.response.text());

    } catch (err) {
      console.error(err);
      setRecommendation("❌ Error fetching recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Form (Left) */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md m-6"
      >
        <h2 className="text-xl font-bold mb-4">Loan Recommendation Form</h2>

        <label className="block mb-2 font-medium">Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-lg mb-4" required />

        <label className="block mb-2 font-medium">Age</label>
        <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-2 border rounded-lg mb-4" required />

        <label className="block mb-2 font-medium">Loan Type</label>
        <select name="loanType" value={formData.loanType} onChange={handleChange} className="w-full p-2 border rounded-lg mb-4" required>
          <option value="">-- Select Loan Type --</option>
          <option value="home">Home Loan</option>
          <option value="car">Car Loan</option>
          <option value="personal">Personal Loan</option>
          <option value="health">Health Loan</option>
          <option value="business">Business Loan</option>
          <option value="education">Education Loan</option>
        </select>

        <label className="block mb-2 font-medium">Monthly Income (₹)</label>
        <input type="number" name="income" value={formData.income} onChange={handleChange} className="w-full p-2 border rounded-lg mb-4" required />

        <label className="block mb-2 font-medium">Credit Score</label>
        <input type="number" name="creditScore" value={formData.creditScore} onChange={handleChange} className="w-full p-2 border rounded-lg mb-4" required />

        <button type="submit" className="w-full bg-black text-white font-semibold py-2 rounded-lg hover:bg-gray-800">
          {loading ? "Loading..." : "Get Recommendations"}
        </button>
      </form>

      {/* Results (Right) */}
      <div className="flex-1 p-6">
        <h2 className="text-xl font-bold mb-4">AI Recommendation</h2>
        <div className="bg-white p-4 rounded-lg shadow-md min-h-[200px]">
          {loading ? "⏳ Generating recommendation..." : recommendation}
        </div>
      </div>
    </div>
  );
}
