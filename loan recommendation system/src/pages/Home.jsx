import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaPiggyBank,
  FaInfoCircle,
  FaCalculator,
  FaShieldAlt,
  FaRocket,
  FaChartLine,
  FaUsers,
  FaCheck,
} from "react-icons/fa";

function Home() {
  const features = [
    {
      icon: FaShieldAlt,
      title: "100% Secure",
      description: "Bank-grade security for all your data",
    },
    {
      icon: FaRocket,
      title: "Instant Results",
      description: "Get recommendations in under 30 seconds",
    },
    {
      icon: FaChartLine,
      title: "AI-Powered",
      description: "Advanced algorithms for accurate matching",
    },
    {
      icon: FaUsers,
      title: "Expert Support",
      description: "24/7 assistance from loan specialists",
    },
  ];

  const stats = [
    { value: "10K+", label: "Happy Customers" },
    { value: "₹500Cr+", label: "Loans Processed" },
    { value: "4.9/5", label: "Average Rating" },
    { value: "24/7", label: "Support Available" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-6xl mx-auto">
            {/* Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-12 text-center relative overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
              <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>

              {/* Icon with animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.3,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 200,
                }}
                className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-8 shadow-lg"
              >
                <FaPiggyBank className="text-4xl text-white" />
              </motion.div>

              {/* Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-6"
              >
                Welcome to{" "}
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
                  SmartLoan
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed"
              >
                Your Personalized Loan Recommendation Platform
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto"
              >
                Get smart, AI-powered loan recommendations based on your{" "}
                <span className="font-semibold text-gray-700">
                  income, credit score, financial history
                </span>{" "}
                and preferences
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Link
                    to="/loan-form"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-lg group-hover:from-blue-700 group-hover:to-indigo-700"
                  >
                    <FaRocket className="mr-3 group-hover:animate-bounce" />
                    Get Loan Recommendation
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Link
                    to="/predict-loan"
                    className="inline-flex items-center px-8 py-4 
               bg-gradient-to-r from-red-500 via-red-600 to-red-700 
               text-white font-semibold rounded-2xl shadow-lg
               hover:shadow-2xl hover:from-red-600 hover:via-red-700 hover:to-red-800
               transition-all duration-500 text-lg backdrop-blur-sm"
                  >
                    <FaInfoCircle className="mr-3 text-white group-hover:rotate-12 transition-transform duration-300" />
                    Predict Loan Amount
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  className="group"
                >
                  <Link
                    to="/calculator"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-lg group-hover:from-yellow-500 group-hover:to-orange-600"
                  >
                    <FaCalculator className="mr-3" />
                    EMI Calculator
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 + index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 group"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="mt-20"
            ></motion.div>

            {/* Why Choose Us Section */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.3, duration: 0.8 }}
              className="mt-20 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Why Choose{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SmartLoan
                </span>
                ?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
                Our AI-powered system evaluates your financial profile and
                matches you with the most suit`ab`le loan options. Experience
                reliability, transparency, and personalized advice like never
                before.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {[
                  {
                    title: "Personalized Recommendations",
                    desc: "Tailored loan options based on your unique financial profile",
                  },
                  {
                    title: "Transparent Process",
                    desc: "No hidden fees or surprises - complete transparency throughout",
                  },
                  {
                    title: "Expert Support",
                    desc: "Professional guidance from experienced loan specialists",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.5 + index * 0.2, duration: 0.8 }}
                    className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300"
                  >
                    <div className="inline-flex items-center justify-center w-8 h-8 bg-green-500 rounded-full mb-4">
                      <FaCheck className="text-white text-sm" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default Home;
