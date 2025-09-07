import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bar, Line, Doughnut, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { 
  Calculator, 
  Bell, 
  ShieldCheck, 
  FileCheck2, 
  SlidersHorizontal, 
  TrendingUp, 
  Banknote, 
  CheckCircle2, 
  Info, 
  Award,
  BarChart3,
  Zap,
  Target,
  PieChart,
  Activity,
  Brain
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

// -------------------- Utilities --------------------
const currency = (n) => new Intl.NumberFormat("en-IN", { 
  style: "currency", 
  currency: "INR", 
  maximumFractionDigits: 0 
}).format(Number(n || 0));

function emi({ principal, annualRatePct, months }) {
  const r = (annualRatePct / 100) / 12;
  if (!months || months <= 0) return 0;
  if (r === 0) return principal / months;
  const factor = Math.pow(1 + r, months);
  return (principal * r * factor) / (factor - 1);
}

// -------------------- Enhanced Chart Components --------------------
const BankComparisonChart = ({ offers, loan }) => {
  const labels = offers.map(o => o.lender);
  const data = {
    labels,
    datasets: [
      {
        label: 'Interest Rate (%)',
        data: offers.map(o => o.rate),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderRadius: 12,
        borderWidth: 3,
        hoverBackgroundColor: 'rgba(59, 130, 246, 1)',
        barPercentage: 0.7,
      },
      {
        label: 'Monthly EMI (₹)',
        data: offers.map(o => 
          Math.round(emi({ principal: loan.amount, annualRatePct: o.rate, months: loan.tenureMonths }) / 1000)
        ),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderRadius: 12,
        borderWidth: 3,
        hoverBackgroundColor: 'rgba(16, 185, 129, 1)',
        barPercentage: 0.7,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      title: {
        display: true,
        text: 'Bank Comparison: Interest Rates vs EMI',
        color: '#1f2937',
        font: { size: 20, weight: 'bold' },
        padding: { top: 20, bottom: 30 }
      },
      legend: {
        position: 'top',
        labels: { 
          font: { size: 16, weight: 'bold' }, 
          color: '#4b5563',
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#f9fafb',
        bodyColor: '#f9fafb',
        borderColor: '#374151',
        borderWidth: 2,
        cornerRadius: 12,
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 },
        callbacks: {
          label: (context) => {
            if (context.dataset.label === 'Monthly EMI (₹)') {
              return `Monthly EMI: ₹${(context.parsed.y * 1000).toLocaleString()}`;
            }
            return `Interest Rate: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { 
          color: '#6b7280', 
          font: { size: 14, weight: 'bold' },
        },
        grid: { color: '#e5e7eb', lineWidth: 2 },
        title: {
          display: true,
          text: 'Rate (%) / EMI (₹000s)',
          color: '#6b7280',
          font: { size: 16, weight: 'bold' }
        }
      },
      x: {
        ticks: { 
          color: '#6b7280', 
          font: { size: 14, weight: 'bold' },
          maxRotation: 45
        },
        grid: { display: false }
      }
    }
  };

  return (
    <div className="h-80 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border-2 border-gray-200 p-8">
      <Bar data={data} options={options} />
    </div>
  );
};

const EMITrendChart = ({ loan, offers }) => {
  const tenures = [12, 24, 36, 48, 60, 72];
  const bestRate = offers[0]?.rate || 12;
  
  const data = {
    labels: tenures.map(t => `${t}m`),
    datasets: [
      {
        label: 'Monthly EMI',
        data: tenures.map(t => emi({ principal: loan.amount, annualRatePct: bestRate, months: t })),
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderWidth: 4,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: 'white',
        pointBorderWidth: 4,
        pointRadius: 8,
        pointHoverRadius: 12,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'EMI vs Tenure Analysis',
        color: '#1f2937',
        font: { size: 18, weight: 'bold' }
      },
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 },
        callbacks: {
          label: (context) => `EMI: ${currency(context.parsed.y)}`
        }
      }
    },
    scales: {
      y: {
        ticks: { 
          color: '#6b7280',
          font: { size: 14, weight: 'bold' },
          callback: (value) => currency(value)
        },
        grid: { color: '#e5e7eb', lineWidth: 2 }
      },
      x: {
        ticks: { color: '#6b7280', font: { size: 14, weight: 'bold' } },
        grid: { display: false }
      }
    }
  };

  return (
    <div className="h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl shadow-2xl border-2 border-indigo-200 p-6">
      <Line data={data} options={options} />
    </div>
  );
};

// -------------------- New Additional Charts --------------------
const LoanBreakdownChart = ({ loan, bestOffer }) => {
  const monthlyEmi = emi({ principal: loan.amount, annualRatePct: bestOffer?.rate || 12, months: loan.tenureMonths });
  const totalInterest = (monthlyEmi * loan.tenureMonths) - loan.amount;
  
  const data = {
    labels: ['Principal Amount', 'Total Interest'],
    datasets: [{
      data: [loan.amount, totalInterest],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 3,
      hoverOffset: 10
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Loan Amount Breakdown',
        color: '#1f2937',
        font: { size: 18, weight: 'bold' }
      },
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 14, weight: 'bold' },
          color: '#4b5563',
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 },
        callbacks: {
          label: (context) => `${context.label}: ${currency(context.parsed)}`
        }
      }
    }
  };

  return (
    <div className="h-80 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-2xl border-2 border-green-200 p-8">
      <Doughnut data={data} options={options} />
    </div>
  );
};

const RiskFactorChart = ({ hybrid }) => {
  const data = {
    labels: ['Credit Score', 'Payment Capacity', 'Employment Stability', 'Financial Pattern', 'Engagement Score'],
    datasets: [{
      label: 'Risk Factors',
      data: [
        hybrid.components.creditComp,
        hybrid.components.capacityComp,
        hybrid.components.stabilityComp,
        hybrid.components.statementComp,
        hybrid.components.behaviorComp
      ],
      backgroundColor: 'rgba(139, 92, 246, 0.3)',
      borderColor: 'rgba(139, 92, 246, 1)',
      borderWidth: 3,
      pointBackgroundColor: 'rgba(139, 92, 246, 1)',
      pointBorderColor: 'white',
      pointBorderWidth: 3,
      pointRadius: 6
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Risk Factor Analysis',
        color: '#1f2937',
        font: { size: 18, weight: 'bold' }
      },
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleFont: { size: 16, weight: 'bold' },
        bodyFont: { size: 14 }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 40,
        ticks: {
          font: { size: 12, weight: 'bold' },
          color: '#6b7280'
        },
        grid: { color: '#e5e7eb', lineWidth: 2 },
        pointLabels: {
          font: { size: 12, weight: 'bold' },
          color: '#374151'
        }
      }
    }
  };

  return (
    <div className="h-80 bg-gradient-to-br from-purple-50 to-violet-50 rounded-3xl shadow-2xl border-2 border-purple-200 p-8">
      <Radar data={data} options={options} />
    </div>
  );
};

// -------------------- Mock Data & Functions --------------------
const LENDERS = [
  { id: "axis", name: "Axis Bank", baseRate: 10.5, type: ["PERSONAL","AUTO"], minScore: 650, maxTenure: 72 },
  { id: "hdfc", name: "HDFC Bank", baseRate: 10.99, type: ["PERSONAL","AUTO","HOME"], minScore: 680, maxTenure: 240 },
  { id: "sbi", name: "SBI", baseRate: 9.5, type: ["HOME","AUTO"], minScore: 660, maxTenure: 360 },
  { id: "icici", name: "ICICI", baseRate: 11.25, type: ["PERSONAL"], minScore: 700, maxTenure: 60 },
  { id: "nbfcx", name: "NBFC X", baseRate: 12.99, type: ["PERSONAL","AUTO"], minScore: 640, maxTenure: 84 },
];

function hybridRiskScore(profile, loan, behaviorSignals = {}) {
  const { creditScore = 700, monthlyIncome = 40000, activeEmi = 0, employmentMonths = 12 } = profile;
  const { amount = 100000, tenureMonths = 36 } = loan;

  const creditComp = Math.max(0, Math.min(40, ((creditScore - 500) / 300) * 40));
  const tentativeEmi = emi({ principal: amount, annualRatePct: 12.5, months: tenureMonths });
  const surplus = Math.max(0, monthlyIncome - (activeEmi || 0));
  const capacityRaw = surplus / Math.max(1, tentativeEmi * 2);
  const capacityComp = Math.max(0, Math.min(30, capacityRaw * 30));
  const stabilityComp = Math.max(0, Math.min(15, (employmentMonths / 60) * 15));
  const statementSignal = behaviorSignals.statementRegularity ?? 0.7;
  const statementComp = Math.max(0, Math.min(10, statementSignal * 10));
  const behaviorComp = Math.max(0, Math.min(5, (behaviorSignals.engagementScore || 0) * 5));

  const rawScore = creditComp + capacityComp + stabilityComp + statementComp + behaviorComp;
  const normalized = Math.round(Math.max(1, Math.min(99, rawScore)));

  return {
    score: normalized,
    components: {
      creditComp: Math.round(creditComp),
      capacityComp: Math.round(capacityComp),
      stabilityComp: Math.round(stabilityComp),
      statementComp: Math.round(statementComp),
      behaviorComp: Math.round(behaviorComp),
      tentativeEmi: Math.round(tentativeEmi),
    }
  };
}

function personalizedRates(profile, loan) {
  const { creditScore } = profile;
  const { type, tenureMonths } = loan;
  return LENDERS.filter(l => l.type.includes(type) && tenureMonths <= l.maxTenure).map(l => {
    const spread = (700 - Math.min(760, Math.max(620, creditScore))) / 25;
    const rate = Math.max(7.99, +(l.baseRate + spread).toFixed(2));
    return { lender: l.name, rate, id: l.id };
  }).sort((a,b) => a.rate - b.rate);
}

// -------------------- Enhanced UI Components --------------------
const GlassCard = ({ children, className = "", hover = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className={`bg-white/80 backdrop-blur-xl border-2 border-white/40 rounded-3xl shadow-2xl ${
      hover ? 'hover:shadow-3xl hover:-translate-y-2' : ''
    } transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

const MetricCard = ({ icon: Icon, title, value, subtitle, color = "blue", trend }) => (
  <GlassCard className="p-8">
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-4">
        <div className={`p-4 rounded-2xl bg-gradient-to-r from-${color}-500 to-${color}-600 shadow-lg`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
        <div>
          <p className="text-lg font-bold text-gray-600">{title}</p>
          <p className="text-3xl font-extrabold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm font-medium text-gray-500">{subtitle}</p>}
        </div>
      </div>
      {trend && (
        <div className={`flex items-center text-lg font-bold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          <TrendingUp className={`h-6 w-6 mr-2 ${trend < 0 ? 'rotate-180' : ''}`} />
          {Math.abs(trend)}%
        </div>
      )}
    </div>
  </GlassCard>
);

const Section = ({ icon: Icon, title, subtitle, children, className = "" }) => (
  <GlassCard className={`p-10 ${className}`}>
    <div className="flex items-center space-x-4 mb-8">
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
        <Icon className="h-8 w-8 text-white" />
      </div>
      <div>
        <h2 className="text-3xl font-extrabold text-gray-900">{title}</h2>
        {subtitle && <p className="text-xl font-medium text-gray-600">{subtitle}</p>}
      </div>
    </div>
    {children}
  </GlassCard>
);

export default function Features() {
  const [profile, setProfile] = useState({
    name: "",
    creditScore: 720,
    monthlyIncome: 55000,
    activeEmi: 12000,
    employmentMonths: 24,
    employmentType: "SALARIED",
  });

  const [loan, setLoan] = useState({ 
    type: "PERSONAL", 
    amount: 500000, 
    tenureMonths: 36 
  });

  const [behaviorSignals, setBehaviorSignals] = useState({ 
    statementRegularity: 0.85, 
    engagementScore: 0.7 
  });

  // Derived calculations
  const offers = useMemo(() => personalizedRates(profile, loan), [profile, loan]);
  const bestOffer = offers[0];
  const hybrid = useMemo(() => hybridRiskScore(profile, loan, behaviorSignals), [profile, loan, behaviorSignals]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden ">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Enhanced Hero Header */}
      <div className="max-w-7xl mx-auto space-y-24">

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
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 mt-20 shadow-2xl"
            >
              <BarChart3 className="text-white text-4xl" />
            </motion.div>
            

            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 mb-6">
              SmartLoan<span className="text-yellow-400">+</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-800 max-w-4xl mx-auto font-medium">
              Advanced AI-Powered Loan Recommendation Engine
             
                </p>

                   <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-medium">
              Featuring hybrid risk analysis, explainable AI, adaptive KYC, and real-time market comparison
            </p>
          </motion.header>
      </div>

      

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 relative z-10">
        
        {/* Enhanced Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <MetricCard
            icon={Target}
            title="Risk Score"
            value={`${hybrid.score}/100`}
            subtitle="AI-powered assessment"
            color="green"
            trend={5}
          />
          <MetricCard
            icon={TrendingUp}
            title="Best Rate"
            value={`${bestOffer?.rate || '—'}%`}
            subtitle={bestOffer?.lender || 'No offers'}
            color="blue"
            trend={-2}
          />
          <MetricCard
            icon={Calculator}
            title="Monthly EMI"
            value={currency(emi({ 
              principal: loan.amount, 
              annualRatePct: bestOffer?.rate || 12, 
              months: loan.tenureMonths 
            }))}
            subtitle="Estimated payment"
            color="purple"
          />
          <MetricCard
            icon={Zap}
            title="Eligible Amount"
            value={currency(loan.amount)}
            subtitle="Based on your profile"
            color="indigo"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Enhanced Left Sidebar - Inputs */}
          <div className="lg:col-span-1 space-y-8">
            <Section icon={SlidersHorizontal} title="Your Profile">
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Name</label>
                  <input 
                    className="w-full px-6 py-4 rounded-2xl border-3 border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium" 
                    placeholder="Enter your name" 
                    value={profile.name}
                    onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} 
                  />
                </div>
                
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">
                    Credit Score: <span className="text-indigo-600">{profile.creditScore}</span>
                  </label>
                  <input 
                    type="range" 
                    min="550" 
                    max="850" 
                    value={profile.creditScore}
                    onChange={e => setProfile(p => ({ ...p, creditScore: +e.target.value }))}
                    className="w-full h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Monthly Income</label>
                  <input 
                    type="number" 
                    className="w-full px-6 py-4 rounded-2xl border-3 border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium" 
                    value={profile.monthlyIncome}
                    onChange={e => setProfile(p => ({ ...p, monthlyIncome: +e.target.value }))} 
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Active EMI</label>
                  <input 
                    type="number" 
                    className="w-full px-6 py-4 rounded-2xl border-3 border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium" 
                    value={profile.activeEmi}
                    onChange={e => setProfile(p => ({ ...p, activeEmi: +e.target.value }))} 
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Employment Type</label>
                  <select 
                    className="w-full px-6 py-4 rounded-2xl border-3 border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium" 
                    value={profile.employmentType}
                    onChange={e => setProfile(p => ({ ...p, employmentType: e.target.value }))}
                  >
                    <option value="SALARIED">Salaried</option>
                    <option value="SELF">Self-employed</option>
                    <option value="FREELANCE">Freelancer</option>
                  </select>
                </div>
              </div>
            </Section>

            <Section icon={Banknote} title="Loan Details">
              <div className="space-y-6">
                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">Loan Type</label>
                  <select 
                    className="w-full px-6 py-4 rounded-2xl border-3 border-gray-300 focus:border-indigo-500 focus:outline-none transition-colors bg-white/80 text-lg font-medium" 
                    value={loan.type} 
                    onChange={e => setLoan(l => ({ ...l, type: e.target.value }))}
                  >
                    <option value="PERSONAL">Personal Loan</option>
                    <option value="AUTO">Auto Loan</option>
                    <option value="HOME">Home Loan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">
                    Amount: <span className="text-green-600">{currency(loan.amount)}</span>
                  </label>
                  <input 
                    type="range"
                    min="50000"
                    max="2000000"
                    step="10000"
                    value={loan.amount}
                    onChange={e => setLoan(l => ({ ...l, amount: +e.target.value }))}
                    className="w-full h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-700 mb-3">
                    Tenure: <span className="text-purple-600">{loan.tenureMonths} months</span>
                  </label>
                  <input 
                    type="range"
                    min="12"
                    max="84"
                    step="6"
                    value={loan.tenureMonths}
                    onChange={e => setLoan(l => ({ ...l, tenureMonths: +e.target.value }))}
                    className="w-full h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </Section>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-12">
            
            {/* Enhanced Interactive Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <BankComparisonChart offers={offers} loan={loan} />
              <EMITrendChart loan={loan} offers={offers} />
            </div>

            {/* New Additional Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <LoanBreakdownChart loan={loan} bestOffer={bestOffer} />
              <RiskFactorChart hybrid={hybrid} />
            </div>

            {/* Enhanced Risk Analysis */}
            {/* <Section icon={ShieldCheck} title="AI Risk Analysis" subtitle="Hybrid scoring with explainable components">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-2xl font-extrabold text-gray-900">Score Breakdown</h4>
                  {Object.entries({
                    'Credit Score': hybrid.components.creditComp,
                    'Payment Capacity': hybrid.components.capacityComp,
                    'Employment Stability': hybrid.components.stabilityComp,
                    'Financial Pattern': hybrid.components.statementComp,
                    'Engagement Score': hybrid.components.behaviorComp,
                  }).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-700">{key}</span>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 h-3 bg-gray-300 rounded-full">
                          <div 
                            className="h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${(value / 40) * 100}%` }}
                          />
                        </div>
                        <span className="text-lg font-extrabold text-gray-900 w-10">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-200">
                  <h4 className="text-2xl font-extrabold text-gray-900 mb-6">Risk Assessment</h4>
                  <div className="text-center">
                    <div className={`text-6xl font-extrabold mb-4 ${
                      hybrid.score > 70 ? 'text-green-600' : 
                      hybrid.score > 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {hybrid.score}
                    </div>
                    <div className="text-xl font-bold text-gray-600 mb-4">Overall Risk Score</div>
                    <div className={`mt-6 px-6 py-3 rounded-full text-lg font-extrabold ${
                      hybrid.score > 70 ? 'bg-green-100 text-green-800' :
                      hybrid.score > 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {hybrid.score > 70 ? 'Low Risk' : hybrid.score > 50 ? 'Medium Risk' : 'High Risk'}
                    </div>
                  </div>
                </div>
              </div>
            </Section> */}

            {/* Enhanced Offers Table */}
            <Section icon={TrendingUp} title="Personalized Offers" subtitle="Real-time rate comparison">
              <div className="overflow-hidden rounded-3xl border-2 border-gray-200">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-8 py-6 text-left text-lg font-extrabold text-gray-900">Bank</th>
                      <th className="px-8 py-6 text-left text-lg font-extrabold text-gray-900">Interest Rate</th>
                      <th className="px-8 py-6 text-left text-lg font-extrabold text-gray-900">Monthly EMI</th>
                      <th className="px-8 py-6 text-left text-lg font-extrabold text-gray-900">Total Interest</th>
                      <th className="px-8 py-6 text-left text-lg font-extrabold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {offers.map((offer, index) => {
                      const monthlyEmi = emi({ principal: loan.amount, annualRatePct: offer.rate, months: loan.tenureMonths });
                      const totalInterest = (monthlyEmi * loan.tenureMonths) - loan.amount;
                      
                      return (
                        <tr key={offer.id} className={`${index === 0 ? 'bg-green-50' : 'bg-white'} hover:bg-gray-50 transition-colors`}>
                          <td className="px-8 py-6">
                            <div className="flex items-center">
                              {index === 0 && <Award className="h-6 w-6 text-green-600 mr-3" />}
                              <span className="text-lg font-bold text-gray-900">{offer.lender}</span>
                              {index === 0 && <span className="ml-3 px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full font-bold">Best Rate</span>}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-lg font-extrabold text-gray-900">{offer.rate}%</td>
                          <td className="px-8 py-6 text-lg font-extrabold text-gray-900">{currency(monthlyEmi)}</td>
                          <td className="px-8 py-6 text-lg font-bold text-gray-900">{currency(totalInterest)}</td>
                          <td className="px-8 py-6">
                            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 text-lg font-bold shadow-lg hover:shadow-xl">
                              Apply Now
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Section>
          </div>
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
        .border-3 { border-width: 3px; }
        .shadow-3xl { box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.35); }
      `}</style>
    </div>
  );
}
