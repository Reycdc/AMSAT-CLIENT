import { Check, Star, Shield, Zap } from 'lucide-react';

export default function CertificateOffer() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                    Layanan Sertifikat Digital <span className="text-red-600">Premium</span>
                </h1>
                <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                    Tingkatkan kredibilitas event Anda dengan sertifikat digital berstandar industri, terverifikasi, dan otomatis.
                </p>
            </div>

            {/* Benefits Section */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-20">
                <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                        <Zap className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Generate Instan</h3>
                    <p className="text-gray-500">
                        Buat ribuan sertifikat dalam hitungan detik. Sistem otomatis kami menangani nama, tanggal, dan ID unik secara real-time.
                    </p>
                </div>
                <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                        <Shield className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Verifikasi Barcode</h3>
                    <p className="text-gray-500">
                        Setiap sertifikat dilengkapi barcode CODE128 unik yang dapat diverifikasi keasliannya melalui sistem kami.
                    </p>
                </div>
                <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                        <Star className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Desain Eksklusif</h3>
                    <p className="text-gray-500">
                        Akses ke berbagai template desain premium atau kustomisasi tata letak sesuai branding organisasi Anda.
                    </p>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="px-3 bg-gray-50 text-lg font-medium text-gray-900">
                        Pilihan Paket
                    </span>
                </div>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-3 items-center">
                {/* Basic Plan */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-xl font-semibold text-gray-900">Starter</h3>
                    <p className="mt-4 text-gray-500 text-sm">Untuk event skala kecil dan komunitas.</p>
                    <p className="mt-8">
                        <span className="text-4xl font-extrabold text-gray-900">Rp 150.000</span>
                        <span className="text-base font-medium text-gray-500">/event</span>
                    </p>
                    <ul className="mt-8 space-y-4">
                        {[
                            'Hingga 100 Peserta',
                            'Template Dasar',
                            'Export PDF Standar',
                            'Masa Aktif 30 Hari'
                        ].map((feature) => (
                            <li key={feature} className="flex items-center">
                                <Check className="w-5 h-5 text-green-500 mr-3" />
                                <span className="text-gray-600 text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <button className="mt-8 w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                        Hubungi Admin
                    </button>
                </div>

                {/* Pro Plan (Highlighted) */}
                <div className="bg-white rounded-2xl shadow-xl border-2 border-red-600 p-8 relative transform scale-105">
                    <div className="absolute top-0 right-0 -mr-1 -mt-1 w-32 h-32 overflow-hidden rounded-tr-2xl">
                        <div className="absolute transform rotate-45 bg-red-600 text-white text-xs font-semibold py-1 right-[-35px] top-[32px] w-[170px] text-center">
                            POPULAR
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Professional</h3>
                    <p className="mt-4 text-gray-500 text-sm">Solusi terbaik untuk webinar & seminar nasional.</p>
                    <p className="mt-8">
                        <span className="text-4xl font-extrabold text-gray-900">Rp 500.000</span>
                        <span className="text-base font-medium text-gray-500">/event</span>
                    </p>
                    <ul className="mt-8 space-y-4">
                        {[
                            'Hingga 1.000 Peserta',
                            'Akses Semua Template Premium',
                            'Barcode Verification System',
                            'Custom Signature & Logo',
                            'Prioritas Support',
                            'Masa Aktif Selamanya'
                        ].map((feature) => (
                            <li key={feature} className="flex items-center">
                                <Check className="w-5 h-5 text-red-600 mr-3" />
                                <span className="text-gray-900 font-medium text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <button className="mt-8 w-full bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl py-3 text-sm font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                        Pilih Paket Pro
                    </button>
                </div>

                {/* Enterprise Plan */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-xl font-semibold text-gray-900">Enterprise</h3>
                    <p className="mt-4 text-gray-500 text-sm">Kustomisasi penuh untuk institusi besar.</p>
                    <p className="mt-8">
                        <span className="text-4xl font-extrabold text-gray-900">Custom</span>
                    </p>
                    <ul className="mt-8 space-y-4">
                        {[
                            'Unlimited Peserta',
                            'Dedicated Server Resources',
                            'API Access Integration',
                            'White Label (No Watermark)',
                            '24/7 Dedicated Support',
                            'Training Penggunaan'
                        ].map((feature) => (
                            <li key={feature} className="flex items-center">
                                <Check className="w-5 h-5 text-green-500 mr-3" />
                                <span className="text-gray-600 text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <button className="mt-8 w-full bg-gray-50 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition-colors">
                        Diskusikan Kebutuhan
                    </button>
                </div>
            </div>

            <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Butuh Penjelasan Lebih Lanjut?</h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                    Tim kami siap membantu Anda memilih paket yang paling sesuai dengan kebutuhan event Anda. Konsultasikan gratis sekarang.
                </p>
                <div className="flex justify-center gap-4">
                    <button className="px-8 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                        Chat WhatsApp
                    </button>
                    <button className="px-8 py-3 bg-transparent border border-gray-600 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                        Kirim Email
                    </button>
                </div>
            </div>
        </div>
    );
}
