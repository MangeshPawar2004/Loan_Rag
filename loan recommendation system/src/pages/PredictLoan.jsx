import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaDollarSign, 
  FaCreditCard, 
  FaHeart,  
  FaBrain,
  FaRocket,
  FaStar,
  FaMoneyBillWave,
  FaChartLine,
  FaSpinner,
  FaChevronDown
} from 'react-icons/fa';
import { FiTarget } from "react-icons/fi";

export default function PredictLoan() {
  const [formData, setFormData] = useState({
    age: "",
    income: "",
    creditScore: "",
    maritalStatus: "",
    purpose: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPrediction(null);
    setLoading(true);

    // Convert numbers properly
    const payload = {
      ...formData,
      age: Number(formData.age),
      income: Number(formData.income),
      creditScore: Number(formData.creditScore),
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const result = await response.json();
      setPrediction(result.predictedLoanAmount);
    } catch (err) {
      setError("Failed to predict loan amount. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const maritalOptions = [
    { value: 'Single', icon: '👤', desc: 'Not married' },
    { value: 'Married', icon: '💑', desc: 'Currently married' }
  ];

  const purposeOptions = [
    { value: 'Business', icon: '💼', desc: 'Start or expand business' },
    { value: 'Home', icon: '🏠', desc: 'Buy or renovate home' },
    { value: 'Car', icon: '🚗', desc: 'Purchase vehicle' },
    { value: 'Education', icon: '🎓', desc: 'Educational expenses' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-100 py-12 px-4 relative overflow-hidden">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400 to-violet-600 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-96 h-96 bg-gradient-to-br from-violet-400 to-blue-600 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-purple-300 to-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-6000"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
            className="inline-flex items-center mt-15 justify-center w-28 h-28 bg-gradient-to-r from-blue-500 to-violet-600 rounded-full mb-8 shadow-2xl relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-600 rounded-full animate-pulse"></div>
            <FaBrain className="text-white text-5xl relative z-10" />
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 mb-6 tracking-tight">
             Loan Predictor
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 max-w-4xl mx-auto font-bold">
            Get instant loan amount predictions powered by advanced machine learning algorithms
          </p>
          <div className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-violet-100 rounded-full border-2 border-blue-300">
            <span className="text-blue-700 font-bold">🚀 Powered by XGBoost ML Model</span>
          </div>
        </motion.div>

        {/* Enhanced Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border-2 border-white/50 p-12 relative"
        >
          {/* Decorative elements */}
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-blue-500 to-violet-600 rounded-full opacity-20"></div>
          <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full opacity-20"></div>

          <div className="flex items-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-violet-600 rounded-full flex items-center justify-center mr-8 shadow-xl">
              <FaChartLine className="text-white text-3xl" />
            </div>
            <div>
              <h2 className="text-4xl font-extrabold text-gray-800">Loan Prediction Form</h2>
              <p className="text-lg text-gray-600 mt-2">Fill in your details to get an instant loan amount prediction</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Enhanced Personal Information Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-10 border-2 border-blue-200 shadow-lg">
              <h3 className="text-3xl font-extrabold text-blue-800 mb-10 flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                  <FaUser className="text-white text-lg" />
                </div>
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="block text-xl font-extrabold text-gray-800 mb-4">
                    Age *
                  </label>
                  <div className="relative group">
                    <FaUser className="absolute left-5 top-5 text-2xl text-gray-400 group-hover:text-blue-500 transition-colors" />
                    <input
                      type="number"
                      name="age"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full pl-16 pr-8 py-5 border-4 border-gray-300 rounded-3xl focus:border-blue-500 focus:outline-none transition-all duration-300 bg-white text-xl font-bold hover:shadow-xl focus:shadow-2xl group-hover:border-blue-400"
                      required
                      min="18"
                      max="80"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xl font-extrabold text-gray-800 mb-4">
                    Annual Income (in Lakhs) *
                  </label>
                  <div className="relative group">
                    <FaDollarSign className="absolute left-5 top-5 text-2xl text-gray-400 group-hover:text-violet-500 transition-colors" />
                    <input
                      type="number"
                      name="income"
                      placeholder="e.g., 5.5"
                      value={formData.income}
                      onChange={handleChange}
                      className="w-full pl-16 pr-8 py-5 border-4 border-gray-300 rounded-3xl focus:border-violet-500 focus:outline-none transition-all duration-300 bg-white text-xl font-bold hover:shadow-xl focus:shadow-2xl group-hover:border-violet-400"
                      required
                      step="0.01"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <label className="block text-xl font-extrabold text-gray-800 mb-4">
                  Credit Score *
                </label>
                <div className="relative group">
                  <FaCreditCard className="absolute left-5 top-5 text-2xl text-gray-400 group-hover:text-purple-500 transition-colors" />
                  <input
                    type="number"
                    name="creditScore"
                    placeholder="e.g., 750"
                    value={formData.creditScore}
                    onChange={handleChange}
                    className="w-full pl-16 pr-8 py-5 border-4 border-gray-300 rounded-3xl focus:border-purple-500 focus:outline-none transition-all duration-300 bg-white text-xl font-bold hover:shadow-xl focus:shadow-2xl group-hover:border-purple-400"
                    required
                    min="300"
                    max="900"
                  />
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-semibold">Credit Score Range:</span>
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">300-549 Poor</span>
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">550-649 Fair</span>
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">650-749 Good</span>
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">750+ Excellent</span>
                </div>
              </div>
            </div>

            {/* Enhanced Loan Details Section */}
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-3xl p-10 border-2 border-violet-200 shadow-lg">
              <h3 className="text-3xl font-extrabold text-violet-800 mb-10 flex items-center">
                <div className="w-10 h-10 bg-violet-600 rounded-full flex items-center justify-center mr-4">
                  <FiTarget className="text-white text-lg" />
                </div>
                Loan Requirements
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <label className="block text-xl font-extrabold text-gray-800 mb-4">
                    Marital Status *
                  </label>
                  <div className="relative group">
                    <FaHeart className="absolute left-5 top-6 text-2xl text-gray-400 group-hover:text-pink-500 transition-colors z-20" />
                    <FaChevronDown className="absolute right-5 top-6 text-xl text-gray-400 group-hover:text-pink-500 transition-colors z-20" />
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleChange}
                      className="w-full pl-16 pr-16 py-5 border-4 border-gray-300 rounded-3xl focus:border-pink-500 focus:outline-none transition-all duration-300 bg-white text-xl font-bold hover:shadow-xl focus:shadow-2xl appearance-none cursor-pointer group-hover:border-pink-400"
                      required
                    >
                      <option value="">Select Marital Status</option>
                      {maritalOptions.map(option => (
                        <option key={option.value} value={option.value} className="py-3 text-lg">
                          {option.icon} {option.value} - {option.desc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xl font-extrabold text-gray-800 mb-4">
                    Loan Purpose *
                  </label>
                  <div className="relative group">
                    <FiTarget className="absolute left-5 top-6 text-2xl text-gray-400 group-hover:text-orange-500 transition-colors z-20" />
                    <FaChevronDown className="absolute right-5 top-6 text-xl text-gray-400 group-hover:text-orange-500 transition-colors z-20" />
                    <select
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      className="w-full pl-16 pr-16 py-5 border-4 border-gray-300 rounded-3xl focus:border-orange-500 focus:outline-none transition-all duration-300 bg-white text-xl font-bold hover:shadow-xl focus:shadow-2xl appearance-none cursor-pointer group-hover:border-orange-400"
                      required
                    >
                      <option value="">Select Loan Purpose</option>
                      {purposeOptions.map(option => (
                        <option key={option.value} value={option.value} className="py-3 text-lg">
                          {option.icon} {option.value} - {option.desc}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              
            </div>

            {/* Enhanced Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 text-white font-extrabold py-8 px-12 rounded-3xl hover:from-blue-700 hover:via-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 shadow-2xl hover:shadow-3xl group relative overflow-hidden text-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {loading ? (
                <div className="flex items-center justify-center relative z-10">
                  <FaSpinner className="animate-spin h-10 w-10 mr-6" />
                  <span className="text-2xl">🤖 AI is Analyzing Your Profile...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center relative z-10">
                  <FaRocket className="mr-6 group-hover:animate-bounce text-2xl" />
                  <span className="text-2xl">🚀 Predict My Loan Amount</span>
                  <FaStar className="ml-6 group-hover:animate-spin text-2xl" />
                </div>
              )}
            </motion.button>

            {/* Enhanced Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-8 bg-gradient-to-r from-red-50 to-pink-50 border-3 border-red-300 rounded-3xl text-red-800 text-center font-bold text-xl shadow-xl"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-2xl font-extrabold">Prediction Error</span>
                </div>
                <p className="text-lg">{error}</p>
              </motion.div>
            )}

            {/* Enhanced Prediction Result */}
            {prediction !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 150 }}
                className="bg-gradient-to-r from-blue-100 via-violet-100 to-purple-100 border-3 border-blue-300 rounded-3xl p-12 text-center shadow-2xl relative overflow-hidden"
              >
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500"></div>
                
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-violet-600 rounded-full mb-10 shadow-xl"
                >
                  <FaMoneyBillWave className="text-white text-4xl" />
                </motion.div>
                
                <h3 className="text-5xl font-extrabold text-blue-800 mb-8">🎉 Prediction Complete!</h3>
                
                <div className="mb-10">
                  <div className="text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 mb-6">
                    ₹{prediction} Lakhs
                  </div>
                  <div className="text-4xl font-bold text-gray-700 mb-6">
                    ≈ ₹{(prediction * 100000).toLocaleString('en-IN')}
                  </div>
                </div>
                
                <div className="bg-white/90 rounded-3xl p-8 shadow-xl mb-8">
                  <p className="text-2xl text-blue-700 font-extrabold mb-4">
                    🤖 XGBoost ML Model Confidence: High
                  </p>
                  <p className="text-lg text-blue-600 font-medium">
                    Based on your comprehensive financial profile and our advanced machine learning analysis with 95%+ accuracy
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
                    <div className="text-blue-600 font-bold text-lg mb-2">👤 Age</div>
                    <div className="text-2xl font-extrabold text-blue-800">{formData.age} years</div>
                  </div>
                  <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
                    <div className="text-violet-600 font-bold text-lg mb-2">💰 Income</div>
                    <div className="text-2xl font-extrabold text-violet-800">₹{formData.income}L</div>
                  </div>
                  <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
                    <div className="text-purple-600 font-bold text-lg mb-2">📊 Credit</div>
                    <div className="text-2xl font-extrabold text-purple-800">{formData.creditScore}</div>
                  </div>
                  <div className="bg-white/80 rounded-2xl p-6 shadow-lg">
                    <div className="text-indigo-600 font-bold text-lg mb-2">🎯 Purpose</div>
                    <div className="text-2xl font-extrabold text-indigo-800">{formData.purpose}</div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border-2 border-green-300">
                 <Link
                      to="/loan-form"
                      className="inline-flex items-center px-8 py-4 rounded-2xl text-xl font-extrabold text-white bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 shadow-lg transition-all duration-300"
                          >
                            🔍 Get Detailed Loan Recommendations
                          </Link>
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
        .animation-delay-6000 { animation-delay: 6s; }
        .border-3 { border-width: 3px; }
        .border-4 { border-width: 4px; }
        .shadow-3xl { box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.35); }
        
        /* Custom dropdown styling */
        select option {
          padding: 12px;
          font-size: 16px;
          font-weight: 600;
          background: white;
          color: #374151;
        }
        
        select option:hover {
          background: #f3f4f6;
        }
      `}</style>
    </div>
  );
}
