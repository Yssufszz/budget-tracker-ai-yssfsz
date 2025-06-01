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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  return (
    <div className="row">
      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Pemasukan vs Pengeluaran (6 Bulan Terakhir)</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                <Bar dataKey="income" fill="#28a745" name="Pemasukan" />
                <Bar dataKey="expense" fill="#dc3545" name="Pengeluaran" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="col-md-6 mb-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Pengeluaran per Kategori</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.categories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Progress Budget</h5>
            {chartData.budgetProgress.length === 0 ? (
              <p className="text-muted">Belum ada data budget</p>
            ) : (
              <div className="row">
                {chartData.budgetProgress.map((budget, index) => {
                  const percentage = (budget.spent / budget.allocated) * 100
                  return (
                    <div key={index} className="col-md-4 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <h6 className="card-title">{budget.category}</h6>
                          <div className="progress mb-2">
                            <div
                              className={`progress-bar ${percentage > 100 ? 'bg-danger' : percentage > 80 ? 'bg-warning' : 'bg-success'}`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            >
                              {percentage.toFixed(1)}%
                            </div>
                          </div>
                          <small className="text-muted">
                            Terpakai: Rp {budget.spent.toLocaleString('id-ID')} / Rp {budget.allocated.toLocaleString('id-ID')}
                          </small>
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
  )
}

export default DataVisualization