import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { generateFinancialSummary, generateSavingsRecommendation } from '../services/cohereService'
import MonitoringForm from './MonitoringForm'
import BudgetAllocation from './BudgetAllocation'
import SavingsGoals from './SavingsGoals'
import DataVisualization from './DataVisualization'
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Calendar,
  BarChart3,
  PlusCircle,
  Target,
  PieChart,
  Bot,
  Sparkles,
  RefreshCw,
  LogOut,
  User,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [financialData, setFinancialData] = useState({
    income: [],
    expenses: [],
    budgets: [],
    savings: []
  })
  const [summaryData, setSummaryData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    thisMonthIncome: 0,
    thisMonthExpenses: 0
  })
  const [aiSummary, setAiSummary] = useState('')
  const [savingsRecommendation, setSavingsRecommendation] = useState('')
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      setLoading(true)
      const [incomeRes, expensesRes, budgetsRes, savingsRes] = await Promise.all([
        supabase.from('income_budgettrack').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('expenses_budgettrack').select('*').eq('user_id', user.id).order('date', { ascending: false }),
        supabase.from('budgets_budgettrack').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('savings_budgettrack').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      ])

      const data = {
        income: incomeRes.data || [],
        expenses: expensesRes.data || [],
        budgets: budgetsRes.data || [],
        savings: savingsRes.data || []
      }

      setFinancialData(data)
      calculateSummary(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  const calculateSummary = (data) => {
    const totalIncome = data.income.reduce((sum, item) => sum + parseFloat(item.amount), 0)
    const totalExpenses = data.expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0)
    const balance = totalIncome - totalExpenses

    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const thisMonthIncome = data.income
      .filter(item => {
        const itemDate = new Date(item.date)
        return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear
      })
      .reduce((sum, item) => sum + parseFloat(item.amount), 0)

    const thisMonthExpenses = data.expenses
      .filter(item => {
        const itemDate = new Date(item.date)
        return itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear
      })
      .reduce((sum, item) => sum + parseFloat(item.amount), 0)

    setSummaryData({
      totalIncome,
      totalExpenses,
      balance,
      thisMonthIncome,
      thisMonthExpenses
    })
  }

  const generateAISummary = async () => {
    try {
      setAiLoading(true)
      const summary = await generateFinancialSummary(financialData)
      setAiSummary(summary)
      
      if (summaryData.thisMonthIncome > 0) {
        const recommendation = await generateSavingsRecommendation(
          summaryData.thisMonthIncome, 
          summaryData.thisMonthExpenses
        )
        setSavingsRecommendation(recommendation)
      }
    } catch (error) {
      console.error('Error generating AI summary:', error)
      setAiSummary('Maaf, tidak dapat menghasilkan ringkasan AI saat ini.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            {/* Summary Cards */}
            <div className="row mb-4">
              <div className="col-md-3 mb-3">
                <div className="futuristic-card futuristic-card-success">
                  <div className="card-body d-flex align-items-center">
                    <div className="futuristic-icon-wrapper me-3">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <h6 className="futuristic-card-title">Total Pemasukan</h6>
                      <h4 className="futuristic-amount">Rp {summaryData.totalIncome.toLocaleString('id-ID')}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="futuristic-card futuristic-card-danger">
                  <div className="card-body d-flex align-items-center">
                    <div className="futuristic-icon-wrapper me-3">
                      <TrendingDown size={24} />
                    </div>
                    <div>
                      <h6 className="futuristic-card-title">Total Pengeluaran</h6>
                      <h4 className="futuristic-amount">Rp {summaryData.totalExpenses.toLocaleString('id-ID')}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className={`futuristic-card ${summaryData.balance >= 0 ? 'futuristic-card-info' : 'futuristic-card-warning'}`}>
                  <div className="card-body d-flex align-items-center">
                    <div className="futuristic-icon-wrapper me-3">
                      <Wallet size={24} />
                    </div>
                    <div>
                      <h6 className="futuristic-card-title">Saldo</h6>
                      <h4 className="futuristic-amount">Rp {summaryData.balance.toLocaleString('id-ID')}</h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 mb-3">
                <div className="futuristic-card futuristic-card-primary">
                  <div className="card-body d-flex align-items-center">
                    <div className="futuristic-icon-wrapper me-3">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <h6 className="futuristic-card-title">Bulan Ini</h6>
                      <h4 className="futuristic-amount">Rp {(summaryData.thisMonthIncome - summaryData.thisMonthExpenses).toLocaleString('id-ID')}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="futuristic-card futuristic-ai-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="futuristic-ai-title d-flex align-items-center">
                        <Bot className="me-2" size={24} />
                        Ringkasan Keuangan AI
                      </h5>
                      <button 
                        className="futuristic-btn-ai"
                        onClick={generateAISummary}
                        disabled={aiLoading}
                      >
                        {aiLoading ? (
                          <RefreshCw className="me-2 spinning" size={16} />
                        ) : (
                          <Sparkles className="me-2" size={16} />
                        )}
                        {aiLoading ? 'Menganalisis...' : 'Buat Ringkasan'}
                      </button>
                    </div>
                    {aiSummary ? (
                      <div className="futuristic-alert futuristic-alert-info">
                        <p className="mb-0">{aiSummary}</p>
                      </div>
                    ) : (
                      <p className="futuristic-text-muted">Klik tombol di atas untuk mendapatkan analisis keuangan dari AI</p>
                    )}
                    
                    {savingsRecommendation && (
                      <div className="futuristic-alert futuristic-alert-success mt-3">
                        <h6 className="d-flex align-items-center">
                          <Target className="me-2" size={16} />
                          Rekomendasi Tabungan:
                        </h6>
                        <p className="mb-0">{savingsRecommendation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="row">
              <div className="col-md-6">
                <div className="futuristic-card">
                  <div className="card-body">
                    <h5 className="futuristic-section-title d-flex align-items-center mb-4">
                      <ArrowUp className="me-2 text-success" size={20} />
                      Pemasukan Terbaru
                    </h5>
                    {financialData.income.length === 0 ? (
                      <p className="futuristic-text-muted text-center py-4">Belum ada data pemasukan</p>
                    ) : (
                      <div className="futuristic-transaction-list">
                        {financialData.income.slice(0, 5).map((income) => (
                          <div key={income.id} className="futuristic-transaction-item">
                            <div>
                              <h6 className="futuristic-transaction-title">{income.source}</h6>
                              <small className="futuristic-transaction-date">{new Date(income.date).toLocaleDateString('id-ID')}</small>
                            </div>
                            <span className="futuristic-amount-success">+Rp {parseFloat(income.amount).toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="futuristic-card">
                  <div className="card-body">
                    <h5 className="futuristic-section-title d-flex align-items-center mb-4">
                      <ArrowDown className="me-2 text-danger" size={20} />
                      Pengeluaran Terbaru
                    </h5>
                    {financialData.expenses.length === 0 ? (
                      <p className="futuristic-text-muted text-center py-4">Belum ada data pengeluaran</p>
                    ) : (
                      <div className="futuristic-transaction-list">
                        {financialData.expenses.slice(0, 5).map((expense) => (
                          <div key={expense.id} className="futuristic-transaction-item">
                            <div>
                              <h6 className="futuristic-transaction-title">{expense.category}</h6>
                              <small className="futuristic-transaction-date">{new Date(expense.date).toLocaleDateString('id-ID')}</small>
                            </div>
                            <span className="futuristic-amount-danger">-Rp {parseFloat(expense.amount).toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'monitoring':
        return <MonitoringForm onDataUpdate={fetchAllData} />
      case 'budget':
        return <BudgetAllocation />
      case 'savings':
        return <SavingsGoals />
      case 'visualization':
        return <DataVisualization />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <>
        <style jsx>{`
          .futuristic-loading {
            background: linear-gradient(135deg, #0a0e27 0%, #1a1b3a 25%, #2d3561 50%, #1e2951 75%, #0f1419 100%);
            position: relative;
            overflow: hidden;
          }
          .futuristic-spinner {
            width: 60px;
            height: 60px;
            border: 4px solid rgba(100, 181, 246, 0.2);
            border-radius: 50%;
            border-top-color: #64b5f6;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div className="d-flex justify-content-center align-items-center vh-100 futuristic-loading">
          <div className="text-center">
            <div className="futuristic-spinner mx-auto mb-3"></div>
            <p style={{ color: '#64b5f6' }}>Loading Dashboard...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style jsx>{`
        .futuristic-dashboard {
          background: linear-gradient(135deg, #0a0e27 0%, #1a1b3a 25%, #2d3561 50%, #1e2951 75%, #0f1419 100%);
          min-height: 100vh;
          color: #e2e8f0;
        }

        .futuristic-navbar {
          background: rgba(15, 23, 42, 0.95) !important;
          border-bottom: 1px solid rgba(100, 181, 246, 0.2);
          backdrop-filter: blur(20px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .futuristic-brand {
          background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 50%, #1e88e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          font-size: 1.5rem;
        }

        .futuristic-nav-tabs {
          border-bottom: 1px solid rgba(100, 181, 246, 0.2);
          background: rgba(15, 23, 42, 0.8);
          border-radius: 12px;
          padding: 8px;
          backdrop-filter: blur(10px);
        }

        .futuristic-nav-link {
          color: rgba(148, 163, 184, 0.8) !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 12px 20px !important;
          margin: 0 4px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          background: transparent !important;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .futuristic-nav-link:hover {
          color: #64b5f6 !important;
          background: rgba(100, 181, 246, 0.1) !important;
          transform: translateY(-2px);
        }

        .futuristic-nav-link.active {
          color: #64b5f6 !important;
          background: linear-gradient(135deg, rgba(100, 181, 246, 0.2) 0%, rgba(30, 136, 229, 0.1) 100%) !important;
          border: 1px solid rgba(100, 181, 246, 0.3) !important;
          box-shadow: 0 0 20px rgba(100, 181, 246, 0.2);
        }

        .futuristic-card {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid rgba(100, 181, 246, 0.2);
          border-radius: 16px;
          backdrop-filter: blur(20px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .futuristic-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(100, 181, 246, 0.05), transparent);
          animation: shimmer 4s infinite;
        }

        .futuristic-card:hover {
          transform: translateY(-5px);
          border-color: rgba(100, 181, 246, 0.4);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(100, 181, 246, 0.1);
        }

        .futuristic-card-success {
          border-color: rgba(34, 197, 94, 0.3);
        }

        .futuristic-card-success:hover {
          border-color: rgba(34, 197, 94, 0.5);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(34, 197, 94, 0.2);
        }

        .futuristic-card-danger {
          border-color: rgba(239, 68, 68, 0.3);
        }

        .futuristic-card-danger:hover {
          border-color: rgba(239, 68, 68, 0.5);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(239, 68, 68, 0.2);
        }

        .futuristic-card-info {
          border-color: rgba(6, 182, 212, 0.3);
        }

        .futuristic-card-info:hover {
          border-color: rgba(6, 182, 212, 0.5);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(6, 182, 212, 0.2);
        }

        .futuristic-card-warning {
          border-color: rgba(245, 158, 11, 0.3);
        }

        .futuristic-card-warning:hover {
          border-color: rgba(245, 158, 11, 0.5);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(245, 158, 11, 0.2);
        }

        .futuristic-card-primary {
          border-color: rgba(100, 181, 246, 0.3);
        }

        .futuristic-card-primary:hover {
          border-color: rgba(100, 181, 246, 0.5);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(100, 181, 246, 0.2);
        }

        .futuristic-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(100, 181, 246, 0.2) 0%, rgba(30, 136, 229, 0.1) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64b5f6;
        }

        .futuristic-card-title {
          color: rgba(148, 163, 184, 0.9);
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .futuristic-amount {
          color: #e2e8f0;
          font-weight: 700;
          font-size: 1.5rem;
          margin-bottom: 0;
        }

        .futuristic-ai-card {
          border: 1px solid rgba(147, 51, 234, 0.3);
          background: rgba(15, 23, 42, 0.9);
        }

        .futuristic-ai-card:hover {
          border-color: rgba(147, 51, 234, 0.5);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(147, 51, 234, 0.2);
        }

        .futuristic-ai-title {
          background: linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7c3aed 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 600;
          margin-bottom: 0;
        }

        .futuristic-btn-ai {
          background: linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7c3aed 100%);
          border: none;
          border-radius: 10px;
          padding: 10px 20px;
          color: white;
          font-weight: 600;
          display: flex;
          align-items: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 20px rgba(147, 51, 234, 0.3);
        }

        .futuristic-btn-ai:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(147, 51, 234, 0.4);
          background: linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #9333ea 100%);
        }

        .futuristic-btn-ai:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .futuristic-alert {
          border-radius: 12px;
          border: none;
          backdrop-filter: blur(10px);
          padding: 16px 20px;
        }

        .futuristic-alert-info {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.3);
          color: #93c5fd;
        }

        .futuristic-alert-success {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #86efac;
        }

        .futuristic-text-muted {
          color: rgba(148, 163, 184, 0.7);
        }

        .futuristic-section-title {
          color: #e2e8f0;
          font-weight: 600;
          font-size: 1.125rem;
        }

        .futuristic-transaction-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .futuristic-transaction-item {
          display: flex;
          justify-content: between;
          align-items: center;
          padding: 16px;
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(100, 181, 246, 0.1);
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .futuristic-transaction-item:hover {
          background: rgba(30, 41, 59, 0.8);
          border-color: rgba(100, 181, 246, 0.2);
          transform: translateX(4px);
        }

        .futuristic-transaction-title {
          color: #e2e8f0;
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 4px;
        }

        .futuristic-transaction-date {
          color: rgba(148, 163, 184, 0.7);
          font-size: 0.8rem;
        }

        .futuristic-amount-success {
          color: #4ade80;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .futuristic-amount-danger {
          color: #f87171;
          font-weight: 700;
          font-size: 0.95rem;
        }

        .futuristic-logout-btn {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          border-radius: 8px;
          padding: 8px 16px;
          transition: all 0.3s ease;
        }

        .futuristic-logout-btn:hover {
          background: rgba(239, 68, 68, 0.3);
          border-color: rgba(239, 68, 68, 0.5);
          color: #fca5a5;
          transform: translateY(-1px);
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="futuristic-dashboard">
        {/* Header */}
        <nav className="navbar navbar-expand-lg futuristic-navbar mb-4">
          <div className="container-fluid">
            <span className="navbar-brand futuristic-brand d-flex align-items-center">
              <Bot className="me-2" size={28} />
              AI Budget Tracker
            </span>
            <div className="navbar-nav ms-auto">
              <span className="navbar-text text-white me-3 d-flex align-items-center">
                <User className="me-2" size={16} />
                Halo, {user?.email}
              </span>
              <button className="btn futuristic-logout-btn d-flex align-items-center" onClick={handleSignOut}>
                <LogOut className="me-2" size={16} />
                Logout
              </button>
            </div>
          </div>
        </nav>

        <div className="container-fluid">
          {/* Navigation Tabs */}
          <ul className="nav nav-tabs mb-4 futuristic-nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link futuristic-nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <BarChart3 size={18} />
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link futuristic-nav-link ${activeTab === 'monitoring' ? 'active' : ''}`}
                onClick={() => setActiveTab('monitoring')}
              >
                <PlusCircle size={18} />
                Input Transaksi
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link futuristic-nav-link ${activeTab === 'budget' ? 'active' : ''}`}
                onClick={() => setActiveTab('budget')}
              >
                <Wallet size={18} />
                Budget
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link futuristic-nav-link ${activeTab === 'savings' ? 'active' : ''}`}
                onClick={() => setActiveTab('savings')}
              >
                <Target size={18} />
                Target Tabungan
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link futuristic-nav-link ${activeTab === 'visualization' ? 'active' : ''}`}
                onClick={() => setActiveTab('visualization')}
              >
                <PieChart size={18} />
                Visualisasi
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard