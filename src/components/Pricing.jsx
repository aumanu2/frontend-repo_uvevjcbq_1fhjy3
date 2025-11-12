export default function Pricing({ onSubscribe }) {
  return (
    <section id="subscribe" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Berlangganan untuk akses penuh</h2>
          <p className="mt-3 text-gray-600">Pembayaran melalui Stripe. Batalkan kapan saja.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-gray-200 p-6 bg-white shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Paket Bulanan</h3>
            <p className="mt-2 text-4xl font-bold text-gray-900">Rp50.000<span className="text-base font-medium text-gray-500">/bulan</span></p>
            <ul className="mt-6 space-y-2 text-sm text-gray-600">
              <li>Akses cari dan filter profil</li>
              <li>Fitur match dua arah</li>
              <li>Chat langsung</li>
              <li>Prioritas verifikasi</li>
            </ul>
            <button onClick={onSubscribe} className="mt-6 w-full rounded-md bg-blue-600 hover:bg-blue-700 text-white py-3 font-medium transition-colors">Lanjut ke Pembayaran</button>
          </div>
        </div>
      </div>
    </section>
  )
}
