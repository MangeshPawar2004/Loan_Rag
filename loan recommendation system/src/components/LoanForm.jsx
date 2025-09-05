import React, { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  FaUser, 
  FaCalendarAlt, 
  FaDollarSign, 
  FaUniversity, 
  FaChartLine, 
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaHeart,
  FaCreditCard,
  FaRocket,
  FaStar,
  FaTrophy,
  FaGift
} from "react-icons/fa";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(apiKey);

const LoanForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    income: "",
    loanType: "personal",
    amount: "",
    cibilScore: "",
    maritalStatus: false,
  });

  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formProgress, setFormProgress] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    calculateProgress();
  }, [formData]);

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

  const getLoanTypeIcon = (type) => {
    const icons = {
      personal: "💳",
      home: "🏠",
      car: "🚗",
      education: "🎓",
      business: "💼",
      health: "🏥"
    };
    return icons[type] || "💳";
  };

  const getCibilScoreColor = (score) => {
    if (!score) return 'text-gray-600';
    const numScore = parseInt(score);
    if (numScore >= 750) return 'text-green-600';
    if (numScore >= 650) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCibilScoreText = (score) => {
    if (!score) return '';
    const numScore = parseInt(score);
    if (numScore >= 750) return '(Excellent)';
    if (numScore >= 650) return '(Good)';
    if (numScore >= 600) return '(Fair)';
    return '(Poor)';
  };

  const getRiskColor = (risk) => {
    switch(risk?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200 shadow-green-100';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 shadow-yellow-100';
      case 'high': return 'bg-red-100 text-red-800 border-red-200 shadow-red-100';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 shadow-gray-100';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRecommendation(null);

    try {
      const systemPrompt = `
        You are an AI loan advisor for Indian customers. 
        Provide personalized loan recommendations based on user information.
        Always respond in JSON format with these exact fields:
        {
          "loanType": "string",
          "recommendedBanks": ["bank1", "bank2", "bank3"],
          "interestRates": ["rate1", "rate2", "rate3"],
          "repaymentOptions": ["option1", "option2"],
          "riskLevel": "Low/Medium/High",
          "explanation": "detailed explanation",
          "eligibility": "Eligible/Partially Eligible/Not Eligible",
          "monthlyEMI": "estimated EMI amount",
          "processingTime": "time in days",
          "cibilImpact": "how CIBIL score affects the recommendation",
          "maritalBenefit": "how marital status affects the recommendation",
          "specialOffers": ["offer1", "offer2"],
          "approvalChance": "percentage"
        }
      `;

      const userPrompt = `
        User Info:
        - Name: ${formData.name}
        - Age: ${formData.age}
        - Income: ₹${formData.income}
        - Loan Type: ${formData.loanType}
        - Amount: ₹${formData.amount}
        - CIBIL Score: ${formData.cibilScore}
        - Marital Status: ${formData.maritalStatus ? 'Married' : 'Single'}
        
        Provide recommendations for Indian banks and financial institutions.
        Consider the CIBIL score impact on interest rates and eligibility.
        Factor in marital status for joint loan applications and income stability.
      `;

      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
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
        const parsed = JSON.parse(jsonMatch[0]);
        setRecommendation(parsed);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("❌ Gemini Error:", err);
      setRecommendation({
        error: true,
        message: "Unable to get recommendations. Please try again."
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 px-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className={`max-w-7xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="text-center mb-6 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 animate-pulse">
            <FaUniversity className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Smart Loan Advisor
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            Get AI-powered, personalized loan recommendations tailored just for you
          </p>
          
          {/* Progress Bar */}
          <div className="mt-4 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>Profile Completion</span>
              <span>{Math.round(formProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${formProgress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6 relative z-10">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8 hover:shadow-3xl transition-all duration-500">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                  <FaUser className="text-white text-xl" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Your Information</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
                    Full Name
                  </label>
                  <div className="relative">
                    <FaUser className="absolute left-3 top-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm hover:shadow-md"
                      required
                    />
                  </div>
                </div>

                {/* Age and Marital Status Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-blue-600 transition-colors">
                      Age
                    </label>
                    <div className="relative">
                      <FaCalendarAlt className="absolute left-3 top-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                      <input
                        type="number"
                        name="age"
                        placeholder="Your age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm hover:shadow-md"
                        required
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-pink-600 transition-colors">
                      Marital Status
                    </label>
                    <div className="flex items-center h-12 bg-gradient-to-r from-gray-50 to-pink-50 rounded-xl border-2 border-gray-200 px-4 hover:shadow-md transition-all duration-300">
                      <input
                        type="checkbox"
                        name="maritalStatus"
                        id="maritalStatus"
                        checked={formData.maritalStatus}
                        onChange={handleChange}
                        className="w-5 h-5 text-pink-600 bg-gray-100 border-gray-300 rounded focus:ring-pink-500 focus:ring-2 transition-colors"
                      />
                      <label htmlFor="maritalStatus" className="ml-3 flex items-center text-gray-700 font-medium cursor-pointer">
                        <FaHeart className={`mr-2 transition-colors ${formData.maritalStatus ? 'text-pink-500' : 'text-gray-400'}`} />
                        <span className="transition-colors">{formData.maritalStatus ? 'Married' : 'Single'}</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Income Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-green-600 transition-colors">
                    Monthly Income (₹)
                  </label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-3 text-gray-400 group-hover:text-green-500 transition-colors" />
                    <input
                      type="number"
                      name="income"
                      placeholder="Your monthly income"
                      value={formData.income}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm hover:shadow-md"
                      required
                    />
                  </div>
                </div>

                {/* CIBIL Score Dropdown */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
                    CIBIL Score
                  </label>
                  <div className="relative">
                    <FaCreditCard className="absolute left-3 top-3 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                    <select
                      name="cibilScore"
                      value={formData.cibilScore}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm hover:shadow-md ${getCibilScoreColor(formData.cibilScore)}`}
                      required
                    >
                      <option value="">Select your CIBIL score range</option>
                      <option value="300-549">300-549 (Poor)</option>
                      <option value="550-649">550-649 (Fair)</option>
                      <option value="650-749">650-749 (Good)</option>
                      <option value="750-900">750-900 (Excellent)</option>
                      <option value="unknown">Don't know my score</option>
                    </select>
                  </div>
                  {formData.cibilScore && formData.cibilScore !== 'unknown' && (
                    <p className={`text-sm mt-2 font-medium px-3 py-1 rounded-lg ${getCibilScoreColor(formData.cibilScore.split('-')[0])} bg-white/50 backdrop-blur-sm animate-fadeIn`}>
                      {getCibilScoreText(formData.cibilScore.split('-')[0])} - This affects your rates & eligibility
                    </p>
                  )}
                </div>

                {/* Loan Type */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-purple-600 transition-colors">
                    Loan Type
                  </label>
                  <select
                    name="loanType"
                    value={formData.loanType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm hover:shadow-md"
                  >
                    <option value="personal">💳 Personal Loan</option>
                    <option value="home">🏠 Home Loan</option>
                    <option value="car">🚗 Car Loan</option>
                    <option value="education">🎓 Education Loan</option>
                    <option value="business">💼 Business Loan</option>
                    <option value="health">🏥 Health Loan</option>
                  </select>
                </div>

                {/* Loan Amount */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-orange-600 transition-colors">
                    Loan Amount (₹)
                  </label>
                  <div className="relative">
                    <FaDollarSign className="absolute left-3 top-3 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    <input
                      type="number"
                      name="amount"
                      placeholder="Required loan amount"
                      value={formData.amount}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all duration-300 bg-white/50 backdrop-blur-sm hover:shadow-md"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 transform hover:scale-105 hover:shadow-2xl group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  {loading ? (
                    <div className="flex items-center justify-center relative z-10">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      <span className="animate-pulse">Analyzing Your Profile...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center relative z-10">
                      <FaRocket className="mr-3 group-hover:animate-bounce" />
                      Get My Recommendations
                      <FaStar className="ml-3 group-hover:animate-spin" />
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Recommendation Section */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 md:p-8 hover:shadow-3xl transition-all duration-500 min-h-[600px]">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-4">
                  <FaChartLine className="text-white text-xl" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">Your Recommendations</h2>
              </div>

              {!recommendation && !loading && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-6 animate-bounce">
                    <span className="text-4xl">📊</span>
                  </div>
                  <p className="text-gray-500 text-lg mb-4">
                    Fill out the form to get personalized loan recommendations
                  </p>
                  <div className="flex justify-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse animation-delay-200"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse animation-delay-400"></div>
                  </div>
                </div>
              )}

              {loading && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6 animate-spin">
                    <FaRocket className="text-white text-2xl" />
                  </div>
                  <p className="text-gray-600 text-lg mb-4 animate-pulse">Analyzing your profile...</p>
                  <div className="max-w-xs mx-auto bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full animate-progress"></div>
                  </div>
                </div>
              )}

              {recommendation && !recommendation.error && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Eligibility Status */}
                  <div className={`p-4 rounded-2xl border-2 shadow-lg transition-all duration-500 hover:scale-105 ${
                    recommendation.eligibility === 'Eligible' 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                      : recommendation.eligibility === 'Partially Eligible'
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                      : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {recommendation.eligibility === 'Eligible' && <FaCheckCircle className="text-green-600 text-2xl mr-3 animate-bounce" />}
                        {recommendation.eligibility === 'Partially Eligible' && <FaExclamationTriangle className="text-yellow-600 text-2xl mr-3 animate-pulse" />}
                        {recommendation.eligibility === 'Not Eligible' && <FaInfoCircle className="text-red-600 text-2xl mr-3" />}
                        <span className="font-bold text-xl">
                          {recommendation.eligibility}
                        </span>
                      </div>
                      {recommendation.approvalChance && (
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-600">Approval Chance</div>
                          <div className="text-2xl font-bold text-green-600">{recommendation.approvalChance}%</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Summary Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="text-xs font-semibold text-blue-800 mb-1">CIBIL Score</div>
                      <div className="text-sm font-bold text-blue-900 flex items-center">
                        📊 {formData.cibilScore === 'unknown' ? 'Unknown' : formData.cibilScore}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl border border-pink-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="text-xs font-semibold text-pink-800 mb-1">Status</div>
                      <div className="text-sm font-bold text-pink-900 flex items-center">
                        {formData.maritalStatus ? '💑 Married' : '👤 Single'}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="text-xs font-semibold text-green-800 mb-1">Income</div>
                      <div className="text-sm font-bold text-green-900 flex items-center">
                        💰 ₹{parseInt(formData.income).toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="text-xs font-semibold text-purple-800 mb-1">Amount</div>
                      <div className="text-sm font-bold text-purple-900 flex items-center">
                        💸 ₹{parseInt(formData.amount).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Loan Details */}
                  <div className="grid lg:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                      <div className="text-sm font-semibold text-blue-800 mb-2 flex items-center">
                        <FaTrophy className="mr-2" />
                        Recommended Loan
                      </div>
                      <div className="text-2xl font-bold text-blue-900 flex items-center">
                        {getLoanTypeIcon(formData.loanType)} {recommendation.loanType}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300">
                      <div className="text-sm font-semibold text-green-800 mb-2 flex items-center">
                        <FaDollarSign className="mr-2" />
                        Monthly EMI
                      </div>
                      <div className="text-2xl font-bold text-green-900">
                        ₹{recommendation.monthlyEMI}
                      </div>
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div className={`p-6 rounded-2xl border-2 shadow-lg transition-all duration-500 hover:scale-105 ${getRiskColor(recommendation.riskLevel)}`}>
                    <div className="flex items-center">
                      <FaShieldAlt className="text-2xl mr-3" />
                      <span className="font-bold text-lg">Risk Level: {recommendation.riskLevel}</span>
                    </div>
                  </div>

                  {/* Special Offers */}
                  {recommendation.specialOffers && (
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200 hover:shadow-lg transition-all duration-300">
                      <h3 className="font-bold text-lg mb-3 flex items-center text-orange-800">
                        <FaGift className="mr-2" />
                        Special Offers
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {recommendation.specialOffers.map((offer, index) => (
                          <span key={index} className="bg-gradient-to-r from-yellow-200 to-orange-200 text-orange-800 px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300">
                            🎁 {offer}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Impact Analysis */}
                  {(recommendation.cibilImpact || recommendation.maritalBenefit) && (
                    <div className="grid lg:grid-cols-2 gap-4">
                      {recommendation.cibilImpact && (
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-200 hover:shadow-lg transition-all duration-300">
                          <h3 className="font-bold text-sm text-indigo-800 mb-2 flex items-center">
                            📊 CIBIL Impact
                          </h3>
                          <p className="text-indigo-700 text-sm leading-relaxed">{recommendation.cibilImpact}</p>
                        </div>
                      )}
                      {recommendation.maritalBenefit && (
                        <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl border border-pink-200 hover:shadow-lg transition-all duration-300">
                          <h3 className="font-bold text-sm text-pink-800 mb-2 flex items-center">
                            💑 Marital Benefit
                          </h3>
                          <p className="text-pink-700 text-sm leading-relaxed">{recommendation.maritalBenefit}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Recommended Banks */}
                  <div>
                    <h3 className="font-bold text-lg mb-4 flex items-center text-gray-800">
                      <FaUniversity className="text-blue-600 mr-3" />
                      Recommended Banks
                    </h3>
                    <div className="grid gap-3">
                      {recommendation.recommendedBanks?.map((bank, index) => (
                        <div key={index} className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                          <span className="font-semibold text-gray-800">{bank}</span>
                          <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full text-sm font-bold shadow-md">
                            {recommendation.interestRates?.[index] || 'Contact for rates'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Info Grid */}
                  <div className="grid lg:grid-cols-2 gap-4">
                    {/* Repayment Options */}
                    {recommendation.repaymentOptions && (
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                        <h3 className="font-bold text-lg mb-3 text-purple-800">💰 Repayment Options</h3>
                        <div className="flex flex-wrap gap-2">
                          {recommendation.repaymentOptions.map((option, index) => (
                            <span key={index} className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-2 rounded-full text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300">
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Processing Time */}
                    {recommendation.processingTime && (
                      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-200">
                        <div className="text-sm font-semibold text-indigo-800 mb-2 flex items-center">
                          ⏱️ Processing Time
                        </div>
                        <div className="text-2xl font-bold text-indigo-900">{recommendation.processingTime}</div>
                      </div>
                    )}
                  </div>

                  {/* Detailed Explanation */}
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                    <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center">
                      📝 Detailed Analysis
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{recommendation.explanation}</p>
                  </div>
                </div>
              )}

              {recommendation?.error && (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-100 to-pink-100 rounded-full mb-6">
                    <span className="text-4xl">⚠️</span>
                  </div>
                  <p className="text-red-600 text-lg font-semibold">{recommendation.message}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-progress { animation: progress 2s ease-in-out infinite; }
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
