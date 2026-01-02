import { useState } from 'react';
import { Search, Mail, Star, Trash2, Archive, MoreVertical } from 'lucide-react';

interface Message {
    id: number;
    sender: string;
    subject: string;
    preview: string;
    timestamp: string;
    isRead: boolean;
    isStarred: boolean;
    hasAttachment: boolean;
}

export default function MessageInbox() {
    const [messages] = useState<Message[]>([
        {
            id: 1,
            sender: 'Admin AMSAT',
            subject: 'Welcome to AMSAT-ID Platform',
            preview: 'Selamat datang di platform AMSAT-ID. Kami senang Anda bergabung dengan komunitas...',
            timestamp: '10:30 AM',
            isRead: false,
            isStarred: true,
            hasAttachment: true,
        },
        {
            id: 2,
            sender: 'YB0AZ',
            subject: 'Satellite Pass Information',
            preview: 'Informasi pass satelit untuk minggu ini. ISS akan melintas pada...',
            timestamp: 'Yesterday',
            isRead: true,
            isStarred: false,
            hasAttachment: false,
        },
        {
            id: 3,
            sender: 'Event Coordinator',
            subject: 'Upcoming AMSAT Event',
            preview: 'Jangan lewatkan event AMSAT bulan depan. Akan ada workshop tentang...',
            timestamp: '2 days ago',
            isRead: true,
            isStarred: false,
            hasAttachment: true,
        },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMessages, setSelectedMessages] = useState<number[]>([]);

    const toggleSelectMessage = (id: number) => {
        setSelectedMessages(prev =>
            prev.includes(id) ? prev.filter(msgId => msgId !== id) : [...prev, id]
        );
    };

    const filteredMessages = messages.filter(msg =>
        msg.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Kotak Masuk</h1>
                <p className="text-gray-500">Kelola pesan masuk Anda</p>
            </div>

            {/* Search and Actions Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
                <div className="p-4 flex flex-col md:flex-row gap-4 items-center">
                    {/* Search */}
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari pesan..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                    </div>

                    {/* Action Buttons */}
                    {selectedMessages.length > 0 && (
                        <div className="flex gap-2">
                            <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Archive">
                                <Archive size={20} />
                            </button>
                            <button className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Delete">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {filteredMessages.length === 0 ? (
                    <div className="p-12 text-center">
                        <Mail className="mx-auto mb-4 text-gray-300" size={48} />
                        <p className="text-gray-500">Tidak ada pesan ditemukan</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filteredMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!message.isRead ? 'bg-red-50/30' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Checkbox */}
                                    <input
                                        type="checkbox"
                                        checked={selectedMessages.includes(message.id)}
                                        onChange={() => toggleSelectMessage(message.id)}
                                        className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                    />

                                    {/* Star */}
                                    <button className="mt-1">
                                        <Star
                                            size={18}
                                            className={message.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                        />
                                    </button>

                                    {/* Message Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-1">
                                            <h3 className={`font-semibold ${!message.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                                                {message.sender}
                                            </h3>
                                            <span className="text-sm text-gray-500 whitespace-nowrap">{message.timestamp}</span>
                                        </div>
                                        <p className={`text-sm mb-1 ${!message.isRead ? 'font-medium text-gray-900' : 'text-gray-600'}`}>
                                            {message.subject}
                                        </p>
                                        <p className="text-sm text-gray-500 truncate">{message.preview}</p>

                                        {/* Attachment Badge */}
                                        {message.hasAttachment && (
                                            <div className="mt-2">
                                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                    📎 Attachment
                                                </span>
                                            </div>
                                        )}
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
