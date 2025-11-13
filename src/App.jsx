import { useEffect, useState } from 'react'
import Hero from './components/Hero'
import Pricing from './components/Pricing'
import Dashboard from './components/Dashboard'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function LoginPanel({ onLoggedIn }) {
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [debugOtp, setDebugOtp] = useState('')

  const requestOtp = async () => {
    setLoading(true); setError(''); setDebugOtp('')
    try {
      const res = await fetch(`${API_BASE}/api/auth/request-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Gagal meminta OTP')
      setStep('code')
      if (data.debug_code) setDebugOtp(data.debug_code)
    } catch (e) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  const verifyOtp = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'OTP tidak valid')
      localStorage.setItem('token', data.access_token)
      localStorage.setItem('email', data.email)
      onLoggedIn({ token: data.access_token, email: data.email })
    } catch (e) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Masuk dengan OTP</h3>
      {step === 'email' && (
        <div className="mt-3 flex gap-2">
          <input type="email" placeholder="Email ASN" value={email} onChange={(e)=>setEmail(e.target.value)} className="flex-1 rounded-md border border-gray-300 px-3 py-2" />
          <button onClick={requestOtp} disabled={loading || !email} className="rounded-md bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 disabled:opacity-50">{loading ? 'Mengirim...' : 'Kirim OTP'}</button>
        </div>
      )}
      {step === 'code' && (
        <div className="mt-3 flex gap-2 items-center">
          <input placeholder="6 digit OTP" value={code} onChange={(e)=>setCode(e.target.value)} className="flex-1 rounded-md border border-gray-300 px-3 py-2" />
          <button onClick={verifyOtp} disabled={loading || code.length !== 6} className="rounded-md bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 disabled:opacity-50">Verifikasi</button>
        </div>
      )}
      {debugOtp && (
        <p className="mt-2 text-xs text-gray-500">Kode (dev): {debugOtp}</p>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}

function App() {
  const [view, setView] = useState('landing')
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const loggedIn = Boolean(token)

  useEffect(() => {
    const t = localStorage.getItem('token')
    const e = localStorage.getItem('email')
    if (t && e) { setToken(t); setEmail(e) }
  }, [])

  const logout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('email')
    setToken(''); setEmail(''); setView('landing')
  }

  const handleSubscribe = async () => {
    try {
      const targetEmail = loggedIn ? email : prompt('Masukkan email untuk Stripe Checkout')
      if (!targetEmail) return
      const res = await fetch(`${API_BASE}/api/checkout/session`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: targetEmail })
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert(data.detail || 'Gagal membuat sesi pembayaran')
    } catch (e) { alert(e.message) }
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-blue-600" />
            <span className="font-semibold text-gray-900">ASN Swap</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm text-gray-600">
            <a href="#fitur" className="hover:text-gray-900">Fitur</a>
            <a href="#subscribe" className="hover:text-gray-900">Harga</a>
            {loggedIn ? (
              <>
                <span className="text-gray-700">{email}</span>
                <button onClick={() => setView('dashboard')} className="rounded-md bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">Dashboard</button>
                <button onClick={logout} className="rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2">Keluar</button>
              </>
            ) : (
              <button onClick={() => setView('login')} className="rounded-md bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">Masuk</button>
            )}
          </div>
        </div>
      </nav>

      {view === 'landing' && (
        <>
          <Hero />
          <section id="fitur" className="bg-gray-50">
            <div className="mx-auto max-w-7xl px-6 py-16 grid md:grid-cols-3 gap-6">
              {["Isi profil rinci", "Cari pasangan tukar", "Chat dan koordinasi"].map((t, i) => (
                <div key={i} className="rounded-2xl bg-white border border-gray-200 p-6">
                  <p className="text-lg font-semibold text-gray-900">{t}</p>
                  <p className="mt-2 text-gray-600">Desain modern, netral, dan profesional dengan warna putih, abu, dan biru lembut.</p>
                </div>
              ))}
            </div>
          </section>
          <Pricing onSubscribe={handleSubscribe} />
        </>
      )}

      {view === 'login' && (
        <section className="bg-gray-50">
          <div className="mx-auto max-w-3xl px-6 py-12">
            <LoginPanel onLoggedIn={({ token, email }) => { setToken(token); setEmail(email); setView('dashboard') }} />
          </div>
        </section>
      )}

      {view === 'dashboard' && (
        loggedIn ? <Dashboard token={token} email={email} /> : (
          <section className="bg-gray-50">
            <div className="mx-auto max-w-3xl px-6 py-12">
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <p className="text-gray-700">Silakan masuk dahulu untuk mengakses Dashboard.</p>
                <div className="mt-4"><LoginPanel onLoggedIn={({ token, email }) => { setToken(token); setEmail(email); setView('dashboard') }} /></div>
              </div>
            </div>
          </section>
        )
      )}

      <footer className="bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-gray-500 flex justify-between">
          <span>© {new Date().getFullYear()} ASN Swap</span>
          <span>"Temukan ASN lain untuk tukar lokasi kerja dengan mudah."</span>
        </div>
      </footer>
    </div>
  )
}

export default App
