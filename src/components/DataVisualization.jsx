import React, { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const DataVisualization = () => {
  const { user } = useAuth()
  const [chartData, setChartData] = useState({
    monthly: [],
    categories: [],
    budgetProgress: []
  })

  useEffect(() => {
    fetchChartData()
  }, [])

  const fetchChartData = async () => {
    try {
      const [incomeRes, expensesRes, budgetsRes] = await Promise.all([
        supabase.from('income_budgettrack').select('*').eq('user_id', user.id),
        supabase.from('expenses_budgettrack').select('*').eq('user_id', user.id),
        supabase.from('budgets_budgettrack').select('*').eq('user_id', user.id)
      ])

      const monthlyData = processMonthlyData(incomeRes.data, expensesRes.data)
      const categoryData = processCategoryData(expensesRes.data)
      const budgetData = processBudgetData(budgetsRes.data, expensesRes.data)

      setChartData({
        monthly: monthlyData,
        categories: categoryData,
        budgetProgress: budgetData
      })
    } catch (error) {
      console.error('Error fetching chart data:', error)
    }
  }

  const processMonthlyData = (income, expenses) => {
    const monthlyStats = {}
    
    income.forEach(item => {
      const month = new Date(item.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
      if (!monthlyStats[month]) monthlyStats[month] = { month, income: 0, expense: 0 }
      monthlyStats[month].income += parseFloat(item.amount)
    })

    expenses.forEach(item => {
      const month = new Date(item.date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
      if (!monthlyStats[month]) monthlyStats[month] = { month, income: 0, expense: 0 }
      monthlyStats[month].expense += parseFloat(item.amount)
    })

    return Object.values(monthlyStats).slice(-6)
  }

  const processCategoryData = (expenses) => {
    const categoryStats = {}
    
    expenses.forEach(item => {
      const category = item.category
      if (!categoryStats[category]) categoryStats[category] = 0
      categoryStats[category] += parseFloat(item.amount)
    })

    return Object.entries(categoryStats).map(([name, value]) => ({ name, value })).slice(0, 5)
  }

  const processBudgetData = (budgets, expenses) => {
    return budgets.map(budget => {
      const spent = expenses
        .filter(expense => expense.category === budget.category)
        .reduce((sum, expense) => sum + parseFloat(expense.amount), 0)

      return {
        category: budget.category,
        allocated: parseFloat(budget.allocated_amount),
        spent: spent,
        remaining: Math.max(0, parseFloat(budget.allocated_amount) - spent)
      }
    })
  }

  const COLORS = ['#64b5f6', '#42a5f5', '#1e88e5', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57']

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="futuristic-tooltip">
          <p className="tooltip-label">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="tooltip-value" style={{ color: entry.color }}>
              {entry.name}: Rp {entry.value.toLocaleString('id-ID')}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="futuristic-tooltip">
          <p className="tooltip-value">
            {payload[0].name}: Rp {payload[0].value.toLocaleString('id-ID')}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <>
      <style jsx>{`
        .futuristic-dashboard {
          background: linear-gradient(135deg, #0a0e27 0%, #1a1b3a 25%, #2d3561 50%, #1e2951 75%, #0f1419 100%);
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
        }

        .futuristic-dashboard::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
          animation: backgroundPulse 8s ease-in-out infinite;
          pointer-events: none;
          z-index: 1;
        }

        .dashboard-content {
          position: relative;
          z-index: 2;
          padding: 2rem;
        }

        @media (max-width: 768px) {
          .dashboard-content {
            padding: 1rem;
          }
          
          .futuristic-card-body {
            padding: 1.5rem;
          }
          
          .budget-card-body {
            padding: 1rem;
          }
          
          .futuristic-card-title {
            font-size: 1.1rem;
          }
          
          .budget-card-title {
            font-size: 1rem;
          }
          
          .particle {
            display: none;
          }
        }

        @media (max-width: 576px) {
          .dashboard-content {
            padding: 0.5rem;
          }
          
          .futuristic-card {
            margin-bottom: 1rem;
            border-radius: 15px;
          }
          
          .futuristic-card-body {
            padding: 1rem;
          }
          
          .budget-card-body {
            padding: 0.75rem;
          }
          
          .futuristic-card-title {
            font-size: 1rem;
            margin-bottom: 1rem;
          }
          
          .budget-card-title {
            font-size: 0.9rem;
            margin-bottom: 0.75rem;
          }
          
          .budget-info {
            font-size: 0.8rem;
          }
          
          .progress-text {
            font-size: 0.8rem;
            right: 6px;
          }
          
          .futuristic-progress {
            height: 10px;
          }
        }

        .futuristic-card {
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid rgba(100, 181, 246, 0.3);
          border-radius: 20px;
          backdrop-filter: blur(20px);
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(100, 181, 246, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
          animation: cardGlow 3s ease-in-out infinite alternate;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 2rem;
        }

        .futuristic-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(100, 181, 246, 0.1), transparent);
          animation: shimmer 3s infinite;
        }

        .futuristic-card:hover {
          transform: translateY(-5px);
          box-shadow: 
            0 35px 60px -12px rgba(0, 0, 0, 0.9),
            0 0 0 1px rgba(100, 181, 246, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 40px rgba(100, 181, 246, 0.2);
        }

        .futuristic-card-title {
          background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 50%, #1e88e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          text-shadow: 0 0 30px rgba(100, 181, 246, 0.5);
          animation: titlePulse 2s ease-in-out infinite alternate;
          margin-bottom: 1.5rem;
          font-size: 1.25rem;
        }

        .futuristic-card-body {
          padding: 2rem;
          position: relative;
          z-index: 3;
        }

        .budget-card {
          background: rgba(30, 41, 59, 0.8);
          border: 1px solid rgba(100, 181, 246, 0.2);
          border-radius: 15px;
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          position: relative;
        }

        .budget-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #64b5f6, transparent);
          animation: progressShimmer 2s infinite;
        }

        .budget-card:hover {
          transform: translateY(-3px);
          border-color: rgba(100, 181, 246, 0.4);
          box-shadow: 0 15px 35px rgba(100, 181, 246, 0.15);
        }

        .budget-card-body {
          padding: 1.5rem;
        }

        .budget-card-title {
          color: #e2e8f0;
          font-weight: 600;
          font-size: 1.1rem;
          margin-bottom: 1rem;
        }

        .futuristic-progress {
          background: rgba(15, 23, 42, 0.8);
          border-radius: 10px;
          height: 12px;
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .futuristic-progress-bar {
          height: 100%;
          border-radius: 10px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          animation: progressGlow 2s ease-in-out infinite alternate;
        }

        .futuristic-progress-bar.bg-success {
          background: linear-gradient(90deg, #10b981, #059669);
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
        }

        .futuristic-progress-bar.bg-warning {
          background: linear-gradient(90deg, #f59e0b, #d97706);
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.5);
        }

        .futuristic-progress-bar.bg-danger {
          background: linear-gradient(90deg, #ef4444, #dc2626);
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.5);
        }

        .futuristic-progress-bar::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: progressShine 2s infinite;
        }

        .progress-text {
          color: #e2e8f0;
          font-weight: 600;
          font-size: 0.9rem;
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
        }

        .budget-info {
          color: rgba(148, 163, 184, 0.8);
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }

        .no-data-message {
          color: rgba(148, 163, 184, 0.6);
          text-align: center;
          padding: 2rem;
          font-style: italic;
        }

        .futuristic-tooltip {
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(100, 181, 246, 0.3);
          border-radius: 10px;
          padding: 12px 16px;
          backdrop-filter: blur(20px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
        }

        .tooltip-label {
          color: #64b5f6;
          font-weight: 600;
          margin-bottom: 5px;
          font-size: 0.9rem;
        }

        .tooltip-value {
          color: #e2e8f0;
          margin: 2px 0;
          font-size: 0.85rem;
        }

        .chart-container {
          position: relative;
          z-index: 2;
        }

        .animated-particles {
          position: fixed;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 1;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          background: linear-gradient(45deg, #64b5f6, #42a5f5);
          border-radius: 50%;
          animation: float 8s ease-in-out infinite;
          opacity: 0.6;
        }

        .particle:nth-child(1) { left: 10%; animation-delay: 0s; animation-duration: 8s; }
        .particle:nth-child(2) { left: 25%; animation-delay: 1s; animation-duration: 10s; }
        .particle:nth-child(3) { left: 40%; animation-delay: 2s; animation-duration: 9s; }
        .particle:nth-child(4) { left: 60%; animation-delay: 3s; animation-duration: 11s; }
        .particle:nth-child(5) { left: 75%; animation-delay: 1.5s; animation-duration: 8.5s; }
        .particle:nth-child(6) { left: 90%; animation-delay: 0.5s; animation-duration: 10.5s; }

        @keyframes backgroundPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.6;
          }
          50% { 
            transform: translateY(-120px) rotate(180deg); 
            opacity: 0.2;
          }
        }

        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        @keyframes cardGlow {
          0% { 
            box-shadow: 
              0 25px 50px -12px rgba(0, 0, 0, 0.8),
              0 0 0 1px rgba(100, 181, 246, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
          }
          100% { 
            box-shadow: 
              0 25px 50px -12px rgba(0, 0, 0, 0.8),
              0 0 0 1px rgba(100, 181, 246, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              0 0 40px rgba(100, 181, 246, 0.1);
          }
        }

        @keyframes titlePulse {
          0% { text-shadow: 0 0 30px rgba(100, 181, 246, 0.5); }
          100% { text-shadow: 0 0 40px rgba(100, 181, 246, 0.8), 0 0 60px rgba(100, 181, 246, 0.3); }
        }

        @keyframes progressGlow {
          0% { filter: brightness(1); }
          100% { filter: brightness(1.2); }
        }

        @keyframes progressShine {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        @keyframes progressShimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>

      <div className="futuristic-dashboard">
        <div className="animated-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        <div className="dashboard-content">
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="futuristic-card">
                <div className="futuristic-card-body">
                  <h5 className="futuristic-card-title">Pemasukan vs Pengeluaran (6 Bulan Terakhir)</h5>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 250 : 300}>
                      <BarChart data={chartData.monthly}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 181, 246, 0.1)" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#94a3b8"
                          fontSize={12}
                          tickLine={{ stroke: 'rgba(100, 181, 246, 0.3)' }}
                        />
                        <YAxis 
                          stroke="#94a3b8"
                          fontSize={12}
                          tickLine={{ stroke: 'rgba(100, 181, 246, 0.3)' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar 
                          dataKey="income" 
                          fill="url(#incomeGradient)" 
                          name="Pemasukan"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar 
                          dataKey="expense" 
                          fill="url(#expenseGradient)" 
                          name="Pengeluaran"
                          radius={[4, 4, 0, 0]}
                        />
                        <defs>
                          <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#059669" />
                          </linearGradient>
                          <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#dc2626" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 mb-4">
              <div className="futuristic-card">
                <div className="futuristic-card-body">
                  <h5 className="futuristic-card-title">Pengeluaran per Kategori</h5>
                  <div className="chart-container">
                    <ResponsiveContainer width="100%" height={window.innerWidth < 768 ? 250 : 300}>
                      <PieChart>
                        <Pie
                          data={chartData.categories}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={window.innerWidth < 576 ? false : ({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={window.innerWidth < 576 ? 60 : 80}
                          fill="#8884d8"
                          dataKey="value"
                          stroke="rgba(100, 181, 246, 0.2)"
                          strokeWidth={2}
                        >
                          {chartData.categories.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]}
                              style={{
                                filter: 'drop-shadow(0 0 8px rgba(100, 181, 246, 0.3))'
                              }}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomPieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="futuristic-card">
                <div className="futuristic-card-body">
                  <h5 className="futuristic-card-title">Progress Budget</h5>
                  {chartData.budgetProgress.length === 0 ? (
                    <p className="no-data-message">Belum ada data budget</p>
                  ) : (
                    <div className="row">
                      {chartData.budgetProgress.map((budget, index) => {
                        const percentage = (budget.spent / budget.allocated) * 100
                        return (
                          <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-3">
                            <div className="budget-card">
                              <div className="budget-card-body">
                                <h6 className="budget-card-title">{budget.category}</h6>
                                <div className="futuristic-progress mb-2" style={{ position: 'relative' }}>
                                  <div
                                    className={`futuristic-progress-bar ${
                                      percentage > 100 ? 'bg-danger' : 
                                      percentage > 80 ? 'bg-warning' : 'bg-success'
                                    }`}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                  >
                                  </div>
                                  <div className="progress-text">
                                    {percentage.toFixed(1)}%
                                  </div>
                                </div>
                                <div className="budget-info">
                                  Terpakai: Rp {budget.spent.toLocaleString('id-ID')} / Rp {budget.allocated.toLocaleString('id-ID')}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DataVisualization