import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { 
  FaRobot,
  FaPaperPlane,
  FaQuestionCircle,
  FaFileAlt,
  FaClock,
  FaCalculator,
  FaDollarSign,
  FaUniversity,
  FaCopy,
  FaThumbsUp,
  FaThumbsDown
} from "react-icons/fa";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(apiKey);

// Component to format chatbot responses properly
const FormattedMessage = ({ content }) => {
  const formatText = (text) => {
    if (!text) return '';
    
    // Remove markdown headers (###, ##, #)
    let formatted = text.replace(/^#{1,6}\s+/gm, '');
    
    // Convert **bold** to proper formatting
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *italic* to proper formatting
    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert bullet points (- or *) to proper list items
    formatted = formatted.replace(/^[-*]\s+(.+)$/gm, '<li>$1</li>');
    
    // Convert numbered lists
    formatted = formatted.replace(/^\d+\.\s+(.+)$/gm, '<li class="numbered">$1</li>');
    
    // Wrap consecutive list items in ul tags
    formatted = formatted.replace(/(<li.*?<\/li>[\s\n]*)+/g, (match) => {
      if (match.includes('class="numbered"')) {
        return `<ol>${match.replace(/class="numbered"/g, '')}</ol>`;
      }
      return `<ul>${match}</ul>`;
    });
    
    // Convert line breaks to proper paragraphs
    formatted = formatted.replace(/\n\n+/g, '</p><p>');
    formatted = `<p>${formatted}</p>`;
    
    // Clean up empty paragraphs
    formatted = formatted.replace(/<p><\/p>/g, '');
    formatted = formatted.replace(/<p>\s*<\/p>/g, '');
    
    // Convert URLs to clickable links
    formatted = formatted.replace(
      /(https?:\/\/[^\s<>"]{1,})/g, 
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 underline">$1</a>'
    );
    
    return formatted;
  };

  return (
    <div 
      className="formatted-message prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: formatText(content) }}
      style={{
        lineHeight: '1.6',
        fontSize: '14px',
      }}
    />
  );
};

const ChatBot = ({ formData, recommendation }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: `Hello ${formData?.name}! 👋 

I'm your personal loan advisor assistant. I can help you with:

• Questions about your loan recommendation
• Eligibility requirements and criteria  
• Documentation needed for your application
• Processing timeline and next steps
• Interest rate explanations
• EMI calculations and breakdowns



What would you like to know about your loan today?`,
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

  // Enhanced pre-built question templates
  const quickQuestions = [
    {
      icon: <FaFileAlt className="text-green-500" />,
      text: "Documents required",
      query: "What documents do I need for my loan application? Please provide a detailed list."
    },
    {
      icon: <FaQuestionCircle className="text-blue-500" />,
      text: "Eligibility details",
      query: "What are the detailed eligibility criteria for my loan? How do I qualify?"
    },
    {
      icon: <FaClock className="text-orange-500" />,
      text: "Processing timeline",
      query: "How long will my loan processing take? What are the steps involved?"
    },
    {
      icon: <FaCalculator className="text-purple-500" />,
      text: "EMI breakdown",
      query: "Can you explain how my EMI was calculated? Break down the monthly payment details."
    },
    {
      icon: <FaDollarSign className="text-green-600" />,
      text: "Interest rate factors",
      query: "What factors affect my interest rate? How can I get better rates?"
    },
    {
      icon: <FaUniversity className="text-blue-600" />,
      text: "Why these banks?",
      query: "Why were these specific banks recommended for me? What are their advantages?"
    }
  ];

  const handleQuickQuestion = (question) => {
    handleSendMessage(question.query);
  };

  const copyMessage = (content) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
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
        You are a helpful and professional loan advisor assistant. The user has received loan recommendations based on their profile.
        
        User Profile:
        - Name: ${formData?.name}
        - Age: ${formData?.age}
        - Income: ₹${formData?.income}
        - Loan Type: ${formData?.loanType}
        - Amount: ₹${formData?.amount}
        - CIBIL Score: ${formData?.cibilScore}
        - Marital Status: ${formData?.maritalStatus ? 'Married' : 'Single'}
        
        Loan Recommendations:
        - Eligibility: ${recommendation?.eligibility}
        - Monthly EMI: ₹${recommendation?.monthlyEMI}
        - Risk Level: ${recommendation?.riskLevel}
        - Recommended Banks: ${recommendation?.recommendedBanks?.join(', ')}
        - Interest Rates: ${recommendation?.interestRates?.join(', ')}
        - Processing Time: ${recommendation?.processingTime}
        
        Response Guidelines:
        1. Be helpful, professional, and conversational
        2. Use the user's profile data for personalized responses
        3. Focus on loan-related topics (eligibility, documentation, processes, etc.)
        4. Provide accurate information about Indian banking and loan processes
        5. Structure your responses clearly with proper formatting
        6. Use bullet points for lists and clear paragraphs for explanations
        7. Keep responses comprehensive but easy to read
        8. Use simple language without excessive technical jargon
        9. Be encouraging and supportive
        10. If asked about topics outside loan/banking, politely redirect to loan topics

        Format your response clearly:
        - Use bullet points for lists
        - Use numbered steps for processes
        - Break information into clear paragraphs
        - Avoid using # markdown headers
        - Use **bold** for emphasis sparingly
        - Provide practical, actionable advice
      `;

      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
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
        content: `I apologize, but I'm having trouble connecting right now. 

Please try again in a moment, or you can:

• Refresh the page and try again
• Contact our support team directly
• Check your internet connection

I'm here to help as soon as the connection is restored!`,
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
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${isMinimized ? 'w-16 h-16' : 'w-[500px] h-[700px]'}`}>
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
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col h-full">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                  <FaRobot className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">Loan Assistant</h3>
                  <p className="text-blue-100 text-sm">Expert guidance for your loan journey</p>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <span className="text-white font-bold text-lg">−</span>
              </button>
            </div>
          </div>

          {/* Quick Questions */}
          <div className="p-4 border-b border-gray-100 flex-shrink-0">
            <p className="text-sm font-semibold text-gray-700 mb-3">Quick Questions:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.slice(0, 4).map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(question)}
                  className="flex items-center p-3 bg-gray-50 hover:bg-blue-50 rounded-xl text-xs text-gray-700 hover:text-blue-700 transition-colors text-left border border-gray-200 hover:border-blue-300"
                >
                  <span className="mr-2 text-base">{question.icon}</span>
                  <span className="font-medium">{question.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3' 
                    : 'bg-gray-50 border border-gray-200 text-gray-800 px-4 py-3'
                }`}>
                  {message.type === 'bot' ? (
                    <FormattedMessage content={message.content} />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                  
                  <div className="flex items-center justify-between mt-3">
                    <p className={`text-xs ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </p>
                    
                    {message.type === 'bot' && (
                      <div className="flex items-center space-x-2 ml-3">
                        <button
                          onClick={() => copyMessage(message.content)}
                          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                          title="Copy message"
                        >
                          <FaCopy className="text-xs" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-green-600 transition-colors p-1"
                          title="Helpful"
                        >
                          <FaThumbsUp className="text-xs" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-600 transition-colors p-1"
                          title="Not helpful"
                        >
                          <FaThumbsDown className="text-xs" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <FaRobot className="text-blue-600" />
                    <span className="text-sm text-gray-600">Assistant is typing</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-400"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100 flex-shrink-0">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about your loan..."
                  className="w-full p-4 pr-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 resize-none transition-all duration-300 bg-white shadow-sm"
                  rows="2"
                  style={{ minHeight: '52px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isTyping}
                className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaPaperPlane className="text-lg" />
              </button>
            </div>
            
            {/* Additional Quick Questions */}
            <div className="mt-3 flex flex-wrap gap-2">
              {quickQuestions.slice(4).map((question, index) => (
                <button
                  key={index + 4}
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-full hover:bg-blue-100 transition-colors border border-blue-200 font-medium"
                >
                  {question.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .animation-delay-200 { animation-delay: 200ms; }
        .animation-delay-400 { animation-delay: 400ms; }
        
        .formatted-message {
          color: #374151;
        }
        
        .formatted-message p {
          margin-bottom: 12px;
          line-height: 1.6;
        }
        
        .formatted-message p:last-child {
          margin-bottom: 0;
        }
        
        .formatted-message ul, .formatted-message ol {
          margin: 8px 0 12px 0;
          padding-left: 20px;
        }
        
        .formatted-message li {
          margin-bottom: 4px;
          line-height: 1.5;
        }
        
        .formatted-message ul li {
          list-style-type: disc;
        }
        
        .formatted-message ol li {
          list-style-type: decimal;
        }
        
        .formatted-message strong {
          font-weight: 600;
          color: #1f2937;
        }
        
        .formatted-message em {
          font-style: italic;
        }
        
        .formatted-message a {
          word-break: break-word;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
