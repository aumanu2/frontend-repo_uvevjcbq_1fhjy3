import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Dashboard() {
  const [profile, setProfile] = useState({
    email: '',
    name: '',
    nip: '',
    agency: '',
    position: '',
    grade: '',
    current_region: '',
    desired_region: ''
  })
  const [results, setResults] = useState([])
  const [target, setTarget] = useState('')
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState('')

  const saveProfile = async () => {
    if (!profile.email) { alert('Masukkan email'); return }
    const res = await fetch(`${API_BASE}/api/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...profile, is_subscribed: true })
    })
    const data = await res.json()
    alert(`Profil ${data.status}`)
  }

  const doSearch = async () => {
    const params = new URLSearchParams()
    if (target) params.append('desired_region', target)
    if (profile.current_region) params.append('current_region', profile.current_region)
    const res = await fetch(`${API_BASE}/api/search?${params.toString()}`)
    const data = await res.json()
    setResults(data.results || [])
  }

  const loadHistory = async () => {
    if (!a || !b) return
    const res = await fetch(`${API_BASE}/api/chat/history?a=${encodeURIComponent(a)}&b=${encodeURIComponent(b)}`)
    const data = await res.json()
    setMessages(data.messages || [])
  }

  const sendMessage = async () => {
    if (!a || !b || !content) return
    await fetch(`${API_BASE}/api/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from_email: a, to_email: b, content })
    })
    setContent('')
    loadHistory()
  }

  useEffect(() => { if (a && b) loadHistory() }, [a, b])

  return (
    <section className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600">Lengkapi profil untuk memulai pencarian pasangan tukar lokasi.</p>

        <div className="mt-8 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900">Profil Anda</h3>
            <div className="mt-4 grid grid-cols-1 gap-3">
              {[
                ['Email', 'email'],
                ['Nama', 'name'],
                ['NIP (opsional)', 'nip'],
                ['Instansi', 'agency'],
                ['Jabatan', 'position'],
                ['Golongan', 'grade'],
                ['Daerah kerja sekarang', 'current_region'],
                ['Daerah yang diinginkan', 'desired_region']
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-sm text-gray-700 mb-1">{label}</label>
                  <input value={profile[key]} onChange={(e) => setProfile(p => ({ ...p, [key]: e.target.value }))} className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              ))}
              <button onClick={saveProfile} className="mt-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">Simpan Profil</button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900">Cari Pasangan Tukar</h3>
            <div className="mt-4 flex items-center gap-3">
              <input placeholder="Daerah yang diinginkan" value={target} onChange={(e) => setTarget(e.target.value)} className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={doSearch} className="rounded-md bg-gray-900 hover:bg-gray-800 text-white px-4 py-2">Cari</button>
            </div>
            <div className="mt-4 divide-y divide-gray-100">
              {results.map((r) => (
                <div key={r.email} className="py-3 flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{r.name} {r.is_verified && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">Verified</span>}</p>
                    <p className="text-sm text-gray-600">{r.agency} • {r.position} • {r.grade}</p>
                    <p className="text-sm text-gray-600">Sekarang: {r.current_region} → Ingin: {r.desired_region}</p>
                  </div>
                  <a href={`mailto:${r.email}`} className="text-blue-600 hover:underline text-sm">Hubungi</a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <input placeholder="Email Anda" value={a} onChange={(e) => setA(e.target.value)} className="rounded-md border border-gray-300 px-3 py-2" />
              <input placeholder="Email Lawan Bicara" value={b} onChange={(e) => setB(e.target.value)} className="rounded-md border border-gray-300 px-3 py-2" />
            </div>
            <div className="mt-4 h-56 overflow-y-auto rounded-md border border-gray-200 p-3 bg-gray-50">
              {messages.map((m, i) => (
                <div key={i} className={`mb-2 ${m.from_email === a ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block px-3 py-2 rounded-lg ${m.from_email === a ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200'}`}>
                    {m.content}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input placeholder="Tulis pesan..." value={content} onChange={(e) => setContent(e.target.value)} className="flex-1 rounded-md border border-gray-300 px-3 py-2" />
              <button onClick={sendMessage} className="rounded-md bg-blue-600 hover:bg-blue-700 text-white px-4">Kirim</button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900">Panel Admin (Sederhana)</h3>
            <AdminPanel />
          </div>
        </div>
      </div>
    </section>
  )
}

function AdminPanel() {
  const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [users, setUsers] = useState([])
  const [email, setEmail] = useState('')

  const load = async () => {
    const res = await fetch(`${API_BASE}/api/admin/users`)
    const data = await res.json()
    setUsers(data.users || [])
  }

  const verify = async (email, v) => {
    await fetch(`${API_BASE}/api/admin/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, verified: v })
    })
    load()
  }

  const remove = async (email) => {
    await fetch(`${API_BASE}/api/admin/users/${encodeURIComponent(email)}`, { method: 'DELETE' })
    load()
  }

  useEffect(() => { load() }, [])

  return (
    <div>
      <button onClick={load} className="rounded-md bg-gray-900 hover:bg-gray-800 text-white px-3 py-2">Refresh</button>
      <div className="mt-4 divide-y divide-gray-100">
        {users.map(u => (
          <div key={u.email} className="py-3 flex items-start justify-between">
            <div>
              <p className="font-medium text-gray-900">{u.name} {u.is_verified && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">Verified</span>}</p>
              <p className="text-sm text-gray-600">{u.email} • {u.agency} • {u.current_region} → {u.desired_region}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => verify(u.email, true)} className="text-blue-600 hover:underline text-sm">Verifikasi</button>
              <button onClick={() => verify(u.email, false)} className="text-gray-600 hover:underline text-sm">Cabut</button>
              <button onClick={() => remove(u.email)} className="text-red-600 hover:underline text-sm">Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
