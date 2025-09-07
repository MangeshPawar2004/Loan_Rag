import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaCalendarAlt, 
  FaDollarSign, 
  FaUniversity, 
  FaHeart,
  FaCreditCard,
  FaRocket,
  FaStar,
  FaDatabase,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(apiKey);

const LoanForm = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    income: "",
    loanType: "personal",
    amount: "",
    cibilScore: "",
    maritalStatus: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formProgress, setFormProgress] = useState(0);
  const [embeddingsData, setEmbeddingsData] = useState(null);
  const [embeddingsLoading, setEmbeddingsLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    calculateProgress();
    loadEmbeddings();
  }, []);

  useEffect(() => {
    calculateProgress();
  }, [formData]);

  const loadEmbeddings = async () => {
    try {
      setEmbeddingsLoading(true);
      const response = await fetch("/embeddings.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEmbeddingsData(data);
      console.log("✅ Embeddings loaded successfully:", data.length, "chunks");
    } catch (error) {
      console.error("❌ Error loading embeddings:", error);
      setEmbeddingsData([]);
    } finally {
      setEmbeddingsLoading(false);
    }
  };

  const calculateProgress = () => {
    const fields = Object.values(formData);
    const filledFields = fields.filter(field => field !== "" && field !== false).length;
    const totalFields = fields.length;
    setFormProgress((filledFields / totalFields) * 100);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const cosineSimilarity = (a, b) => {
    if (!a || !b || a.length !== b.length) {
      return 0;
    }
    
    let dot = 0.0;
    let normA = 0.0;
    let normB = 0.0;
    
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
  };

  const getRelevantContext = async (query) => {
    try {
      if (!embeddingsData || embeddingsData.length === 0) {
        console.warn("⚠️ No embeddings data available");
        return "";
      }

      const embeddingModel = ai.getGenerativeModel({ model: "text-embedding-004" });
      const embeddingResp = await embeddingModel.embedContent(query);
      const queryEmbedding = embeddingResp.embedding.values;

      const rankedChunks = embeddingsData
        .map((item) => ({
          ...item,
          score: cosineSimilarity(queryEmbedding, item.embedding),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      const context = rankedChunks
        .filter(chunk => chunk.score > 0.1)
        .map((chunk) => chunk.text)
        .join("\n\n");

      return context;
    } catch (error) {
      console.error("❌ Error in RAG retrieval:", error);
      return "";
    }
  };

  const getCibilScoreColor = (score) => {
    if (!score) return 'text-gray-600';
    const numScore = parseInt(score);
    if (numScore >= 750) return 'text-green-700 bg-green-50 border-green-200';
    if (numScore >= 650) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const getCibilScoreText = (score) => {
    if (!score) return '';
    const numScore = parseInt(score);
    if (numScore >= 750) return '(Excellent)';
    if (numScore >= 650) return '(Good)';
    if (numScore >= 600) return '(Fair)';
    return '(Poor)';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ragQuery = `Best loan options and recommendations for:
        - Person aged ${formData.age}
        - Monthly income: ₹${formData.income}
        - Loan type: ${formData.loanType}
        - Loan amount: ₹${formData.amount}
        - CIBIL score: ${formData.cibilScore}
        - Marital status: ${formData.maritalStatus ? 'Married' : 'Single'}
        - Eligibility criteria, interest rates, processing time, required documents`;

      const relevantContext = await getRelevantContext(ragQuery);

      const systemPrompt = `
        You are an expert AI loan advisor for Indian customers. 
        Use the provided context from financial documents to give accurate and personalized loan recommendations.
        
        CONTEXT FROM FINANCIAL DOCUMENTS:
        ${relevantContext}
        
        Based on the context above and the user's profile, provide personalized loan recommendations.
        Always respond in JSON format with these exact fields:
        {
          "loanType": "string",
          "recommendedBanks": ["bank1", "bank2", "bank3"],
          "interestRates": ["rate1", "rate2", "rate3"],
          "repaymentOptions": ["option1", "option2"],
          "riskLevel": "Low/Medium/High",
          "explanation": "detailed explanation based on the context provided",
          "eligibility": "Eligible/Partially Eligible/Not Eligible",
          "monthlyEMI": "estimated EMI amount",
          "processingTime": "time in days",
          "cibilImpact": "how CIBIL score affects the recommendation",
          "maritalBenefit": "how marital status affects the recommendation",
          "specialOffers": ["offer1", "offer2"],
          "approvalChance": "percentage",
          "requiredDocuments": ["doc1", "doc2", "doc3"],
          "contextUsed": true
        }

        Guidelines:
        1. Prioritize information from the provided context
        2. If context is insufficient, use general knowledge but mention this in explanation
        3. Be specific about Indian banks and financial institutions
        4. Consider current market rates and conditions
        5. Provide actionable advice based on the user's profile
      `;

      const userPrompt = `
        User Profile:
        - Name: ${formData.name}
        - Age: ${formData.age}
        - Income: ₹${formData.income}
        - Loan Type: ${formData.loanType}
        - Amount: ₹${formData.amount}
        - CIBIL Score: ${formData.cibilScore}
        - Marital Status: ${formData.maritalStatus ? 'Married' : 'Single'}
        
        Please provide comprehensive loan recommendations using the context provided above.
      `;

      console.log("🤖 Generating recommendations with RAG context...");
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
      const genResp = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [{ text: systemPrompt + "\n\n" + userPrompt }],
          },
        ],
      });

      let text = genResp.response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const recommendation = JSON.parse(jsonMatch[0]);
        
        recommendation.ragUsed = true;
        recommendation.contextLength = relevantContext.length;
        
        console.log("✅ RAG-enhanced recommendation generated");
        
        navigate('/result', { 
          state: { 
            formData, 
            recommendation 
          } 
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("❌ Error:", err);
      navigate('/result', { 
        state: { 
          formData, 
          recommendation: {
            error: true,
            message: "Unable to get recommendations. Please try again.",
            ragUsed: false
          }
        } 
      });
    }

    setLoading(false);
  };

  const loanTypes = [
    { value: "personal", label: "Personal Loan", icon: "💳", color: "from-blue-500 to-indigo-600" },
    { value: "home", label: "Home Loan", icon: "🏠", color: "from-green-500 to-emerald-600" },
    { value: "car", label: "Car Loan", icon: "🚗", color: "from-red-500 to-pink-600" },
    { value: "education", label: "Education Loan", icon: "🎓", color: "from-purple-500 to-violet-600" },
    { value: "business", label: "Business Loan", icon: "💼", color: "from-yellow-500 to-orange-600" },
    { value: "health", label: "Health Loan", icon: "🏥", color: "from-teal-500 to-cyan-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 mt-20 shadow-2xl"
          >
            <FaUniversity className="text-white text-4xl" />
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 mb-4">
            Smart Loan Advisor
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8 font-medium">
            Get AI-powered, personalized loan recommendations with document-based insights
          </p>

          {/* Enhanced Status Indicator */}
          <div className="flex justify-center mb-8">
            <div className={`inline-flex items-center px-6 py-3 rounded-2xl text-lg font-bold shadow-lg transition-all duration-300 ${
              embeddingsLoading 
                ? 'bg-yellow-100 text-yellow-900 animate-pulse border-2 border-yellow-300' 
                : embeddingsData && embeddingsData.length > 0
                  ? 'bg-green-100 text-green-900 border-2 border-green-300'
                  : 'bg-red-100 text-red-900 border-2 border-red-300'
            }`}>
              <FaDatabase className={`mr-3 text-xl ${embeddingsLoading ? 'animate-spin' : ''}`} />
              {embeddingsLoading 
                ? 'Loading Knowledge Base...' 
                : embeddingsData && embeddingsData.length > 0
                  ? `✅ ${embeddingsData.length} Financial Embedding Loaded`
                  : '❌ Knowledge Base Unavailable'
              }
            </div>
          </div>
          
          {/* Bold Progress Bar
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-lg font-bold text-gray-700 mb-3">
              <span>Profile Completion</span>
              <span className="text-blue-600">{Math.round(formProgress)}%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-4 shadow-inner">
              <motion.div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-4 rounded-full shadow-lg transition-all duration-500 ease-out"
                style={{ width: `${formProgress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${formProgress}%` }}
              >
                <div className="h-full bg-gradient-to-r from-white/30 to-transparent rounded-full"></div>
              </motion.div>
            </div>
          </div> */}
        </motion.div>

        {/* Enhanced Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/30 p-10 hover:shadow-3xl transition-all duration-500"
        >
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-6 shadow-lg">
              <FaUser className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800">Your Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Field - Enhanced */}
            <div className="group">
              <label className="block text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                Full Name *
              </label>
              <div className="relative">
                <FaUser className="absolute left-4 top-4 text-xl text-gray-400 group-hover:text-blue-500 transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 text-lg font-medium border-3 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/70 backdrop-blur-sm hover:shadow-lg focus:shadow-xl"
                  required
                />
              </div>
            </div>

            {/* Age and Marital Status - Enhanced */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-lg font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  Age (years) *
                </label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-4 top-4 text-xl text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <input
                    type="number"
                    name="age"
                    placeholder="Your age"
                    value={formData.age}
                    onChange={handleChange}
                    min="18"
                    max="80"
                    className="w-full pl-14 pr-6 py-4 text-lg font-medium border-3 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/70 backdrop-blur-sm hover:shadow-lg focus:shadow-xl"
                    required
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-lg font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors">
                  Marital Status
                </label>
                <div className="flex items-center h-16 bg-gradient-to-r from-white to-pink-50 rounded-2xl border-3 border-gray-300 px-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <input
                    type="checkbox"
                    name="maritalStatus"
                    id="maritalStatus"
                    checked={formData.maritalStatus}
                    onChange={handleChange}
                    className="w-6 h-6 text-pink-600 bg-gray-100 border-2 border-gray-400 rounded focus:ring-pink-500 focus:ring-2 transition-colors"
                  />
                  <label htmlFor="maritalStatus" className="ml-4 flex items-center text-lg font-bold text-gray-800 cursor-pointer">
                    <FaHeart className={`mr-3 text-xl transition-colors ${formData.maritalStatus ? 'text-pink-500' : 'text-gray-400'}`} />
                    <span className="transition-colors">{formData.maritalStatus ? 'Married 💕' : 'Single 👤'}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Income Field - Enhanced */}
            <div className="group">
              <label className="block text-lg font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors">
                Monthly Income (₹) *
              </label>
              <div className="relative">
                <FaDollarSign className="absolute left-4 top-4 text-xl text-gray-400 group-hover:text-green-500 transition-colors" />
                <input
                  type="number"
                  name="income"
                  placeholder="Your monthly income"
                  value={formData.income}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 text-lg font-medium border-3 border-gray-300 rounded-2xl focus:border-green-500 focus:outline-none transition-all duration-300 bg-white/70 backdrop-blur-sm hover:shadow-lg focus:shadow-xl"
                  required
                />
              </div>
            </div>

            {/* CIBIL Score - Enhanced */}
            <div className="group">
              <label className="block text-lg font-bold text-gray-800 mb-3 group-hover:text-indigo-600 transition-colors">
                CIBIL Score *
              </label>
              <div className="relative">
                <FaCreditCard className="absolute left-4 top-4 text-xl text-gray-400 group-hover:text-indigo-500 transition-colors z-10" />
                <select
                  name="cibilScore"
                  value={formData.cibilScore}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 text-lg font-medium border-3 border-gray-300 rounded-2xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-white/70 backdrop-blur-sm hover:shadow-lg focus:shadow-xl appearance-none"
                  required
                >
                  <option value="">Select your CIBIL score range</option>
                  <option value="300-549">300-549 (Poor) ❌</option>
                  <option value="550-649">550-649 (Fair) ⚠️</option>
                  <option value="650-749">650-749 (Good) ✅</option>
                  <option value="750-900">750-900 (Excellent) 🌟</option>
                  <option value="unknown">Don't know my score ❓</option>
                </select>
              </div>
              {formData.cibilScore && formData.cibilScore !== 'unknown' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-3 p-4 rounded-xl border-2 ${getCibilScoreColor(formData.cibilScore.split('-')[0])}`}
                >
                  <div className="flex items-center">
                    {parseInt(formData.cibilScore.split('-')[0]) >= 750 ? 
                      <FaCheckCircle className="mr-2 text-xl" /> : 
                      <FaExclamationTriangle className="mr-2 text-xl" />
                    }
                    <p className="text-lg font-bold">
                      {getCibilScoreText(formData.cibilScore.split('-')[0])} - This significantly affects your rates & eligibility
                    </p>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Loan Type - Enhanced with Visual Cards */}
            <div className="group">
              <label className="block text-lg font-bold text-gray-800 mb-4">
                Loan Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {loanTypes.map((type) => (
                  <motion.div
                    key={type.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFormData({...formData, loanType: type.value})}
                    className={`p-6 rounded-2xl border-3 cursor-pointer transition-all duration-300 ${
                      formData.loanType === type.value
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg transform scale-105'
                        : 'border-gray-300 bg-white hover:border-blue-300 hover:shadow-lg'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-3">{type.icon}</div>
                      <div className="text-lg font-bold text-gray-800">{type.label}</div>
                      {formData.loanType === type.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="mt-2"
                        >
                          <FaCheckCircle className="text-blue-500 text-xl mx-auto" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Loan Amount - Enhanced */}
            <div className="group">
              <label className="block text-lg font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
                Loan Amount (₹) *
              </label>
              <div className="relative">
                <FaDollarSign className="absolute left-4 top-4 text-xl text-gray-400 group-hover:text-orange-500 transition-colors" />
                <input
                  type="number"
                  name="amount"
                  placeholder="Required loan amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-4 text-lg font-medium border-3 border-gray-300 rounded-2xl focus:border-orange-500 focus:outline-none transition-all duration-300 bg-white/70 backdrop-blur-sm hover:shadow-lg focus:shadow-xl"
                  required
                />
              </div>
            </div>

            {/* Enhanced Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || embeddingsLoading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-extrabold py-6 px-8 rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 shadow-2xl hover:shadow-3xl group relative overflow-hidden text-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {loading ? (
                <div className="flex items-center justify-center relative z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-3 border-white mr-4"></div>
                  <span className="animate-pulse text-xl">Analyzing with AI & Documents...</span>
                </div>
              ) : embeddingsLoading ? (
                <div className="flex items-center justify-center relative z-10">
                  <FaDatabase className="mr-4 animate-spin text-xl" />
                  <span className="text-xl">Loading Knowledge Base...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center relative z-10">
                  <FaRocket className="mr-4 group-hover:animate-bounce text-xl" />
                  <span className="text-xl">Get RAG-Enhanced Recommendations</span>
                  <FaStar className="ml-4 group-hover:animate-spin text-xl" />
                </div>
              )}
            </motion.button>

            {/* RAG Info - Enhanced */}
            {embeddingsData && embeddingsData.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border-2 border-green-300 shadow-lg"
              >
                <div className="flex items-center text-lg font-bold text-green-800">
                  <FaDatabase className="mr-3 text-xl" />
                  <span>
                    <strong>Enhanced with RAG Technology:</strong> Your recommendations will be based on {embeddingsData.length} verified financial embeddings for maximum accuracy and relevance.
                  </span>
                </div>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .border-3 { border-width: 3px; }
        .shadow-3xl { box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25); }
      `}</style>
    </div>
  );
};

export default LoanForm;





























// import React, { useState } from "react";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
// const ai = new GoogleGenerativeAI(apiKey);

// const LoanForm = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     age: "",
//     income: "",
//     loanType: "personal",
//     amount: "",
//   });

//   const [recommendation, setRecommendation] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setRecommendation("");

//     try {
//       const systemPrompt = `
//         You are an AI loan advisor. 
//         Use the provided financial PDFs (already embedded in RAG) to give personalized recommendations. 
//         Always respond in JSON with fields: loanType, recommendedBanks, interestRates, repaymentOptions, riskLevel, explanation.
//       `;

//       const userPrompt = `
//         User Info:
//         - Name: ${formData.name}
//         - Age: ${formData.age}
//         - Income: ${formData.income}
//         - Loan Type: ${formData.loanType}
//         - Amount: ${formData.amount}
//       `;

//       console.log("📡 Calling Gemini...");
//       const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

//       const genResp = await model.generateContent({
//         contents: [
//           {
//             role: "user",
//             parts: [{ text: systemPrompt + "\n\n" + userPrompt }],
//           },
//         ],
//       });

//       console.log("📦 Raw genResp:", genResp);

//       let text = "";
//       try {
//         text = genResp.response.text();
//       } catch {
//         text = JSON.stringify(genResp, null, 2);
//       }
//       console.log("✅ Gemini Output:", text);

//       // Try to parse JSON (since we expect structured output)
//       try {
//         const parsed = JSON.parse(text);
//         setRecommendation(JSON.stringify(parsed, null, 2));
//       } catch {
//         setRecommendation(text); // fallback
//       }
//     } catch (err) {
//       console.error("❌ Gemini Error:", err);
//       setRecommendation("⚠️ " + err.message);
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
//       <h2 className="text-xl font-bold mb-4">Loan Recommendation Form</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={formData.name}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="number"
//           name="age"
//           placeholder="Age"
//           value={formData.age}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <input
//           type="number"
//           name="income"
//           placeholder="Monthly Income"
//           value={formData.income}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <select
//           name="loanType"
//           value={formData.loanType}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//         >
//           <option value="personal">Personal Loan</option>
//           <option value="home">Home Loan</option>
//           <option value="car">Car Loan</option>
//           <option value="education">Education Loan</option>
//           <option value="business">Business Loan</option>
//           <option value="health">Health Loan</option>
//         </select>
//         <input
//           type="number"
//           name="amount"
//           placeholder="Loan Amount"
//           value={formData.amount}
//           onChange={handleChange}
//           className="w-full p-2 border rounded"
//           required
//         />
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
//         >
//           {loading ? "Fetching..." : "Get Recommendation"}
//         </button>
//       </form>

//       {recommendation && (
//         <div className="mt-6 p-4 bg-gray-100 rounded-lg whitespace-pre-wrap">
//           <h3 className="font-bold mb-2">Recommendation:</h3>
//           <pre className="text-sm">{recommendation}</pre>
//         </div>
//       )}
//     </div>
//   );
// };

// export default LoanForm;
