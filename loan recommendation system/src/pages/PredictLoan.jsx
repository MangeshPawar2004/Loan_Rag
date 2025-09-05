import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaCalendarAlt, 
  FaDollarSign, 
  FaMapMarkerAlt, 
  FaBuilding, 
  FaFileInvoiceDollar, 
  FaBalanceScale, 
  FaMoneyBillWave,
  FaUserFriends,
  FaHandshake,
  FaBrain,
  FaRocket,
  FaStar,
  FaChartLine
} from 'react-icons/fa';

const PredictLoan = () => {
  const [formData, setFormData] = useState({
    age: '',
    income: '',
    creditScore: '',
    incomeToExpenseRatio: '',
    maritalStatus: 'Single',
    guarantor: 'No',
    purpose: 'Personal',
    dependents: 0,
    ongoingLoans: 0,
    ongoingLoanAmount: 0,
    ongoingLoanEMI: 0,
    fdStatus: 'No',
    fdAmount: 0,
    geoLocation: '',
    employmentYears: '',
    tenureMonths: '',
    interestRate: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? Number(value) : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate required fields
    const requiredFields = ['age', 'income', 'creditScore', 'tenureMonths', 'interestRate', 'employmentYears'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      // Here you would typically send data to your Python backend
      // For now, we'll simulate the prediction with a formula based on your model features
      setTimeout(() => {
        // Simple prediction formula based on common loan factors
        const baseAmount = formData.income * 12; // Annual income
        const creditMultiplier = formData.creditScore / 750; // Credit score factor
        const tenureMultiplier = Math.min(formData.tenureMonths / 60, 1); // Tenure factor
        const employmentMultiplier = Math.min(formData.employmentYears / 10, 1); // Employment stability
        
        let predictedAmount = baseAmount * creditMultiplier * tenureMultiplier * employmentMultiplier * 5;
        
        // Adjust for existing loans
        if (formData.ongoingLoanAmount > 0) {
          predictedAmount *= 0.7; // Reduce by 30% if ongoing loans exist
        }
        
        // Add randomness to make it more realistic
        predictedAmount *= (0.8 + Math.random() * 0.4); // ±20% variation
        
        setPrediction(Math.round(predictedAmount));
        setLoading(false);
      }, 2000);
      
    } catch (err) {
      setError('Failed to predict loan amount. Please try again.');
      setLoading(false);
    }
  };

  const purposeOptions = [
    'Personal', 'Home', 'Car', 'Education', 'Business', 'Medical', 'Travel', 'Wedding'
  ];

  const locationOptions = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6 shadow-2xl"
          >
            <FaBrain className="text-white text-4xl" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 mb-4">
            AI Loan Predictor
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto font-medium">
            Get instant loan amount predictions powered by advanced machine learning algorithms
          </p>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/30 p-10"
        >
          <div className="flex items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-6 shadow-lg">
              <FaChartLine className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800">Loan Prediction Form</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
              <h3 className="text-2xl font-bold text-blue-800 mb-6 flex items-center">
                <FaUser className="mr-3" />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Age *</label>
                  <input
                    name="age"
                    type="number"
                    min="18"
                    max="80"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-3 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Monthly Income (₹) *</label>
                  <input
                    name="income"
                    type="number"
                    min="10000"
                    value={formData.income}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-3 border-gray-300 focus:border-green-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Credit Score *</label>
                  <input
                    name="creditScore"
                    type="number"
                    min="300"
                    max="900"
                    value={formData.creditScore}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-3 border-gray-300 focus:border-purple-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Marital Status</label>
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-3 border-gray-300 focus:border-pink-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Number of Dependents</label>
                  <input
                    name="dependents"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.dependents}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-3 border-gray-300 focus:border-orange-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div className="bg-gradient-to-r mt-6 from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
              <h3 className="text-2xl font-bold text-green-800 mb-3 mt-20 flex items-center">
                <FaMoneyBillWave className="mr-3" />
                Loan Requirements
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Loan Purpose</label>
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-3 border-gray-300 focus:border-green-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium"
                  >
                    {purposeOptions.map(purpose => (
                      <option key={purpose} value={purpose}>{purpose}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Tenure (Months) *</label>
                  <input
                    name="tenureMonths"
                    type="number"
                    min="6"
                    max="360"
                    value={formData.tenureMonths}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-3 border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Expected Interest Rate (%) *</label>
                  <input
                    name="interestRate"
                    type="number"
                    step="0.1"
                    min="5"
                    max="20"
                    value={formData.interestRate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-3 border-gray-300 focus:border-red-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border-2 border-purple-200">
              <h3 className="text-2xl font-bold text-purple-800 mb-6 flex items-center">
                <FaDollarSign className="mr-3" />
                Financial Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Income to Expense Ratio</label>
                  <input
                    name="incomeToExpenseRatio"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10"
                    value={formData.incomeToExpenseRatio}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-3 border-gray-300 focus:border-purple-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium"
                    placeholder="e.g., 2.5"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Employment Years *</label>
                  <input
                    name="employmentYears"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.employmentYears}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-3 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Ongoing Loans</label>
                  <input
                    name="ongoingLoans"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.ongoingLoans}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-3 border-gray-300 focus:border-yellow-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Ongoing Loan Amount (₹)</label>
                  <input
                    name="ongoingLoanAmount"
                    type="number"
                    min="0"
                    value={formData.ongoingLoanAmount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-3 border-gray-300 focus:border-red-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Ongoing Loan EMI (₹)</label>
                  <input
                    name="ongoingLoanEMI"
                    type="number"
                    min="0"
                    value={formData.ongoingLoanEMI}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-3 border-gray-300 focus:border-pink-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border-2 border-orange-200">
              <h3 className="text-2xl font-bold text-orange-800 mb-6 flex items-center">
                <FaMapMarkerAlt className="mr-3" />
                Additional Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Location</label>
                  <select
                    name="geoLocation"
                    value={formData.geoLocation}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-3 border-gray-300 focus:border-orange-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium"
                  >
                    <option value="">Select Location</option>
                    {locationOptions.map(location => (
                      <option key={location} value={location}>{location}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Have Guarantor?</label>
                  <select
                    name="guarantor"
                    value={formData.guarantor}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-3 border-gray-300 focus:border-green-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Fixed Deposit</label>
                  <select
                    name="fdStatus"
                    value={formData.fdStatus}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-3 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>
              </div>

              {formData.fdStatus === 'Yes' && (
                <div className="mt-6">
                  <label className="block text-lg font-bold text-gray-700 mb-3">FD Amount (₹)</label>
                  <input
                    name="fdAmount"
                    type="number"
                    min="0"
                    value={formData.fdAmount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-3 border-gray-300 focus:border-blue-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white font-extrabold py-6 px-8 rounded-2xl hover:from-green-700 hover:via-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-500 shadow-2xl hover:shadow-3xl group relative overflow-hidden text-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              {loading ? (
                <div className="flex items-center justify-center relative z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-3 border-white mr-4"></div>
                  <span className="text-xl">Predicting Loan Amount...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center relative z-10">
                  <FaRocket className="mr-4 group-hover:animate-bounce text-xl" />
                  <span className="text-xl">Predict My Loan Amount</span>
                  <FaStar className="ml-4 group-hover:animate-spin text-xl" />
                </div>
              )}
            </motion.button>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-800 text-center font-bold text-lg"
              >
                {error}
              </motion.div>
            )}

            {/* Prediction Result */}
            {prediction && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 rounded-3xl p-8 text-center shadow-2xl"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mb-6">
                  <FaMoneyBillWave className="text-white text-2xl" />
                </div>
                <h3 className="text-3xl font-extrabold text-green-800 mb-4">Predicted Loan Amount</h3>
                <div className="text-5xl font-extrabold text-green-600 mb-4">
                  ₹{prediction.toLocaleString('en-IN')}
                </div>
                <p className="text-lg text-green-700 font-medium">
                  Based on your financial profile and our AI model analysis
                </p>
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
        .shadow-3xl { box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.35); }
      `}</style>
    </div>
  );
};

export default PredictLoan;
