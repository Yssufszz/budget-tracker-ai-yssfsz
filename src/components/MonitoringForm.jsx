import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

const MonitoringForm = ({ onDataUpdate }) => {
  const { user } = useAuth()
  const [activeForm, setActiveForm] = useState('income')
  const [formData, setFormData] = useState({
    amount: '',
    source: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  })

  // Kategori untuk pengeluaran
  const expenseCategories = [
    'Makanan & Minuman',
    'Transportasi',
    'Belanja',
    'Hiburan',
    'Kesehatan',
    'Pendidikan',
    'Utilitas (Listrik, Air, Gas)',
    'Internet & Komunikasi',
    'Asuransi',
    'Investasi',
    'Hutang & Cicilan',
    'Donasi & Zakat',
    'Perawatan Diri',
    'Rumah Tangga',
    'Olahraga & Fitness',
    'Pajak',
    'Lainnya'
  ]

  // Sumber untuk pemasukan
  const incomeSources = [
    'Gaji',
    'Bonus',
    'Freelance',
    'Bisnis',
    'Investasi',
    'Dividen',
    'Sewa',
    'Penjualan',
    'Hadiah',
    'Refund',
    'Cashback',
    'THR',
    'Komisi',
    'Royalti',
    'Lainnya'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const table = activeForm === 'income' ? 'income_budgettrack' : 'expenses_budgettrack'
      const data = {
        user_id: user.id,
        amount: parseFloat(formData.amount),
        [activeForm === 'income' ? 'source' : 'category']: activeForm === 'income' ? formData.source : formData.category,
        date: formData.date,
        description: formData.description
      }

      const { error } = await supabase.from(table).insert([data])
      
      if (error) throw error
      
      setFormData({
        amount: '',
        source: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      })
      
      onDataUpdate()
      
      // Show success message
      const alert = document.createElement('div')
      alert.className = 'alert alert-success alert-dismissible fade show position-fixed'
      alert.style.top = '20px'
      alert.style.right = '20px'
      alert.style.zIndex = '9999'
      alert.innerHTML = `
        <strong>Berhasil!</strong> ${activeForm === 'income' ? 'Pemasukan' : 'Pengeluaran'} berhasil ditambahkan.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `
      document.body.appendChild(alert)
      
      // Auto remove alert after 3 seconds
      setTimeout(() => {
        if (alert.parentNode) {
          alert.parentNode.removeChild(alert)
        }
      }, 3000)
      
    } catch (error) {
      console.error('Error:', error)
      
      // Show error message
      const alert = document.createElement('div')
      alert.className = 'alert alert-danger alert-dismissible fade show position-fixed'
      alert.style.top = '20px'
      alert.style.right = '20px'
      alert.style.zIndex = '9999'
      alert.innerHTML = `
        <strong>Error!</strong> Gagal menambahkan data. Silakan coba lagi.
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `
      document.body.appendChild(alert)
      
      setTimeout(() => {
        if (alert.parentNode) {
          alert.parentNode.removeChild(alert)
        }
      }, 3000)
    }
  }

  const handleCategoryChange = (e) => {
    const value = e.target.value
    if (activeForm === 'income') {
      setFormData({...formData, source: value})
    } else {
      setFormData({...formData, category: value})
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
          padding: 2rem 0;
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

        .futuristic-title {
          background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 50%, #1e88e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
          text-shadow: 0 0 30px rgba(100, 181, 246, 0.5);
          animation: titlePulse 2s ease-in-out infinite alternate;
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
          background: rgba(30, 41, 59, 0.95) !important;
          color: #e2e8f0 !important;
        }

        .futuristic-btn-income {
          background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%) !important;
          border: none !important;
          border-radius: 12px !important;
          padding: 16px 24px !important;
          font-weight: 600 !important;
          color: white !important;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        }

        .futuristic-btn-income:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4) !important;
          background: linear-gradient(135deg, #34d399 0%, #10b981 50%, #059669 100%) !important;
        }

        .futuristic-btn-expense {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%) !important;
          border: none !important;
          border-radius: 12px !important;
          padding: 16px 24px !important;
          font-weight: 600 !important;
          color: white !important;
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
        }

        .futuristic-btn-expense:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 15px 35px rgba(239, 68, 68, 0.4) !important;
          background: linear-gradient(135deg, #f87171 0%, #ef4444 50%, #dc2626 100%) !important;
        }

        .futuristic-btn-outline-income {
          background: rgba(30, 41, 59, 0.8) !important;
          border: 1px solid rgba(16, 185, 129, 0.3) !important;
          border-radius: 12px !important;
          padding: 16px 24px !important;
          color: #10b981 !important;
          font-weight: 600 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          backdrop-filter: blur(10px);
        }

        .futuristic-btn-outline-income:hover {
          background: rgba(16, 185, 129, 0.1) !important;
          border-color: #10b981 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.2) !important;
          color: #10b981 !important;
        }

        .futuristic-btn-outline-expense {
          background: rgba(30, 41, 59, 0.8) !important;
          border: 1px solid rgba(239, 68, 68, 0.3) !important;
          border-radius: 12px !important;
          padding: 16px 24px !important;
          color: #ef4444 !important;
          font-weight: 600 !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          backdrop-filter: blur(10px);
        }

        .futuristic-btn-outline-expense:hover {
          background: rgba(239, 68, 68, 0.1) !important;
          border-color: #ef4444 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 25px rgba(239, 68, 68, 0.2) !important;
          color: #ef4444 !important;
        }

        .futuristic-alert-success {
          background: rgba(16, 185, 129, 0.1) !important;
          border: 1px solid rgba(16, 185, 129, 0.3) !important;
          border-radius: 12px !important;
          color: #a7f3d0 !important;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .futuristic-alert-success::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.1), transparent);
          animation: shimmer 2s infinite;
        }

        .futuristic-alert-danger {
          background: rgba(239, 68, 68, 0.1) !important;
          border: 1px solid rgba(239, 68, 68, 0.3) !important;
          border-radius: 12px !important;
          color: #fca5a5 !important;
          backdrop-filter: blur(10px);
        }

        .futuristic-label {
          color: rgba(148, 163, 184, 0.9) !important;
          font-weight: 600 !important;
          margin-bottom: 0.75rem !important;
          display: flex !important;
          align-items: center !important;
          font-size: 14px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
        }

        .futuristic-icon {
          color: #64b5f6;
          margin-right: 8px;
          font-size: 16px;
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

        @media (max-width: 768px) {
          .futuristic-bg {
            padding: 1rem 0;
          }
          
          .futuristic-card {
            margin: 0 1rem;
            border-radius: 16px;
          }
          
          .futuristic-input, .futuristic-select {
            padding: 14px 16px !important;
            font-size: 14px !important;
          }
          
          .futuristic-btn-income, .futuristic-btn-expense,
          .futuristic-btn-outline-income, .futuristic-btn-outline-expense {
            padding: 14px 20px !important;
            font-size: 14px !important;
          }
        }
      `}</style>



        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <div className="futuristic-card">
                <div className="card-body p-4 p-md-5">
                  <h5 className="futuristic-title mb-4 text-center">
                    <i className="bi bi-plus-square futuristic-icon"></i>
                    Tambah Transaksi Keuangan
                  </h5>
                  
                  <div className="btn-group mb-4 w-100">
                    <button
                      className={activeForm === 'income' ? 'btn futuristic-btn-income' : 'btn futuristic-btn-outline-income'}
                      onClick={() => setActiveForm('income')}
                    >
                      <i className="bi bi-arrow-up-circle me-1"></i>
                      Pemasukan
                    </button>
                    <button
                      className={activeForm === 'expense' ? 'btn futuristic-btn-expense' : 'btn futuristic-btn-outline-expense'}
                      onClick={() => setActiveForm('expense')}
                    >
                      <i className="bi bi-arrow-down-circle me-1"></i>
                      Pengeluaran
                    </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label className="futuristic-label">
                          <i className="bi bi-currency-dollar futuristic-icon"></i>
                          Jumlah (Rp)
                        </label>
                        <input
                          type="number"
                          className="form-control futuristic-input"
                          placeholder="0"
                          value={formData.amount}
                          onChange={(e) => setFormData({...formData, amount: e.target.value})}
                          min="0"
                          step="1000"
                          required
                        />
                      </div>
                      
                      <div className="col-md-6 mb-4">
                        <label className="futuristic-label">
                          <i className={`bi ${activeForm === 'income' ? 'bi-bank' : 'bi-tags'} futuristic-icon`}></i>
                          {activeForm === 'income' ? 'Sumber Pemasukan' : 'Kategori Pengeluaran'}
                        </label>
                        <select
                          className="form-select futuristic-select"
                          value={activeForm === 'income' ? formData.source : formData.category}
                          onChange={handleCategoryChange}
                          required
                        >
                          <option value="">
                            Pilih {activeForm === 'income' ? 'sumber' : 'kategori'}...
                          </option>
                          {(activeForm === 'income' ? incomeSources : expenseCategories).map((item, index) => (
                            <option key={index} value={item}>
                              {item}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6 mb-4">
                        <label className="futuristic-label">
                          <i className="bi bi-calendar futuristic-icon"></i>
                          Tanggal
                        </label>
                        <input
                          type="date"
                          className="form-control futuristic-input"
                          value={formData.date}
                          onChange={(e) => setFormData({...formData, date: e.target.value})}
                          max={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      
                      <div className="col-md-6 mb-4">
                        <label className="futuristic-label">
                          <i className="bi bi-chat-text futuristic-icon"></i>
                          Deskripsi (Opsional)
                        </label>
                        <input
                          type="text"
                          className="form-control futuristic-input"
                          placeholder="Catatan tambahan..."
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          maxLength="100"
                        />
                      </div>
                    </div>

                    {/* Preview Section */}
                    {formData.amount && (activeForm === 'income' ? formData.source : formData.category) && (
                      <div className={`alert mb-4 ${activeForm === 'income' ? 'futuristic-alert-success' : 'futuristic-alert-danger'}`}>
                        <h6 className="alert-heading" style={{ color: 'inherit', fontWeight: '600' }}>Preview Transaksi:</h6>
                        <p className="mb-2" style={{ fontSize: '1.1rem', fontWeight: '600' }}>
                          <strong>{activeForm === 'income' ? '+' : '-'}Rp {parseFloat(formData.amount || 0).toLocaleString('id-ID')}</strong> - 
                          {activeForm === 'income' ? formData.source : formData.category}
                          {formData.description && ` (${formData.description})`}
                        </p>
                        <small style={{ color: 'rgba(148, 163, 184, 0.8)' }}>
                          Tanggal: {new Date(formData.date).toLocaleDateString('id-ID', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </small>
                      </div>
                    )}
                    
                    <div className="d-grid gap-2">
                      <button 
                        type="submit" 
                        className={`btn ${activeForm === 'income' ? 'futuristic-btn-income' : 'futuristic-btn-expense'}`}
                        style={{ padding: '18px 24px', fontSize: '16px' }}
                      >
                        <i className={`bi ${activeForm === 'income' ? 'bi-plus-circle' : 'bi-dash-circle'} me-2`}></i>
                        Tambah {activeForm === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="futuristic-card">
                <div className="card-body p-4 p-md-5">
                  <h6 className="futuristic-title" style={{ fontSize: '1.2rem', marginBottom: '1.5rem' }}>
                    <i className="bi bi-lightbulb futuristic-icon"></i>
                    Tips Pencatatan Keuangan
                  </h6>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div style={{ color: 'rgba(148, 163, 184, 0.9)' }}>
                        <div className="mb-2" style={{ display: 'flex', alignItems: 'center' }}>
                          <i className="bi bi-check-circle me-2" style={{ color: '#10b981' }}></i>
                          Catat setiap transaksi secara real-time
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <i className="bi bi-check-circle me-2" style={{ color: '#10b981' }}></i>
                          Pilih kategori yang sesuai untuk analisis yang akurat
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div style={{ color: 'rgba(148, 163, 184, 0.9)' }}>
                        <div className="mb-2" style={{ display: 'flex', alignItems: 'center' }}>
                          <i className="bi bi-check-circle me-2" style={{ color: '#10b981' }}></i>
                          Tambahkan deskripsi untuk referensi di masa depan
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <i className="bi bi-check-circle me-2" style={{ color: '#10b981' }}></i>
                          Periksa kembali jumlah sebelum menyimpan
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default MonitoringForm