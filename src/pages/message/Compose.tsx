import { useState } from 'react';
import { Send, Paperclip, X, Users, Save } from 'lucide-react';

export default function MessageCompose() {
    const [formData, setFormData] = useState({
        to: '',
        cc: '',
        subject: '',
        message: '',
    });
    const [attachments, setAttachments] = useState<File[]>([]);
    const [showCc, setShowCc] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const removeAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSaveDraft = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        alert('Draft berhasil disimpan!');
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate sending
        alert('Pesan berhasil dikirim!');
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Buat Pesan Baru</h1>
                <p className="text-gray-500">Kirim pesan ke anggota AMSAT-ID</p>
            </div>

            {/* Compose Form */}
            <form onSubmit={handleSend} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* To Field */}
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700 w-16">Kepada:</label>
                        <input
                            type="text"
                            name="to"
                            value={formData.to}
                            onChange={handleChange}
                            placeholder="Masukkan email atau username penerima"
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowCc(!showCc)}
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                            {showCc ? 'Hide Cc' : 'Cc'}
                        </button>
                    </div>
                </div>

                {/* Cc Field */}
                {showCc && (
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-gray-700 w-16">Cc:</label>
                            <input
                                type="text"
                                name="cc"
                                value={formData.cc}
                                onChange={handleChange}
                                placeholder="Carbon copy"
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                            />
                        </div>
                    </div>
                )}

                {/* Subject Field */}
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700 w-16">Subjek:</label>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Judul pesan"
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                            required
                        />
                    </div>
                </div>

                {/* Message Body */}
                <div className="p-4">
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tulis pesan Anda di sini..."
                        rows={12}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                        required
                    />
                </div>

                {/* Attachments */}
                {attachments.length > 0 && (
                    <div className="px-4 pb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Lampiran ({attachments.length})</p>
                            <div className="space-y-2">
                                {attachments.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white p-2 rounded border border-gray-200">
                                        <div className="flex items-center gap-2">
                                            <Paperclip size={16} className="text-gray-400" />
                                            <span className="text-sm text-gray-700">{file.name}</span>
                                            <span className="text-xs text-gray-400">({(file.size / 1024).toFixed(1)} KB)</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(index)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Bar */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        {/* Attach File */}
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <div className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-white transition-colors flex items-center gap-2 text-gray-700">
                                <Paperclip size={18} />
                                <span className="text-sm font-medium">Lampirkan File</span>
                            </div>
                        </label>

                        {/* Quick Recipients */}
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-white transition-colors flex items-center gap-2 text-gray-700"
                        >
                            <Users size={18} />
                            <span className="text-sm font-medium">Pilih dari Kontak</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Save Draft */}
                        <button
                            type="button"
                            onClick={handleSaveDraft}
                            disabled={isSaving}
                            className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-white transition-colors flex items-center gap-2 text-gray-700 disabled:opacity-50"
                        >
                            <Save size={18} />
                            <span className="text-sm font-medium">{isSaving ? 'Menyimpan...' : 'Simpan Draft'}</span>
                        </button>

                        {/* Send Button */}
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center gap-2 font-medium"
                        >
                            <Send size={18} />
                            <span>Kirim Pesan</span>
                        </button>
                    </div>
                </div>
            </form>

            {/* Tips Card */}
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Tips Menulis Pesan</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Gunakan subjek yang jelas dan deskriptif</li>
                    <li>• Pastikan alamat penerima sudah benar</li>
                    <li>• Gunakan bahasa yang sopan dan profesional</li>
                    <li>• Periksa kembali sebelum mengirim</li>
                </ul>
            </div>
        </div>
    );
}
