import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  FaUser, 
  FaChartLine, 
  FaShieldAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaUniversity, 
  FaDollarSign, 
  FaTrophy,
  FaGift,
  FaArrowLeft,
  FaDownload,
  FaShare,
  FaRobot,
  FaPaperPlane,
  FaMicrophone,
  FaQuestionCircle,
  FaFileAlt,
  FaClock,
  FaCalculator
} from "react-icons/fa";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(apiKey);

const ChatBot = ({ formData, recommendation }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello ${formData?.name}! 👋 I'm your loan advisor assistant. I can help you with questions about your loan recommendation, eligibility requirements, documentation, and more. How can I assist you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Pre-built question templates
  const quickQuestions = [
    {
      icon: <FaQuestionCircle className="text-blue-500" />,
      text: "What documents do I need?",
      query: "What documents are required for my loan application?"
    },
    {
      icon: <FaFileAlt className="text-green-500" />,
      text: "Eligibility criteria",
      query: "What are the detailed eligibility criteria for my loan?"
    },
    {
      icon: <FaClock className="text-orange-500" />,
      text: "Processing timeline",
      query: "How long will my loan processing take?"
    },
    {
      icon: <FaCalculator className="text-purple-500" />,
      text: "EMI calculation details",
      query: "Can you explain how my EMI was calculated?"
    },
    {
      icon: <FaDollarSign className="text-green-600" />,
      text: "Interest rate factors",
      query: "What factors affect my interest rate?"
    },
    {
      icon: <FaUniversity className="text-blue-600" />,
      text: "Why these banks?",
      query: "Why were these specific banks recommended for me?"
    }
  ];

  const handleQuickQuestion = (question) => {
    handleSendMessage(question.query);
  };

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const systemPrompt = `
        You are a helpful loan advisor assistant. The user has just received loan recommendations based on their profile.
        
        User Profile:
        - Name: ${formData?.name}
        - Age: ${formData?.age}
        - Income: ₹${formData?.income}
        - Loan Type: ${formData?.loanType}
        - Amount: ₹${formData?.amount}
        - CIBIL Score: ${formData?.cibilScore}
        - Marital Status: ${formData?.maritalStatus ? 'Married' : 'Single'}
        
        Recommendations Received:
        - Eligibility: ${recommendation?.eligibility}
        - Monthly EMI: ₹${recommendation?.monthlyEMI}
        - Risk Level: ${recommendation?.riskLevel}
        - Recommended Banks: ${recommendation?.recommendedBanks?.join(', ')}
        - Interest Rates: ${recommendation?.interestRates?.join(', ')}
        - Processing Time: ${recommendation?.processingTime}
        
        Guidelines:
        1. Be helpful, professional, and conversational
        2. Use the user's profile data to give personalized responses
        3. Focus on loan-related topics (eligibility, documentation, processes, etc.)
        4. Provide accurate information about Indian banking and loan processes
        5. Keep responses concise but informative
        6. Use emojis sparingly and appropriately
        7. If asked about something outside loan/banking domain, politely redirect to loan topics
        8. Always be encouraging and supportive
      `;

      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent({
        contents: [{
          role: "user",
          parts: [{ text: systemPrompt + "\n\nUser Question: " + messageText }]
        }]
      });

      const botResponse = result.response.text();

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or feel free to contact our support team for immediate assistance.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${isMinimized ? 'w-16 h-16' : 'w-96 h-[600px]'}`}>
      {isMinimized ? (
        // Minimized Chatbot Button
        <button
          onClick={() => setIsMinimized(false)}
          className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group hover:scale-110"
        >
          <FaRobot className="text-white text-2xl group-hover:animate-bounce" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold animate-pulse">💬</span>
          </div>
        </button>
      ) : (
        // Expanded Chatbot Interface
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
                  <FaRobot className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Loan Assistant</h3>
                  <p className="text-blue-100 text-sm">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <span className="text-white font-bold">−</span>
              </button>
            </div>
          </div>

          {/* Quick Questions */}
          <div className="p-4 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-3">Quick Questions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.slice(0, 4).map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="flex items-center p-2 bg-gray-50 hover:bg-blue-50 rounded-lg text-xs text-gray-700 hover:text-blue-700 transition-colors text-left"
                >
                  <span className="mr-2">{question.icon}</span>
                  <span className="truncate">{question.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-80 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs px-4 py-2 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-400"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your loan..."
                  className="w-full p-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                  rows="1"
                  style={{ minHeight: '44px', maxHeight: '100px' }}
                />
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                className="w-11 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </div>
            
            {/* More Quick Questions */}
            <div className="mt-3 flex flex-wrap gap-1">
              {quickQuestions.slice(4).map((question, index) => (
                <button
                  key={index + 4}
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                >
                  {question.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  const { formData, recommendation } = location.state || {};

  useEffect(() => {
    if (!formData || !recommendation) {
      navigate('/');
      return;
    }
    setIsVisible(true);
  }, [formData, recommendation, navigate]);

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

  const getRiskColor = (risk) => {
    switch(risk?.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200 shadow-green-100';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 shadow-yellow-100';
      case 'high': return 'bg-red-100 text-red-800 border-red-200 shadow-red-100';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 shadow-gray-100';
    }
  };

  const handleNewSearch = () => {
    navigate('/');
  };

  const handleDownloadReport = () => {
    const reportData = {
      applicant: formData,
      recommendations: recommendation,
      generatedAt: new Date().toLocaleString()
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `loan_recommendation_${formData.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!formData || !recommendation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 overflow-hidden pb-32">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200 to-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-yellow-200 to-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-4 animate-pulse">
            <FaChartLine className="text-white text-3xl" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
            Your Loan Recommendations
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Personalized recommendations based on your profile
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <button
              onClick={handleNewSearch}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              <FaArrowLeft className="mr-2" />
              New Search
            </button>
            <button
              onClick={handleDownloadReport}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:scale-105"
            >
              <FaDownload className="mr-2" />
              Download Report
            </button>
          </div>
        </div>

        {!recommendation.error ? (
          <div className="space-y-8 relative z-10">
            {/* User Profile Summary */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                  <FaUser className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Applicant Profile</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-semibold text-blue-800 mb-1">Name</div>
                  <div className="text-lg font-bold text-blue-900">{formData.name}</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-semibold text-green-800 mb-1">Age</div>
                  <div className="text-lg font-bold text-green-900">{formData.age} years</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-semibold text-purple-800 mb-1">Income</div>
                  <div className="text-lg font-bold text-purple-900">₹{parseInt(formData.income).toLocaleString()}</div>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl border border-pink-200 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-semibold text-pink-800 mb-1">Status</div>
                  <div className="text-lg font-bold text-pink-900">
                    {formData.maritalStatus ? '💑 Married' : '👤 Single'}
                  </div>
                </div>
              </div>

              {/* Additional Profile Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-semibold text-indigo-800 mb-1">CIBIL Score</div>
                  <div className="text-lg font-bold text-indigo-900">
                    {formData.cibilScore === 'unknown' ? '❓ Unknown' : `📊 ${formData.cibilScore}`}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-semibold text-orange-800 mb-1">Loan Type</div>
                  <div className="text-lg font-bold text-orange-900">
                    {getLoanTypeIcon(formData.loanType)} {formData.loanType}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-xl border border-teal-200 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-semibold text-teal-800 mb-1">Amount</div>
                  <div className="text-lg font-bold text-teal-900">₹{parseInt(formData.amount).toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Eligibility & Key Metrics */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Eligibility Status */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Eligibility Status</h2>
                
                <div className={`p-6 rounded-2xl border-2 shadow-lg transition-all duration-500 hover:scale-105 ${
                  recommendation.eligibility === 'Eligible' 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                    : recommendation.eligibility === 'Partially Eligible'
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200'
                    : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {recommendation.eligibility === 'Eligible' && <FaCheckCircle className="text-green-600 text-3xl mr-4 animate-bounce" />}
                      {recommendation.eligibility === 'Partially Eligible' && <FaExclamationTriangle className="text-yellow-600 text-3xl mr-4 animate-pulse" />}
                      {recommendation.eligibility === 'Not Eligible' && <FaInfoCircle className="text-red-600 text-3xl mr-4" />}
                      <div>
                        <div className="font-bold text-2xl mb-1">
                          {recommendation.eligibility}
                        </div>
                        {recommendation.approvalChance && (
                          <div className="text-sm text-gray-600">
                            Approval Chance: <span className="font-bold text-green-600">{recommendation.approvalChance}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Loan Details */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Loan Details</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <span className="font-semibold text-gray-700">Loan Type</span>
                    <span className="font-bold text-blue-900 flex items-center">
                      {getLoanTypeIcon(formData.loanType)} {recommendation.loanType}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <span className="font-semibold text-gray-700">Monthly EMI</span>
                    <span className="font-bold text-green-900 text-xl">₹{recommendation.monthlyEMI}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <span className="font-semibold text-gray-700">Loan Amount</span>
                    <span className="font-bold text-purple-900 text-xl">₹{parseInt(formData.amount).toLocaleString()}</span>
                  </div>
                  
                  {recommendation.processingTime && (
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
                      <span className="font-semibold text-gray-700">Processing Time</span>
                      <span className="font-bold text-orange-900">{recommendation.processingTime}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Risk Level */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Risk Assessment</h2>
              <div className={`p-6 rounded-2xl border-2 shadow-lg transition-all duration-500 hover:scale-105 ${getRiskColor(recommendation.riskLevel)}`}>
                <div className="flex items-center">
                  <FaShieldAlt className="text-3xl mr-4" />
                  <div>
                    <div className="font-bold text-2xl">Risk Level: {recommendation.riskLevel}</div>
                    <div className="text-sm mt-1">Based on your profile and credit history</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Offers */}
            {recommendation.specialOffers && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FaGift className="text-yellow-600 mr-3" />
                  Special Offers
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {recommendation.specialOffers.map((offer, index) => (
                    <div key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-start">
                        <FaGift className="text-yellow-600 text-xl mr-3 mt-1" />
                        <div>
                          <div className="font-bold text-orange-800 text-lg mb-2">Special Offer {index + 1}</div>
                          <div className="text-orange-700">{offer}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Impact Analysis */}
            {(recommendation.cibilImpact || recommendation.maritalBenefit) && (
              <div className="grid md:grid-cols-2 gap-8">
                {recommendation.cibilImpact && (
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 CIBIL Score Impact</h2>
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-200">
                      <p className="text-indigo-700 leading-relaxed">{recommendation.cibilImpact}</p>
                    </div>
                  </div>
                )}
                {recommendation.maritalBenefit && (
                  <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">💑 Marital Status Benefits</h2>
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-2xl border border-pink-200">
                      <p className="text-pink-700 leading-relaxed">{recommendation.maritalBenefit}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recommended Banks */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <FaUniversity className="text-blue-600 mr-3" />
                Recommended Banks
              </h2>
              <div className="grid gap-4">
                {recommendation.recommendedBanks?.map((bank, index) => (
                  <div key={index} className="flex justify-between items-center p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
                        <FaUniversity className="text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 text-lg">{bank}</div>
                        <div className="text-sm text-gray-600">Recommended based on your profile</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-full font-bold">
                        {recommendation.interestRates?.[index] || 'Contact for rates'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Repayment Options */}
            {recommendation.repaymentOptions && (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">💰 Repayment Options</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {recommendation.repaymentOptions.map((option, index) => (
                    <div key={index} className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center">
                        <FaDollarSign className="text-purple-600 text-xl mr-3" />
                        <div className="font-semibold text-purple-800">{option}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Analysis */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Detailed Analysis</h2>
              <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-6 rounded-2xl border border-gray-200">
                <p className="text-gray-700 leading-relaxed text-lg">{recommendation.explanation}</p>
              </div>
            </div>

            {/* Chatbot Help Section */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-all duration-500">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                  <FaRobot className="text-white text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Need Help?</h2>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                <div className="text-center">
                  <FaRobot className="text-4xl text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-purple-800 mb-2">AI Loan Assistant</h3>
                  <p className="text-purple-700 mb-4">
                    Have questions about your loan recommendation? Our AI assistant is here to help with eligibility, documentation, processes, and more!
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    <span className="bg-white text-purple-700 px-3 py-1 rounded-full text-sm">📄 Documents</span>
                    <span className="bg-white text-purple-700 px-3 py-1 rounded-full text-sm">✅ Eligibility</span>
                    <span className="bg-white text-purple-700 px-3 py-1 rounded-full text-sm">⏰ Timeline</span>
                    <span className="bg-white text-purple-700 px-3 py-1 rounded-full text-sm">💰 EMI Details</span>
                  </div>
                  <p className="text-sm text-purple-600">
                    Click the chat icon in the bottom-right corner to get started!
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-100 to-pink-100 rounded-full mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Getting Recommendations</h2>
            <p className="text-red-600 text-lg mb-6">{recommendation.message}</p>
            <button
              onClick={handleNewSearch}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Integrated Chatbot */}
      <ChatBot formData={formData} recommendation={recommendation} />

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        .shadow-3xl { box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25); }
      `}</style>
    </div>
  );
};

export default Result;
