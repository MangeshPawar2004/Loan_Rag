import { useLocation, useNavigate } from "react-router-dom";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const { formData, recommendation } = location.state || {};

  if (!formData || !recommendation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            No data available. Please fill the form first.
          </h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Loan Recommendation Results
        </h2>

        {/* User Details Card */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Your Application Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p><span className="font-medium">Age:</span> {formData.Age}</p>
            <p><span className="font-medium">Income:</span> ₹{formData.Income}</p>
            <p><span className="font-medium">CIBIL Score:</span> {formData.CIBIL_Score}</p>
            <p><span className="font-medium">Marital Status:</span> {formData.Marital_Status}</p>
            <p><span className="font-medium">Purpose:</span> {formData.Purpose}</p>
            <p><span className="font-medium">Geo Location:</span> {formData.Geo_Location}</p>
            <p><span className="font-medium">Loan Amount:</span> ₹{formData.Loan_Amount}</p>
          </div>
        </div>

        {/* Recommendation Card */}
        <div className="p-6 bg-blue-50 rounded-xl shadow-sm border border-blue-200">
          <h3 className="text-xl font-semibold text-blue-800 mb-4">
            AI Recommendation
          </h3>
          <div className="text-gray-700 whitespace-pre-line leading-relaxed">
            {recommendation}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-200"
          >
            Apply Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default Results;
