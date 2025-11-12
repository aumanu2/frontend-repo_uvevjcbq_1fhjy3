import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-medium border border-blue-100">Platform ASN</span>
            <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Temukan ASN lain untuk tukar lokasi kerja dengan mudah.
            </h1>
            <p className="mt-4 text-gray-600 leading-relaxed">
              Bergabung dengan komunitas ASN lintas instansi untuk menemukan pasangan tukar lokasi yang cocok. Modern, aman, dan fokus pada profesionalitas.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href="#subscribe" className="inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 font-medium transition-colors">Mulai Berlangganan</a>
              <a href="#fitur" className="inline-flex items-center justify-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-3 font-medium transition-colors">Lihat Fitur</a>
            </div>
          </div>
          <div className="h-[360px] md:h-[480px] rounded-xl bg-gradient-to-br from-blue-50 to-gray-50 border border-gray-100 shadow-sm">
            <Spline scene="https://prod.spline.design/41MGRk-UDPKO-l6W/scene.splinecode" style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-blue-50/50 to-transparent" />
    </section>
  )
}
