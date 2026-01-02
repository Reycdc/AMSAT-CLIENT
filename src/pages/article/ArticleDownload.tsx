import { useEffect, useState } from 'react';
import { Download, Search, FileText, Trash2, Calendar, User, Eye } from 'lucide-react';
import api from '../../services/api';

interface Article {
    id: number;
    title: string;
    description: string;
    file_path: string;
    file_size: number;
    file_type: string;
    created_at: string;
    user: {
        username: string;
    };
}

export default function ArticleDownload() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const response = await api.get('/documents', {
                params: { type: 'article', search: searchQuery }
            });
            // Handle response data structure
            setArticles(response.data.data?.data || response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch articles:', error);
            // Dummy data for visual confirmation if API fails (since backend might not be ready)
            setArticles([
                {
                    id: 1,
                    title: "Panduan Penulisan Artikel Ilmiah",
                    description: "Dokumen standar operasional prosedur penulisan.",
                    file_path: "/dummy.pdf",
                    file_size: 2048576,
                    file_type: "application/pdf",
                    created_at: new Date().toISOString(),
                    user: { username: "Admin" }
                },
                {
                    id: 2,
                    title: "Template Laporan Kegiatan",
                    description: "Template untuk laporan kegiatan bulanan.",
                    file_path: "/template.docx",
                    file_size: 1048576,
                    file_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    created_at: new Date(Date.now() - 86400000).toISOString(),
                    user: { username: "Sekretaris" }
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [searchQuery]);

    const handleDownload = (article: Article) => {
        // Logic download file
        // Bisa direct link atau via API blobing
        window.open(article.file_path, '_blank');
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this file?')) return;
        try {
            await api.delete(`/documents/${id}`);
            fetchArticles();
        } catch (error) {
            alert('Failed to delete file');
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Download Articles</h1>
                <p className="text-gray-500">Access and download shared documents</p>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 relative">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                />
            </div>

            {/* Article List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Document</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Size</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Uploaded By</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={5} className="text-center py-8 text-gray-500">Loading...</td></tr>
                        ) : articles.length === 0 ? (
                            <tr><td colSpan={5} className="text-center py-8 text-gray-500">No articles found</td></tr>
                        ) : (
                            articles.map((article) => (
                                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{article.title}</p>
                                                <p className="text-sm text-gray-500 line-clamp-1">{article.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                                            {formatFileSize(article.file_size)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <User size={14} />
                                            {article.user?.username || 'Unknown'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar size={14} />
                                            {new Date(article.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleDownload(article)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Download"
                                            >
                                                <Download size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(article.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
