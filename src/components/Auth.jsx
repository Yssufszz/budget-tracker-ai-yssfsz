import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = isLogin 
      ? await signInWithEmail(email, password)
      : await signUpWithEmail(email, password, name)

    if (error) {
      setError(error.message)
    } else if (!isLogin) {
      // Show success message for signup
      setError('')
      // Optionally show success message or reset form
    }
    setLoading(false)
  }

  const handleGoogleAuth = async () => {
    setError('')
    const { error } = await signInWithGoogle()
    if (error) {
      setError(error.message)
    }
  }

  return (
    <>
      <style jsx>{`
        .futuristic-bg {
          background: linear-gradient(135deg, #0a0e27 0%, #1a1b3a 25%, #2d3561 50%, #1e2951 75%, #0f1419 100%);
          position: relative;
          overflow: hidden;
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

        .futuristic-subtitle {
          color: rgba(148, 163, 184, 0.8);
          font-weight: 300;
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
        }

        .futuristic-input::placeholder {
          color: rgba(148, 163, 184, 0.6) !important;
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

        .futuristic-btn-secondary {
          background: rgba(30, 41, 59, 0.8) !important;
          border: 1px solid rgba(100, 181, 246, 0.3) !important;
          border-radius: 12px !important;
          padding: 16px 24px !important;
          color: #64b5f6 !important;
          font-weight: 600 !important;
          font-size: 16px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          backdrop-filter: blur(10px);
        }

        .futuristic-btn-secondary:hover {
          background: rgba(100, 181, 246, 0.1) !important;
          border-color: #64b5f6 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 25px rgba(100, 181, 246, 0.2) !important;
          color: #64b5f6 !important;
        }

        .futuristic-btn-link {
          color: rgba(100, 181, 246, 0.8) !important;
          text-decoration: none !important;
          font-weight: 500 !important;
          transition: all 0.3s ease !important;
          padding: 8px 16px !important;
          border-radius: 8px !important;
          border: none !important;
          background: none !important;
        }

        .futuristic-btn-link:hover {
          color: #64b5f6 !important;
          background: rgba(100, 181, 246, 0.1) !important;
          transform: translateY(-1px) !important;
        }

        .futuristic-alert {
          background: rgba(239, 68, 68, 0.1) !important;
          border: 1px solid rgba(239, 68, 68, 0.3) !important;
          border-radius: 12px !important;
          color: #fca5a5 !important;
          backdrop-filter: blur(10px);
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

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #ffffff;
          animation: spin 1s ease-in-out infinite;
          display: inline-block;
          margin-right: 8px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center futuristic-bg">
        <div className="animated-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        
        <div className="row w-100" style={{ zIndex: 10, position: 'relative' }}>
          <div className="col-md-6 offset-md-3 col-lg-4 offset-lg-4">
            <div className="card futuristic-card">
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <h2 className="futuristic-title mb-3">AI Budget Tracker</h2>
                  <p className="futuristic-subtitle">Kelola keuangan dengan teknologi AI masa depan</p>
                </div>

                {error && (
                  <div className="alert futuristic-alert mb-4" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {!isLogin && (
                    <div className="mb-4">
                      <input
                        type="text"
                        className="form-control form-control-lg futuristic-input"
                        placeholder="Masukkan nama lengkap Anda"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                  )}
                  <div className="mb-4">
                    <input
                      type="email"
                      className="form-control form-control-lg futuristic-input"
                      placeholder="Masukkan email Anda"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-5">
                    <input
                      type="password"
                      className="form-control form-control-lg futuristic-input"
                      placeholder="Masukkan password Anda"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-lg w-100 mb-4 futuristic-btn-primary"
                    disabled={loading}
                  >
                    {loading && <div className="loading-spinner"></div>}
                    {loading ? 'Memproses...' : (isLogin ? 'Masuk ke Sistem' : 'Daftar Sekarang')}
                  </button>
                </form>

                <button
                  onClick={handleGoogleAuth}
                  className="btn btn-lg w-100 mb-4 futuristic-btn-secondary"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" className="me-2" style={{ marginBottom: '2px' }}>
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Masuk dengan Google
                </button>

                <div className="text-center">
                  <button
                    className="btn futuristic-btn-link"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Belum punya akun? Daftar sekarang' : 'Sudah punya akun? Masuk di sini'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Auth