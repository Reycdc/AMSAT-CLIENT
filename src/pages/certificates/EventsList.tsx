import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, Award, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { getUserRolePath } from '../../utils/roleUtils';
import { useAuth } from '../../hooks/useAuth';

interface Event {
    id: number;
    name: string;
    date: string;
    location: string;
    participants: number;
    certificatesIssued: number;
    status: 'upcoming' | 'ongoing' | 'completed';
}

export default function EventsList() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const rolePath = getUserRolePath(user);
    const [events] = useState<Event[]>([
        {
            id: 1,
            name: 'Workshop Satellite Tracking 2024',
            date: '2024-03-15',
            location: 'Jakarta',
            participants: 45,
            certificatesIssued: 42,
            status: 'completed',
        },
        {
            id: 2,
            name: 'AMSAT Conference Indonesia',
            date: '2024-04-20',
            location: 'Bandung',
            participants: 120,
            certificatesIssued: 0,
            status: 'upcoming',
        },
        {
            id: 3,
            name: 'Radio Amateur Training',
            date: '2024-03-25',
            location: 'Surabaya',
            participants: 30,
            certificatesIssued: 15,
            status: 'ongoing',
        },
    ]);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            event.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const getStatusBadge = (status: string) => {
        const badges = {
            upcoming: 'bg-blue-100 text-blue-700',
            ongoing: 'bg-green-100 text-green-700',
            completed: 'bg-gray-100 text-gray-700',
        };
        const labels = {
            upcoming: 'Akan Datang',
            ongoing: 'Berlangsung',
            completed: 'Selesai',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Event</h1>
                    <p className="text-gray-500">Kelola event dan sertifikat peserta</p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all font-medium flex items-center gap-2">
                    <Plus size={20} />
                    Buat Event Baru
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Event</p>
                            <h3 className="text-3xl font-bold text-gray-900">{events.length}</h3>
                        </div>
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                            <Calendar size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Peserta</p>
                            <h3 className="text-3xl font-bold text-gray-900">
                                {events.reduce((sum, e) => sum + e.participants, 0)}
                            </h3>
                        </div>
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Users size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Sertifikat Diterbitkan</p>
                            <h3 className="text-3xl font-bold text-gray-900">
                                {events.reduce((sum, e) => sum + e.certificatesIssued, 0)}
                            </h3>
                        </div>
                        <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                            <Award size={24} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari event..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                    </div>

                    {/* Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    >
                        <option value="all">Semua Status</option>
                        <option value="upcoming">Akan Datang</option>
                        <option value="ongoing">Berlangsung</option>
                        <option value="completed">Selesai</option>
                    </select>
                </div>
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Event</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Lokasi</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Peserta</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Sertifikat</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredEvents.map((event) => (
                            <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="font-semibold text-gray-900">{event.name}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-gray-600">
                                        {new Date(event.date).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-gray-600">{event.location}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 text-sm text-gray-900">
                                        <Users size={16} className="text-gray-400" />
                                        {event.participants}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1 text-sm text-gray-900">
                                        <Award size={16} className="text-gray-400" />
                                        {event.certificatesIssued}/{event.participants}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(event.status)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => navigate(`/${rolePath}/sertifikat/participants?event=${encodeURIComponent(event.name)}`)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Lihat Detail Peserta"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                                            <Edit size={18} />
                                        </button>
                                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredEvents.length === 0 && (
                    <div className="p-12 text-center">
                        <Calendar className="mx-auto mb-4 text-gray-300" size={48} />
                        <p className="text-gray-500">Tidak ada event ditemukan</p>
                    </div>
                )}
            </div>
        </div>
    );
}
