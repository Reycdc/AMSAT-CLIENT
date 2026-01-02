import { useState } from 'react';
import { Search, FileText, Clock, Trash2, Send } from 'lucide-react';

interface DraftMessage {
    id: number;
    recipient: string;
    subject: string;
    preview: string;
    lastEdited: string;
}

export default function MessageDraft() {
    const [drafts] = useState<DraftMessage[]>([
        {
            id: 1,
            recipient: 'YB1ABC',
            subject: 'Pertanyaan tentang QSO',
            preview: 'Halo, saya ingin bertanya mengenai...',
            lastEdited: '2 hours ago',
        },
        {
            id: 2,
            recipient: '',
            subject: 'Untitled',
            preview: 'Draft pesan baru...',
            lastEdited: '1 day ago',
        },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDrafts, setSelectedDrafts] = useState<number[]>([]);

    const toggleSelectDraft = (id: number) => {
        setSelectedDrafts(prev =>
            prev.includes(id) ? prev.filter(draftId => draftId !== id) : [...prev, id]
        );
    };

    const filteredDrafts = drafts.filter(draft =>
        draft.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        draft.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Draft</h1>
                <p className="text-gray-500">Pesan yang belum selesai ditulis</p>
            </div>

            {/* Search and Actions Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
                <div className="p-4 flex flex-col md:flex-row gap-4 items-center">
                    {/* Search */}
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari draft..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                    </div>

                    {/* Action Buttons */}
                    {selectedDrafts.length > 0 && (
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                                <Trash2 size={18} />
                                <span className="text-sm font-medium">Hapus ({selectedDrafts.length})</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Drafts List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredDrafts.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText className="mx-auto mb-4 text-gray-300" size={48} />
                        <p className="text-gray-500 mb-4">Tidak ada draft</p>
                        <button className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all font-medium">
                            Buat Pesan Baru
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredDrafts.map((draft) => (
                            <div
                                key={draft.id}
                                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={selectedDrafts.includes(draft.id)}
                                        onChange={() => toggleSelectDraft(draft.id)}
                                        className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                    />

                                    {/* Draft Icon */}
                                    <div className="mt-1">
                                        <FileText size={18} className="text-orange-500" />
                                    </div>

                                    {/* Draft Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-1">
                                            <div>
                                                {draft.recipient ? (
                                                    <>
                                                        <span className="text-sm text-gray-500">Kepada: </span>
                                                        <span className="font-semibold text-gray-900">{draft.recipient}</span>
                                                    </>
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">Penerima belum ditentukan</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Clock size={14} />
                                                <span>{draft.lastEdited}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium text-gray-700 mb-1">
                                            {draft.subject || <span className="italic text-gray-400">Tanpa judul</span>}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">{draft.preview}</p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Lanjutkan menulis">
                                            <Send size={18} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors" title="Hapus">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Stats */}
            {drafts.length > 0 && (
                <div className="mt-6">
                    <p className="text-sm text-gray-500">
                        {filteredDrafts.length} draft tersimpan
                    </p>
                </div>
            )}
        </div>
    );
}
