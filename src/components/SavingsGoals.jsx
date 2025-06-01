import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const SavingsGoals = () => {
  const { user } = useAuth()
  const [savings, setSavings] = useState([])
  const [formData, setFormData] = useState({
    goal_name: '',
    target_amount: '',
    current_amount: '',
    target_date: ''
  })

  useEffect(() => {
    fetchSavings()
  }, [])

  const fetchSavings = async () => {
    try {
      const { data, error } = await supabase
        .from('savings_budgettrack')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSavings(data || [])
    } catch (error) {
      console.error('Error fetching savings:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const { error } = await supabase
        .from('savings_budgettrack')
        .insert([{
          user_id: user.id,
          goal_name: formData.goal_name,
          target_amount: parseFloat(formData.target_amount),
          current_amount: parseFloat(formData.current_amount) || 0,
          target_date: formData.target_date || null
        }])

      if (error) throw error
      
      setFormData({
        goal_name: '',
        target_amount: '',
        current_amount: '',
        target_date: ''
      })
      
      fetchSavings()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const updateSavings = async (id, newAmount) => {
    try {
      const { error } = await supabase
        .from('savings_budgettrack')
        .update({ current_amount: parseFloat(newAmount) })
        .eq('id', id)

      if (error) throw error
      fetchSavings()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteSavings = async (id) => {
    try {
      const { error } = await supabase
        .from('savings_budgettrack')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchSavings()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getProgress = (current, target) => {
    return Math.min((current / target) * 100, 100)
  }

  return (
    <>
      <style jsx>{`
        .futuristic-bg {
          background: linear-gradient(135deg, #0a0e27 0%, #1a1b3a 25%, #2d3561 50%, #1e2951 75%, #0f1419 100%);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
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
          z-index: 1;
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

        .content-wrapper {
          position: relative;
          z-index: 10;
        }

        .futuristic-card {
          background: rgba(15, 23, 42, 0.9) !important;
          border: 1px solid rgba(100, 181, 246, 0.3) !important;
          border-radius: 20px !important;
          backdrop-filter: blur(20px);
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(100, 181, 246, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
          animation: cardGlow 3s ease-in-out infinite alternate;
          margin-bottom: 30px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .futuristic-card:hover {
          transform: translateY(-5px);
          box-shadow: 
            0 35px 60px -12px rgba(0, 0, 0, 0.9),
            0 0 0 1px rgba(100, 181, 246, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            0 0 40px rgba(100, 181, 246, 0.2);
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
          font-weight: 700 !important;
          text-shadow: 0 0 30px rgba(100, 181, 246, 0.5);
          animation: titlePulse 2s ease-in-out infinite alternate;
          margin-bottom: 1.5rem !important;
        }

        .futuristic-subtitle {
          color: rgba(148, 163, 184, 0.8) !important;
          font-weight: 300;
          margin-bottom: 0 !important;
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

        .futuristic-input-sm {
          padding: 8px 12px !important;
          font-size: 14px !important;
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
          color: white !important;
        }

        .futuristic-btn-danger {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%) !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 8px 16px !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          color: white !important;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.3);
        }

        .futuristic-btn-danger:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 12px 25px rgba(239, 68, 68, 0.4) !important;
          background: linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%) !important;
          color: white !important;
        }

        .futuristic-label {
          color: rgba(148, 163, 184, 0.9) !important;
          font-weight: 500 !important;
          margin-bottom: 8px !important;
          font-size: 14px !important;
        }

        .futuristic-progress {
          background: rgba(30, 41, 59, 0.8) !important;
          border-radius: 10px !important;
          height: 12px !important;
          overflow: hidden;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .futuristic-progress-bar {
          background: linear-gradient(90deg, #10b981 0%, #059669 50%, #047857 100%) !important;
          border-radius: 10px !important;
          position: relative;
          overflow: hidden;
          animation: progressPulse 2s ease-in-out infinite alternate;
        }

        .futuristic-progress-bar::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: progressShimmer 2s infinite;
        }

        .savings-goal-item {
          background: rgba(15, 23, 42, 0.95) !important;
          border: 1px solid rgba(100, 181, 246, 0.2) !important;
          border-radius: 16px !important;
          backdrop-filter: blur(15px);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 20px !important;
          animation: slideInUp 0.6s ease-out;
        }

        .savings-goal-item:hover {
          transform: translateY(-3px);
          border-color: rgba(100, 181, 246, 0.4);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
        }

        .goal-title {
          color: #e2e8f0 !important;
          font-weight: 600 !important;
          margin-bottom: 0 !important;
        }

        .goal-amount {
          color: rgba(148, 163, 184, 0.9) !important;
          font-size: 14px !important;
          margin-bottom: 0 !important;
        }

        .goal-date {
          color: rgba(100, 181, 246, 0.8) !important;
          font-size: 12px !important;
        }

        .progress-text {
          color: white !important;
          font-weight: 600 !important;
          font-size: 11px !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
        }

        .empty-state {
          color: rgba(148, 163, 184, 0.6) !important;
          text-align: center;
          padding: 40px 20px !important;
          font-style: italic;
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

        @keyframes progressPulse {
          0% { box-shadow: 0 0 10px rgba(16, 185, 129, 0.3); }
          100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.6); }
        }

        @keyframes progressShimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Mobile Responsiveness */
        @media (max-width: 768px) {
          .futuristic-bg {
            padding: 15px 0;
          }
          
          .futuristic-card {
            margin-bottom: 20px;
          }
          
          .futuristic-input {
            font-size: 14px !important;
            padding: 12px 16px !important;
          }
          
          .futuristic-btn-primary {
            padding: 12px 20px !important;
            font-size: 14px !important;
          }
          
          .futuristic-title {
            font-size: 1.5rem !important;
          }
        }

        @media (max-width: 576px) {
          .futuristic-input {
            font-size: 13px !important;
            padding: 10px 14px !important;
          }
          
          .futuristic-btn-primary {
            padding: 10px 18px !important;
            font-size: 13px !important;
          }
          
          .savings-goal-item {
            margin-bottom: 15px !important;
          }
        }
      `}</style>



        <div className="container content-wrapper">
          <div className="row">
            <div className="col-lg-6 col-md-6 mb-4">
              <div className="card futuristic-card">
                <div className="card-body p-4">
                  <h5 className="futuristic-title">Tambah Target Tabungan</h5>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label futuristic-label">Nama Target</label>
                      <input
                        type="text"
                        className="form-control futuristic-input"
                        placeholder="Contoh: Liburan ke Bali"
                        value={formData.goal_name}
                        onChange={(e) => setFormData({...formData, goal_name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label futuristic-label">Target Jumlah (Rp)</label>
                      <input
                        type="number"
                        className="form-control futuristic-input"
                        placeholder="5000000"
                        value={formData.target_amount}
                        onChange={(e) => setFormData({...formData, target_amount: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label futuristic-label">Jumlah Saat Ini (Rp)</label>
                      <input
                        type="number"
                        className="form-control futuristic-input"
                        placeholder="0"
                        value={formData.current_amount}
                        onChange={(e) => setFormData({...formData, current_amount: e.target.value})}
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label className="form-label futuristic-label">Target Tanggal</label>
                      <input
                        type="date"
                        className="form-control futuristic-input"
                        value={formData.target_date}
                        onChange={(e) => setFormData({...formData, target_date: e.target.value})}
                      />
                    </div>
                    
                    <button type="submit" className="btn futuristic-btn-primary w-100">
                      🎯 Tambah Target
                    </button>
                  </form>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6 col-md-6 mb-4">
              <div className="card futuristic-card">
                <div className="card-body p-4">
                  <h5 className="futuristic-title">Target Tabungan Anda</h5>
                  {savings.length === 0 ? (
                    <div className="empty-state">
                      <div style={{fontSize: '3rem', marginBottom: '1rem'}}>💰</div>
                      <p>Belum ada target tabungan</p>
                      <small>Mulai dengan membuat target pertama Anda!</small>
                    </div>
                  ) : (
                    <div className="savings-goals-container">
                      {savings.map((saving, index) => {
                        const progress = getProgress(saving.current_amount, saving.target_amount)
                        return (
                          <div key={saving.id} className="card savings-goal-item" style={{animationDelay: `${index * 0.1}s`}}>
                            <div className="card-body p-3">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <h6 className="goal-title">{saving.goal_name}</h6>
                                <button
                                  className="btn futuristic-btn-danger btn-sm"
                                  onClick={() => deleteSavings(saving.id)}
                                >
                                  🗑️
                                </button>
                              </div>
                              
                              <div className="progress futuristic-progress mb-3">
                                <div
                                  className="progress-bar futuristic-progress-bar"
                                  style={{ width: `${progress}%` }}
                                >
                                  <span className="progress-text">{progress.toFixed(1)}%</span>
                                </div>
                              </div>
                              
                              <div className="row g-2">
                                <div className="col-6">
                                  <label className="form-label futuristic-label mb-1">Saat ini:</label>
                                  <input
                                    type="number"
                                    className="form-control futuristic-input futuristic-input-sm"
                                    value={saving.current_amount}
                                    onChange={(e) => updateSavings(saving.id, e.target.value)}
                                  />
                                </div>
                                <div className="col-6">
                                  <label className="form-label futuristic-label mb-1">Target:</label>
                                  <div className="goal-amount" style={{padding: '8px 12px', marginTop: '4px'}}>
                                    Rp {parseFloat(saving.target_amount).toLocaleString('id-ID')}
                                  </div>
                                </div>
                              </div>
                              
                              {saving.target_date && (
                                <div className="mt-2">
                                  <small className="goal-date">📅 Target: {new Date(saving.target_date).toLocaleDateString('id-ID')}</small>
                                </div>
                              )}
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
    </>
  )
}

export default SavingsGoals