import React, { useState } from "react";
import LoanForm from "./components/LoanForm";





function App() {
  const [recommendations, setRecommendations] = useState(null);

  const handleFormSubmit = async (formData) => {
    // Later: call RAG pipeline
    console.log("Form Data Submitted:", formData);

    // Placeholder until we connect RAG
    setRecommendations([
      "Fetching best loan options based on your profile..."
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <LoanForm onSubmit={handleFormSubmit} />

      {recommendations && (
        <div className="max-w-lg mx-auto mt-6 bg-white shadow p-4 rounded-2xl">
          <h3 className="font-bold mb-2">Recommendations</h3>
          <ul className="list-disc pl-5">
            {recommendations.map((rec, i) => (
              <li key={i}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
