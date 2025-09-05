import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ For navigation

function LoanForm() {
  const [formData, setFormData] = useState({
    Age: "",
    Income: "",
    Credit_Score: "",
    Income_to_Expense_Ratio: "",
    Marital_Status: "",
    Guarantor: "",
    Purpose: "",
    Dependents: "",
    Ongoing_Loans: "",
    Ongoing_Loan_Amount: "",
    Ongoing_Loan_EMI: "",
    FD: "",
    FD_Amount: "",
    Geo_Location: "",
    Employment_Years: "",
    Loan_Amount: "",
    Tenure_Months: "",
    EMI: "",
    Interest_Rate: "",
    Interest_Amount: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Submitted: ", formData);

    // ✅ Save in localStorage as backup
    localStorage.setItem("loanFormData", JSON.stringify(formData));

    // ✅ Pass state while navigating
    navigate("/results", { state: { formData } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
          Loan Application Form
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Numeric Inputs */}
          {[
            "Age",
            "Income",
            "Credit_Score",
            "Income_to_Expense_Ratio",
            "Dependents",
            "Ongoing_Loans",
            "Ongoing_Loan_Amount",
            "Ongoing_Loan_EMI",
            "FD_Amount",
            "Employment_Years",
            "Loan_Amount",
            "Tenure_Months",
            "EMI",
            "Interest_Rate",
            "Interest_Amount",
          ].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">{field}</label>
              <input
                type="number"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                min="0"
                className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          ))}

          {/* Dropdowns */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Marital Status
            </label>
            <select
              name="Marital_Status"
              value={formData.Marital_Status}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Select --</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Guarantor</label>
            <select
              name="Guarantor"
              value={formData.Guarantor}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Select --</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Purpose</label>
            <select
              name="Purpose"
              value={formData.Purpose}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Select --</option>
              <option value="Home">Home</option>
              <option value="Car">Car</option>
              <option value="Education">Education</option>
              <option value="Business">Business</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">FD</label>
            <select
              name="FD"
              value={formData.FD}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Select --</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Geo Location
            </label>
            <select
              name="Geo_Location"
              value={formData.Geo_Location}
              onChange={handleChange}
              required
              className="mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">-- Select --</option>
              <option value="Urban">Urban</option>
              <option value="Semi-Urban">Semi-Urban</option>
              <option value="Rural">Rural</option>
            </select>
          </div>

          {/* Submit Button full width */}
          <div className="md:col-span-2 text-center mt-6">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-200"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoanForm;