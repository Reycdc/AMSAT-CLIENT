import { useState } from 'react';
import { Search, Send, CheckCheck, MoreVertical } from 'lucide-react';

interface SentMessage {
    id: number;
    recipient: string;
    subject: string;
    preview: string;
    timestamp: string;
    isDelivered: boolean;
    isRead: boolean;
}

export default function MessageSent() {
    const [messages] = useState<SentMessage[]>([
        {
            id: 1,
            recipient: 'YB0AZ',
            subject: 'Re: Satellite Pass Information',
            preview: 'Terima kasih atas informasinya. Saya akan mencoba tracking pada waktu tersebut...',
            timestamp: 'Today, 2:30 PM',
            isDelivered: true,
            isRead: true,
        },
        {
            id: 2,
            recipient: 'Event Coordinator',
            subject: 'Event Registration Confirmation',
            preview: 'Saya ingin mengkonfirmasi kehadiran saya untuk event AMSAT bulan depan...',
            timestamp: 'Yesterday, 4:15 PM',
            isDelivered: true,
            isRead: false,
        },
        {
            id: 3,
            recipient: 'Admin AMSAT',
            subject: 'Profile Update Request',
            preview: 'Mohon bantuan untuk update informasi profil saya...',
            timestamp: '3 days ago',
            isDelivered: true,
            isRead: true,
        },
    ]);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredMessages = messages.filter(msg =>
        msg.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Pesan Terkirim</h1>
                <p className="text-gray-500">Lihat pesan yang telah Anda kirim</p>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Cari pesan terkirim..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    />
                </div>
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredMessages.length === 0 ? (
                    <div className="p-12 text-center">
                        <Send className="mx-auto mb-4 text-gray-300" size={48} />
                        <p className="text-gray-500">Tidak ada pesan terkirim</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredMessages.map((message) => (
                            <div
                                key={message.id}
                                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Status Icon */}
                                    <div className="mt-1">
                                        {message.isRead ? (
                                            <CheckCheck size={18} className="text-blue-500" />
                                        ) : message.isDelivered ? (
                                            <CheckCheck size={18} className="text-gray-400" />
                                        ) : (
                                            <Send size={18} className="text-gray-300" />
                                        )}
                                    </div>

                                    {/* Message Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-1">
                                            <div>
                                                <span className="text-sm text-gray-500">Kepada: </span>
                                                <span className="font-semibold text-gray-900">{message.recipient}</span>
                                            </div>
                                            <span className="text-sm text-gray-500 whitespace-nowrap">{message.timestamp}</span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 mb-1">{message.subject}</p>
                                        <p className="text-sm text-gray-500 truncate">{message.preview}</p>

                                        {/* Status Badge */}
                                        <div className="mt-2 flex items-center gap-2">
                                            {message.isRead && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                                                    ✓ Dibaca
                                                </span>
                                            )}
                                            {message.isDelivered && !message.isRead && (
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                                                    ✓ Terkirim
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* More Options */}
                                    <button className="text-gray-400 hover:text-gray-600 p-1">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                    Menampilkan {filteredMessages.length} dari {messages.length} pesan
                </p>
                <div className="flex gap-2">
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                        Previous
                    </button>
                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
