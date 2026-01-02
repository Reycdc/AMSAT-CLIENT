import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Download, Send, Award, Filter, CheckCircle, XCircle, FileJson, Settings, X, Loader2 } from 'lucide-react';
import JSZip from 'jszip';
import { certificateGenerator, type CertificateConfig } from '../../utils/certificateGenerator';

interface Participant {
    id: number;
    name: string;
    email: string;
    callSign: string;
    event: string;
    eventDate: string;
    certificateStatus: 'issued' | 'pending' | 'not_issued';
    attendance: boolean;
}

export default function ParticipantsList() {
    const [participants] = useState<Participant[]>([
        {
            id: 1,
            name: 'Ahmad Fauzi',
            email: 'ahmad@example.com',
            callSign: 'YB0AZ',
            event: 'Workshop Satellite Tracking 2024',
            eventDate: '2024-03-15',
            certificateStatus: 'issued',
            attendance: true,
        },
        {
            id: 2,
            name: 'Siti Nurhaliza',
            email: 'siti@example.com',
            callSign: 'YC1SNH',
            event: 'Workshop Satellite Tracking 2024',
            eventDate: '2024-03-15',
            certificateStatus: 'pending',
            attendance: true,
        },
        {
            id: 3,
            name: 'Budi Santoso',
            email: 'budi@example.com',
            callSign: 'YB2BS',
            event: 'Workshop Satellite Tracking 2024',
            eventDate: '2024-03-15',
            certificateStatus: 'not_issued',
            attendance: false,
        },
        {
            id: 4,
            name: 'Dewi Lestari',
            email: 'dewi@example.com',
            callSign: 'YC3DL',
            event: 'Radio Amateur Training',
            eventDate: '2024-03-25',
            certificateStatus: 'issued',
            attendance: true,
        },
    ]);

    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterEvent, setFilterEvent] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedParticipants, setSelectedParticipants] = useState<number[]>([]);

    useEffect(() => {
        const eventParam = searchParams.get('event');
        if (eventParam) {
            setFilterEvent(eventParam);
        }
    }, [searchParams]);

    // Certificate Template states
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [templateConfig, setTemplateConfig] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const templateInputRef = useRef<HTMLInputElement>(null);

    const uniqueEvents = Array.from(new Set(participants.map(p => p.event)));

    const toggleSelectParticipant = (id: number) => {
        setSelectedParticipants(prev =>
            prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
        );
    };

    const filteredParticipants = participants.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.callSign.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesEvent = filterEvent === 'all' || p.event === filterEvent;
        const matchesStatus = filterStatus === 'all' || p.certificateStatus === filterStatus;
        return matchesSearch && matchesEvent && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        const badges = {
            issued: { bg: 'bg-green-100', text: 'text-green-700', label: 'Diterbitkan', icon: <CheckCircle size={14} /> },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending', icon: <Award size={14} /> },
            not_issued: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Belum Diterbitkan', icon: <XCircle size={14} /> },
        };
        const badge = badges[status as keyof typeof badges];
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                {badge.icon}
                {badge.label}
            </span>
        );
    };

    const handleBulkIssueCertificates = () => {
        if (selectedParticipants.length === 0) {
            alert('Pilih peserta terlebih dahulu');
            return;
        }
        setShowConfigModal(true);
    };

    const handleLoadTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target?.result as string);
                    setTemplateConfig(json);
                } catch (err) {
                    alert('Gagal memuat template: Format file tidak valid');
                }
            };
            reader.readAsText(file);
        }
    };

    const handleBulkGenerate = async () => {
        if (!templateConfig || selectedParticipants.length === 0) return;

        setIsGenerating(true);
        const zip = new JSZip();
        const selectedData = participants.filter(p => selectedParticipants.includes(p.id));

        try {
            for (const participant of selectedData) {
                // Find name element from template
                const nameElement = templateConfig.textElements.find((el: any) => el.type === 'name');
                const eventElement = templateConfig.textElements.find((el: any) => el.type === 'event');
                const dateElement = templateConfig.textElements.find((el: any) => el.type === 'date');

                const config: CertificateConfig = {
                    backgroundImage: templateConfig.backgroundImage,
                    participantName: participant.name,
                    eventName: participant.event,
                    eventDate: participant.eventDate,
                    namePosition: nameElement ? { x: nameElement.x, y: nameElement.y } : undefined,
                    eventPosition: eventElement ? { x: eventElement.x, y: eventElement.y } : undefined,
                    datePosition: dateElement ? { x: dateElement.x, y: dateElement.y } : undefined,
                    nameFont: nameElement ? `${nameElement.fontWeight} ${nameElement.fontSize}px "${nameElement.fontFamily}"` : undefined,
                    eventFont: eventElement ? `${eventElement.fontWeight} ${eventElement.fontSize}px "${eventElement.fontFamily}"` : undefined,
                    dateFont: dateElement ? `${dateElement.fontWeight} ${dateElement.fontSize}px "${dateElement.fontFamily}"` : undefined,
                    nameColor: nameElement?.color,
                    eventColor: eventElement?.color,
                    dateColor: dateElement?.color,
                    showBarcode: true,
                };

                const blob = await certificateGenerator.generateBlob(config);
                const safeName = participant.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                zip.file(`${participant.id}_${safeName}.png`, blob);
            }

            const content = await zip.generateAsync({ type: 'blob' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = `Certificates_${new Date().getTime()}.zip`;
            link.click();

            setShowConfigModal(false);
            alert(`Berhasil menerbitkan ${selectedData.length} sertifikat dalam file ZIP!`);
        } catch (error) {
            console.error('Generation failed:', error);
            alert('Gagal menerbitkan sertifikat');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleBulkSendCertificates = () => {
        if (selectedParticipants.length === 0) {
            alert('Pilih peserta terlebih dahulu');
            return;
        }
        alert(`Mengirim ${selectedParticipants.length} sertifikat via email... (Simulasi)`);
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Peserta</h1>
                <p className="text-gray-500">Kelola peserta event dan sertifikat mereka</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Total Peserta</p>
                    <h3 className="text-3xl font-bold text-gray-900">{participants.length}</h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Sertifikat Diterbitkan</p>
                    <h3 className="text-3xl font-bold text-green-600">
                        {participants.filter(p => p.certificateStatus === 'issued').length}
                    </h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Pending</p>
                    <h3 className="text-3xl font-bold text-yellow-600">
                        {participants.filter(p => p.certificateStatus === 'pending').length}
                    </h3>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500 mb-1">Belum Diterbitkan</p>
                    <h3 className="text-3xl font-bold text-gray-600">
                        {participants.filter(p => p.certificateStatus === 'not_issued').length}
                    </h3>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6 p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Cari nama, email, atau call sign..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                        />
                    </div>

                    {/* Event Filter */}
                    <select
                        value={filterEvent}
                        onChange={(e) => setFilterEvent(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    >
                        <option value="all">Semua Event</option>
                        {uniqueEvents.map(event => (
                            <option key={event} value={event}>{event}</option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                    >
                        <option value="all">Semua Status</option>
                        <option value="issued">Diterbitkan</option>
                        <option value="pending">Pending</option>
                        <option value="not_issued">Belum Diterbitkan</option>
                    </select>
                </div>

                {/* Bulk Actions */}
                {selectedParticipants.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-700">
                            {selectedParticipants.length} peserta dipilih
                        </span>
                        <button
                            onClick={handleBulkIssueCertificates}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <Award size={16} />
                            Terbitkan Sertifikat
                        </button>
                        <button
                            onClick={handleBulkSendCertificates}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium"
                        >
                            <Send size={16} />
                            Kirim via Email
                        </button>
                    </div>
                )}
            </div>

            {/* Participants Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left">
                                <input
                                    type="checkbox"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedParticipants(filteredParticipants.map(p => p.id));
                                        } else {
                                            setSelectedParticipants([]);
                                        }
                                    }}
                                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                />
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Call Sign</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Event</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Kehadiran</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status Sertifikat</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredParticipants.map((participant) => (
                            <tr key={participant.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedParticipants.includes(participant.id)}
                                        onChange={() => toggleSelectParticipant(participant.id)}
                                        className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="font-semibold text-gray-900">{participant.name}</p>
                                        <p className="text-sm text-gray-500">{participant.email}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm font-mono">
                                        {participant.callSign}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-gray-900">{participant.event}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-gray-600">
                                        {new Date(participant.eventDate).toLocaleDateString('id-ID')}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    {participant.attendance ? (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                                            <CheckCircle size={14} />
                                            Hadir
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                                            <XCircle size={14} />
                                            Tidak Hadir
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {getStatusBadge(participant.certificateStatus)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        {participant.certificateStatus === 'issued' && (
                                            <>
                                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download">
                                                    <Download size={18} />
                                                </button>
                                                <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Kirim Email">
                                                    <Send size={18} />
                                                </button>
                                            </>
                                        )}
                                        {participant.certificateStatus !== 'issued' && participant.attendance && (
                                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Terbitkan Sertifikat">
                                                <Award size={18} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredParticipants.length === 0 && (
                    <div className="p-12 text-center">
                        <Filter className="mx-auto mb-4 text-gray-300" size={48} />
                        <p className="text-gray-500">Tidak ada peserta ditemukan</p>
                    </div>
                )}
            </div>

            {/* Certificate Configuration Modal */}
            {showConfigModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-8 relative shadow-2xl overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600"></div>

                        <button
                            onClick={() => setShowConfigModal(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                                <Settings className="text-red-600" size={28} />
                                Konfigurasi Sertifikat Massal
                            </h2>
                            <p className="text-gray-500">Pilih template dan atur parameter untuk {selectedParticipants.length} peserta terpilih.</p>
                        </div>

                        <div className="space-y-6">
                            {/* Template Upload */}
                            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200">
                                <label className="flex flex-col items-center justify-center cursor-pointer">
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={handleLoadTemplate}
                                        className="hidden"
                                        ref={templateInputRef}
                                    />
                                    {templateConfig ? (
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <CheckCircle size={32} />
                                            </div>
                                            <h4 className="font-bold text-gray-900 mb-1">Template Dimuat!</h4>
                                            <p className="text-sm text-gray-500 mb-4">Elemen: {templateConfig.textElements.length} Teks, {templateConfig.signatureElements.length} Tanda Tangan</p>
                                            <button
                                                onClick={() => templateInputRef.current?.click()}
                                                className="text-sm font-semibold text-blue-600 hover:underline"
                                            >
                                                Ganti Template
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <FileJson size={32} />
                                            </div>
                                            <h4 className="font-bold text-gray-900 mb-1">Unggah Template JSON</h4>
                                            <p className="text-sm text-gray-500 mb-6">Gunakan file template yang diekspor dari Certificate Editor.</p>
                                            <div className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 text-sm font-bold">
                                                Pilih File Template
                                            </div>
                                        </div>
                                    )}
                                </label>
                            </div>

                            {/* Batch Options */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Peserta</h5>
                                    <p className="text-xl font-black text-gray-900">{selectedParticipants.length}</p>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Format Output</h5>
                                    <p className="text-xl font-black text-gray-900">ZIP (PNG)</p>
                                </div>
                            </div>

                            <button
                                onClick={handleBulkGenerate}
                                disabled={!templateConfig || isGenerating}
                                className="w-full py-4 bg-gradient-to-r from-red-600 to-purple-600 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-red-500/20 transition-all disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2 transform active:scale-95"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Menerbitkan...
                                    </>
                                ) : (
                                    <>
                                        <Award size={20} />
                                        Terbitkan & Unduh Semua
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
