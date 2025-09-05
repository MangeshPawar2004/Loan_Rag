import React from "react";
import { Brain, BarChart, Shield, Clock, Sparkles, Zap, Users, Award, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const About = () => {
  const stats = [
    { value: "10K+", label: "Happy Customers", icon: Users },
    { value: "₹500Cr+", label: "Loans Processed", icon: BarChart },
    { value: "4.9/5", label: "Customer Rating", icon: Award },
    { value: "24/7", label: "Support Available", icon: Clock }
  ];

  const features = [
    {
      icon: Brain,
      title: "Personalized Loan Recommendations",
      desc: "Tailored suggestions based on income, credit score, and loan type.",
      color: "from-blue-500 to-indigo-600"
    },
    {
      icon: BarChart,
      title: "Comprehensive Comparison",
      desc: "Compare loans, interest rates, and banks transparently.",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: Shield,
      title: "RAG-Enhanced Accuracy",
      desc: "Backed by real regulatory and financial documents.",
      color: "from-purple-500 to-pink-600"
    }
  ];

  const benefits = [
    {
      icon: Sparkles,
      title: "Precision",
      desc: "Always grounded in live financial data.",
    },
    {
      icon: Shield,
      title: "Transparency",
      desc: "No hidden costs or misleading offers.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      desc: "AI chatbot is always available for queries.",
    },
    {
      icon: Brain,
      title: "Continuous Evolution",
      desc: "Regular updates with market and policy changes.",
    }
  ];

  const steps = [
    "Profile Input",
    "RAG Data Retrieval", 
    "LLM Analysis",
    "Results & Guidance",
    "Ongoing Support"
  ];

  const achievements = [
    { title: "Industry Leading", desc: "First AI-powered loan advisor with RAG technology" },
    { title: "Trusted Platform", desc: "Used by thousands of satisfied customers" },
    { title: "Award Winning", desc: "Recognized for innovation in fintech" },
    { title: "Secure & Reliable", desc: "Bank-grade security for all transactions" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto space-y-24">
          
          {/* Enhanced Header */}
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-2xl"
            >
              <Brain className="text-white text-4xl" />
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 mb-6">
              About SmartLoan
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 max-w-4xl mx-auto font-medium">
              The unified platform for{" "}
              <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 px-4 py-2 rounded-xl text-xl font-bold border-2 border-indigo-200">
                Personalized Loans
              </span>
              , accurate comparisons, and next-generation financial guidance.
            </p>
          </motion.header>

  
        

          {/* What is SmartLoan */}
          <motion.section
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-700">
                  What is SmartLoan?
                </h2>
                <p className="text-xl text-gray-800 leading-relaxed font-medium">
                  <strong className="text-2xl text-indigo-800">SmartLoan</strong> is a user-centric loan advisory
                  platform that leverages{" "}
                  <span className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 px-4 py-2 rounded-xl text-lg font-bold border-2 border-blue-200">
                    AI & RAG
                  </span>{" "}
                  to deliver truly personalized recommendations.
                </p>
                <ul className="list-none pl-0 text-gray-700 space-y-4 text-lg">
                  <li className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <span><strong>Instantly analyze</strong> your profile & preferences.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <span>Ensure accuracy using <strong>retrieval-augmented generation (RAG)</strong>.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <span><strong>Compare all available</strong> loan options in one platform.</span>
                  </li>
                </ul>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
                className="relative"
              >
                <img
                  src="/images/1.jpg"
                  alt="SmartLoan System Architecture"
                  className="rounded-3xl shadow-2xl w-full hover:shadow-3xl transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 rounded-3xl"></div>
              </motion.div>
            </div>
          </motion.section>

          {/* What We Offer - Enhanced */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="space-y-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-700 text-center">
              What We Offer
            </h2>
            <div className="grid md:grid-cols-3 gap-12">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + idx * 0.1, duration: 0.6 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-white/80 backdrop-blur-xl border-2 border-white/30 rounded-3xl shadow-xl p-10 text-center hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${feature.color} rounded-full mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-800 mb-6">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* How it Works - Enhanced */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/30 p-12"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-700 text-center mb-16">
              How Does It Work?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + idx * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative"
                >
                  <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg border-2 border-indigo-100 hover:shadow-xl transition-all duration-300 text-center">
                    <span className="block text-4xl font-extrabold text-indigo-700 mb-4">
                      {idx + 1}
                    </span>
                    <p className="text-lg font-bold text-gray-700">{step}</p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Benefits - Enhanced */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-indigo-700 text-center mb-16">
              Why Choose SmartLoan?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8 + idx * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="flex items-center gap-8 p-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border-2 border-white/30 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-gray-800 mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-lg text-gray-600">{benefit.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

   

          {/* Enhanced CTA */}
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.8 }}
            className="text-center bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 rounded-3xl p-16 text-white shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2.6, duration: 0.6, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-8"
            >
              <Zap className="text-yellow-400 text-4xl" />
            </motion.div>

            <p className="text-2xl md:text-3xl font-extrabold mb-4">
              Discover smarter, more transparent loan recommendations.
            </p>
            <p className="text-xl text-blue-100 mb-12">
              Empower your financial journey with{" "}
              <span className="font-extrabold text-yellow-400 text-2xl">SmartLoan</span> today!
            </p>
            
            <motion.a
              href="/"
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-12 py-5 rounded-full font-extrabold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              Get Your Personalized Loan Report
            </motion.a>
          </motion.section>
        </div>
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
        .shadow-3xl { box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25); }
      `}</style>
    </div>
  );
};

export default About;
