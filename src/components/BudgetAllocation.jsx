import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const BudgetAllocation = () => {
  const { user } = useAuth()
  const [budgets, setBudgets] = useState([])
  const [formData, setFormData] = useState({
    category: '',
    allocated_amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  })

  useEffect(() => {
    fetchBudgets()
  }, [])

  const fetchBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from('budgets_budgettrack')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBudgets(data || [])
    } catch (error) {
      console.error('Error fetching budgets:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const { error } = await supabase
        .from('budgets_budgettrack')
        .insert([{
          user_id: user.id,
          category: formData.category,
          allocated_amount: parseFloat(formData.allocated_amount),
          month: formData.month,
          year: formData.year
        }])

      if (error) throw error
      
      setFormData({
        category: '',
        allocated_amount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
      })
      
      fetchBudgets()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteBudget = async (id) => {
    try {
      const { error } = await supabase
        .from('budgets_budgettrack')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchBudgets()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <>
      <style jsx>{`
        .futuristic-bg {
          background: linear-gradient(135deg, #0a0e27 0%, #1a1b3a 25%, #2d3561 50%, #1e2951 75%, #0f1419 100%);
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          padding: 20px 0;
        }

        .futuristic-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
          animation: backgroundPulse 8s ease-in-out infinite;
        }

        .animated-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: linear-gradient(45deg, #64b5f6, #42a5f5);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
          opacity: 0.7;
        }

        .particle:nth-child(1) {
          left: 10%;
          animation-delay: 0s;
          animation-duration: 6s;
        }

        .particle:nth-child(2) {
          left: 20%;
          animation-delay: 1s;
          animation-duration: 8s;
        }

        .particle:nth-child(3) {
          left: 30%;
          animation-delay: 2s;
          animation-duration: 7s;
        }

        .particle:nth-child(4) {
          left: 40%;
          animation-delay: 3s;
          animation-duration: 9s;
        }

        .particle:nth-child(5) {
          left: 60%;
          animation-delay: 1.5s;
          animation-duration: 6.5s;
        }

        .particle:nth-child(6) {
          left: 80%;
          animation-delay: 0.5s;
          animation-duration: 8.5s;
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
          margin-bottom: 20px;
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

        .futuristic-title {
          background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 50%, #1e88e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          text-shadow: 0 0 30px rgba(100, 181, 246, 0.5);
          animation: titlePulse 2s ease-in-out infinite alternate;
          margin-bottom: 1.5rem;
        }

        .futuristic-subtitle {
          color: rgba(148, 163, 184, 0.8);
          font-weight: 300;
          margin-bottom: 2rem;
        }

        .futuristic-input {
          background: rgba(30, 41, 59, 0.8) !important;
          border: 1px solid rgba(100, 181, 246, 0.3) !important;
          border-radius: 12px !important;
          color: #e2e8f0 !important;
          padding: 16px 20px !important;
          font-size: 16px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          backdrop-filter: blur(10px);
        }

        .futuristic-input:focus {
          border-color: #64b5f6 !important;
          box-shadow: 
            0 0 0 3px rgba(100, 181, 246, 0.1) !important,
            0 0 20px rgba(100, 181, 246, 0.3) !important;
          background: rgba(30, 41, 59, 0.9) !important;
          transform: translateY(-2px);
          color: #e2e8f0 !important;
        }

        .futuristic-input::placeholder {
          color: rgba(148, 163, 184, 0.6) !important;
        }

        .futuristic-select {
          background: rgba(30, 41, 59, 0.8) !important;
          border: 1px solid rgba(100, 181, 246, 0.3) !important;
          border-radius: 12px !important;
          color: #e2e8f0 !important;
          padding: 16px 20px !important;
          font-size: 16px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          backdrop-filter: blur(10px);
        }

        .futuristic-select:focus {
          border-color: #64b5f6 !important;
          box-shadow: 
            0 0 0 3px rgba(100, 181, 246, 0.1) !important,
            0 0 20px rgba(100, 181, 246, 0.3) !important;
          background: rgba(30, 41, 59, 0.9) !important;
          transform: translateY(-2px);
          color: #e2e8f0 !important;
        }

        .futuristic-select option {
          background: rgba(30, 41, 59, 0.95);
          color: #e2e8f0;
        }

        .futuristic-label {
          color: rgba(148, 163, 184, 0.9);
          font-weight: 500;
          margin-bottom: 8px;
          font-size: 14px;
          letter-spacing: 0.5px;
        }

        .futuristic-btn-primary {
          background: linear-gradient(135deg, #1e88e5 0%, #1976d2 50%, #1565c0 100%) !important;
          border: none !important;
          border-radius: 12px !important;
          padding: 16px 24px !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          color: white !important;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 10px 25px rgba(30, 136, 229, 0.3);
        }

        .futuristic-btn-primary::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .futuristic-btn-primary:hover::before {
          left: 100%;
        }

        .futuristic-btn-primary:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 15px 35px rgba(30, 136, 229, 0.4) !important;
          background: linear-gradient(135deg, #2196f3 0%, #1e88e5 50%, #1976d2 100%) !important;
        }

        .futuristic-btn-danger {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%) !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 8px 16px !important;
          font-weight: 500 !important;
          font-size: 14px !important;
          color: white !important;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        .futuristic-btn-danger:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4) !important;
          background: linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%) !important;
        }

        .futuristic-list-item {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(100, 181, 246, 0.2);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 16px;
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .futuristic-list-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(100, 181, 246, 0.05), transparent);
          transition: left 0.6s;
        }

        .futuristic-list-item:hover::before {
          left: 100%;
        }

        .futuristic-list-item:hover {
          transform: translateY(-4px);
          border-color: rgba(100, 181, 246, 0.4);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3), 0 0 20px rgba(100, 181, 246, 0.1);
        }

        .budget-category {
          color: #64b5f6;
          font-weight: 600;
          font-size: 18px;
          margin-bottom: 8px;
        }

        .budget-amount {
          color: #10b981;
          font-weight: 700;
          font-size: 20px;
          margin-bottom: 8px;
        }

        .budget-date {
          color: rgba(148, 163, 184, 0.7);
          font-size: 14px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: rgba(148, 163, 184, 0.6);
          font-size: 16px;
        }

        .main-title {
          background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 50%, #1e88e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          text-shadow: 0 0 30px rgba(100, 181, 246, 0.5);
          animation: titlePulse 2s ease-in-out infinite alternate;
          text-align: center;
          margin-bottom: 3rem;
          font-size: 2.5rem;
        }

        @keyframes backgroundPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-100px) rotate(180deg); 
            opacity: 0.3;
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

        /* Responsive Design */
        @media (max-width: 768px) {
          .main-title {
            font-size: 2rem;
            margin-bottom: 2rem;
          }
          
          .futuristic-card {
            margin-bottom: 15px;
          }
          
          .futuristic-input,
          .futuristic-select {
            padding: 14px 16px !important;
            font-size: 15px !important;
          }
          
          .futuristic-btn-primary {
            padding: 14px 20px !important;
            font-size: 15px !important;
          }
          
          .futuristic-list-item {
            padding: 16px;
            margin-bottom: 12px;
          }
          
          .budget-category {
            font-size: 16px;
          }
          
          .budget-amount {
            font-size: 18px;
          }
        }

        @media (max-width: 576px) {
          .main-title {
            font-size: 1.8rem;
          }
          
          .futuristic-input,
          .futuristic-select {
            padding: 12px 14px !important;
            font-size: 14px !important;
          }
          
          .futuristic-btn-primary {
            padding: 12px 18px !important;
            font-size: 14px !important;
          }
          
          .futuristic-list-item {
            padding: 14px;
          }
        }
      `}</style>

      <div className="futuristic-bg">
        <div className="animated-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <h1 className="main-title">Budget Allocation</h1>
          
          <div className="row">
            <div className="col-lg-6 col-md-12 mb-4">
              <div className="futuristic-card">
                <div className="card-body p-4">
                  <h5 className="futuristic-title">Tambah Budget</h5>
                  <p className="futuristic-subtitle">Buat alokasi budget baru untuk kategori pengeluaran</p>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label className="futuristic-label">Kategori</label>
                      <input
                        type="text"
                        className="form-control futuristic-input"
                        placeholder="Contoh: Makanan, Transport, Entertainment"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="futuristic-label">Jumlah Budget (Rp)</label>
                      <input
                        type="number"
                        className="form-control futuristic-input"
                        placeholder="Masukkan jumlah budget"
                        value={formData.allocated_amount}
                        onChange={(e) => setFormData({...formData, allocated_amount: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="row">
                      <div className="col-6 mb-4">
                        <label className="futuristic-label">Bulan</label>
                        <select
                          className="form-select futuristic-select"
                          value={formData.month}
                          onChange={(e) => setFormData({...formData, month: parseInt(e.target.value)})}
                        >
                          {Array.from({length: 12}, (_, i) => (
                            <option key={i+1} value={i+1}>
                              {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-6 mb-4">
                        <label className="futuristic-label">Tahun</label>
                        <input
                          type="number"
                          className="form-control futuristic-input"
                          value={formData.year}
                          onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                          required
                        />
                      </div>
                    </div>
                    
                    <button type="submit" className="btn w-100 futuristic-btn-primary">
                      Tambah Budget
                    </button>
                  </form>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6 col-md-12 mb-4">
              <div className="futuristic-card">
                <div className="card-body p-4">
                  <h5 className="futuristic-title">Daftar Budget</h5>
                  <p className="futuristic-subtitle">Kelola dan pantau semua alokasi budget Anda</p>
                  
                  {budgets.length === 0 ? (
                    <div className="empty-state">
                      <div style={{ fontSize: '48px', marginBottom: '20px', opacity: 0.3 }}>💰</div>
                      <p>Belum ada budget yang dibuat</p>
                      <p style={{ fontSize: '14px' }}>Mulai dengan menambah budget pertama Anda</p>
                    </div>
                  ) : (
                    <div>
                      {budgets.map((budget) => (
                        <div key={budget.id} className="futuristic-list-item">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div className="budget-category">{budget.category}</div>
                              <div className="budget-amount">
                                Rp {parseFloat(budget.allocated_amount).toLocaleString('id-ID')}
                              </div>
                              <div className="budget-date">
                                {new Date(0, budget.month - 1).toLocaleString('id-ID', { month: 'long' })} {budget.year}
                              </div>
                            </div>
                            <button
                              className="btn futuristic-btn-danger ms-3"
                              onClick={() => deleteBudget(budget.id)}
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      ))}
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

export default BudgetAllocation