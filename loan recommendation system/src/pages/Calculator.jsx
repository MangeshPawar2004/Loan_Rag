import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Calculator, 
  TrendingUp, 
  FileText, 
  Target,
  DollarSign,
  Clock,
  BarChart3,
  CheckCircle,
  Info,
  Zap
} from "lucide-react";

export default function CalculatorPage() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(60);
  const [loanType, setLoanType] = useState("personal");

  const loanDefaults = {
  personal: 11.5,
  home: 8.5,
  car: 9.0,
  education: 7.5,
};

  const [emi, setEmi] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [risk, setRisk] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Auto-calculate when inputs change
  useEffect(() => {
    calculateEMI();
    analyzeRisk();
  }, [loanAmount, interestRate, tenure]);

  // Enhanced EMI calculation
  const calculateEMI = () => {
    const monthlyRate = interestRate / 12 / 100;
    const emiValue = monthlyRate > 0 
      ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
        (Math.pow(1 + monthlyRate, tenure) - 1)
      : loanAmount / tenure;
    
    const totalAmountValue = emiValue * tenure;
    const totalInterestValue = totalAmountValue - loanAmount;
    
    setEmi(Math.round(emiValue));
    setTotalAmount(Math.round(totalAmountValue));
    setTotalInterest(Math.round(totalInterestValue));
    setShowResults(true);
  };

  // Enhanced risk analysis
  const analyzeRisk = () => {
    let score = 100;
    const monthlyIncome = loanAmount * 0.4; // Assumed income
    const emiToIncomeRatio = (emi || 0) / monthlyIncome;
    
    if (loanAmount > 2000000) score -= 25;
    else if (loanAmount > 1000000) score -= 15;
    
    if (interestRate > 12) score -= 20;
    else if (interestRate > 10) score -= 10;
    
    if (tenure > 180) score -= 15;
    else if (tenure > 120) score -= 8;
    
    if (emiToIncomeRatio > 0.5) score -= 20;
    else if (emiToIncomeRatio > 0.4) score -= 10;
    
    setRisk(Math.max(0, Math.min(100, score)));
  };

  const loanTypes = [
    { value: "personal", label: "Personal Loan", icon: "💳" },
    { value: "home", label: "Home Loan", icon: "🏠" },
    { value: "car", label: "Car Loan", icon: "🚗" },
    { value: "education", label: "Education Loan", icon: "🎓" }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRiskColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getRiskText = (score) => {
    if (score >= 80) return "Low Risk";
    if (score >= 60) return "Medium Risk";
    return "High Risk";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20 px-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-6">
            Loan{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
              Calculator
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate your EMI, analyze risk, and make informed loan decisions with our advanced calculator
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Calculator Inputs */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8">
              <div className="flex items-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Loan Calculator</h2>
              </div>

              {/* Loan Type Selection */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-4">Loan Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {loanTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => {
    setLoanType(type.value);
    setInterestRate(loanDefaults[type.value]);  
  }}
                      className={`p-4 rounded-xl border-2 text-center transition-all duration-300 ${
                        loanType === type.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="text-sm font-medium">{type.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Loan Amount: {formatCurrency(loanAmount)}
                  </label>
                  <input
                    type="range"
                    min="50000"
                    max="5000000"
                    step="10000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>₹50K</span>
                    <span>₹50L</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Interest Rate: {interestRate}%
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>5%</span>
                    <span>20%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tenure: {tenure} months ({Math.round(tenure/12)} years)
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="360"
                    step="6"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1yr</span>
                    <span>30yrs</span>
                  </div>
                </div>
              </div>

              {/* Precise Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Exact Amount (₹)</label>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white/80"
                    placeholder="Enter loan amount"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Exact Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white/80"
                    placeholder="Enter interest rate"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Exact Tenure (months)</label>
                  <input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white/80"
                    placeholder="Enter tenure"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* EMI Results */}
            {showResults && (
              <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <DollarSign className="w-6 h-6 mr-2 text-green-600" />
                  Calculation Results
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                    <div className="text-sm text-blue-600 font-medium mb-1">Monthly EMI</div>
                    <div className="text-3xl font-bold text-blue-800">{formatCurrency(emi)}</div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                    <div className="text-sm text-green-600 font-medium mb-1">Total Interest</div>
                    <div className="text-xl font-bold text-green-800">{formatCurrency(totalInterest)}</div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-200">
                    <div className="text-sm text-purple-600 font-medium mb-1">Total Amount</div>
                    <div className="text-xl font-bold text-purple-800">{formatCurrency(totalAmount)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl shadow-xl border border-yellow-200 p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-yellow-600" />
                Quick Tips
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Keep EMI under 40% of your income</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Higher down payment reduces EMI</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Compare rates across lenders</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Maintain good credit score</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Future Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Coming Soon</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Compare Lenders</h3>
              <p className="text-gray-600">Auto-fetch real-time interest rates from top banks and NBFCs for accurate comparison.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Smart Documentation</h3>
              <p className="text-gray-600">AI-powered document checklist based on your loan type and risk profile.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Gamified Improvement</h3>
              <p className="text-gray-600">Track your progress and get personalized tips to improve loan eligibility.</p>
            </div>
          </div>
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
        
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #6366f1);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #3b82f6;
        }
        
        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3b82f6, #6366f1);
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 0 0 2px #3b82f6;
        }
      `}</style>
    </div>
  );
}
