from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import pandas as pd

# Load model + scaler + encoder (you must have saved them together in pickle)
with open("xgb_best_model.pkl", "rb") as f:
    model, scaler, feature_columns = pickle.load(f)

app = FastAPI(title="Loan Prediction API")

# CORS settings
origins = ["http://localhost:5173", "http://127.0.0.1:5173","https://loan-rag.vercel.app"]
app.add_middleware(
    CORSMiddleware,
    allow_origins= origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input schema
class LoanRequest(BaseModel):
    age: float
    income: float
    creditScore: float
    maritalStatus: str
    purpose: str

@app.post("/predict")
def predict_loan(data: LoanRequest):
    # Convert input to DataFrame
    df = pd.DataFrame([{
        "Age": data.age,
        "Income_Lakhs": data.income,
        "Credit_Score": data.creditScore,
        "Marital_Status": data.maritalStatus,
        "Purpose": data.purpose
    }])

    # One-hot encode to match training
    df_encoded = pd.get_dummies(df)
    df_encoded = df_encoded.reindex(columns=feature_columns, fill_value=0)

    # Scale numerical features
    df_scaled = scaler.transform(df_encoded)

    # Predict
    prediction = model.predict(df_scaled)[0]
    return {"predictedLoanAmount": round(float(prediction), 2)}
