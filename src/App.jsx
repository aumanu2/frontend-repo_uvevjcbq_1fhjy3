import { useState } from 'react'
import Hero from './components/Hero'
import Pricing from './components/Pricing'
import Dashboard from './components/Dashboard'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function App() {
  const [view, setView] = useState('landing')

  const handleSubscribe = async () => {
    try {
      const email = prompt('Masukkan email untuk Stripe Checkout')
      if (!email) return
      const res = await fetch(`${API_BASE}/api/checkout/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.detail || 'Gagal membuat sesi pembayaran')
      }
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-blue-600" />
            <span className="font-semibold text-gray-900">ASN Swap</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#fitur" className="hover:text-gray-900">Fitur</a>
            <a href="#subscribe" className="hover:text-gray-900">Harga</a>
            <button onClick={() => setView('dashboard')} className="rounded-md bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">Dashboard</button>
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

      {view === 'dashboard' && (
        <Dashboard />
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
