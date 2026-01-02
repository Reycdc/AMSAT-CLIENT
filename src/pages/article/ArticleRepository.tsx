import { useEffect, useState } from 'react';
import { Search, FileText, Download, Upload, Trash2, Calendar, X } from 'lucide-react';
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

export default function ArticleRepository() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);

    // Upload states
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const response = await api.get('/documents', {
                params: { type: 'article', search: searchQuery }
            });
            setArticles(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch articles:', error);
            alert('Failed to load articles from server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [searchQuery]);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('type', 'article');

        try {
            await api.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            fetchArticles(); // Refresh list
            setShowUploadModal(false);
            // Reset form
            setFile(null);
            setTitle('');
            setDescription('');
            alert('Article uploaded successfully');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload article');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownload = (article: Article) => {
        window.open(article.file_path, '_blank');
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this article?')) return;
        try {
            await api.delete(`/documents/${id}`);
            fetchArticles();
        } catch (error) {
            alert('Failed to delete article');
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
        <div className="max-w-5xl mx-auto">
            {/* Header & Prominent Search (Scholar Style) */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="bg-red-600 text-white p-1 rounded">
                            <FileText size={24} />
                        </span>
                        Article Repository
                    </h1>
                    <button
                        onClick={() => setShowUploadModal(true)}
                        className="bg-red-600 text-white px-6 py-2.5 rounded-full hover:bg-red-700 transition shadow-lg shadow-red-200 flex items-center gap-2 font-medium"
                    >
                        <Upload size={18} />
                        Upload Article
                    </button>
                </div>

                {/* Big Search Bar */}
                <div className="relative max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search articles, authors, or topics..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 shadow-sm text-lg"
                    />
                </div>
            </div>

            {/* Results List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading articles...</div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                        <FileText size={48} className="mx-auto text-gray-300 mb-2" />
                        <p className="text-gray-500">No articles found matching your search.</p>
                    </div>
                ) : (
                    articles.map((article) => (
                        <div key={article.id} className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-blue-700 mb-1 group-hover:underline cursor-pointer" onClick={() => handleDownload(article)}>
                                        {article.title}
                                    </h3>
                                    <p className="text-sm text-green-700 mb-2 font-medium">
                                        {article.user.username} • {new Date(article.created_at).getFullYear()} • AMSAT-ID Repository
                                    </p>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {article.description || 'No description available for this document.'}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <FileText size={12} /> {article.file_type.split('/')[1]?.toUpperCase() || 'FILE'}
                                        </span>
                                        <span>{formatFileSize(article.file_size)}</span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} /> {new Date(article.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 ml-4">
                                    <button
                                        onClick={() => handleDownload(article)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                                        title="Download"
                                    >
                                        <Download size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(article.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                                        title="Delete"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative">
                        <button
                            onClick={() => setShowUploadModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Upload className="text-red-600" size={24} />
                            Upload New Article
                        </h2>

                        <form onSubmit={handleUpload} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
                                    placeholder="Article Title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 resize-none"
                                    rows={3}
                                    placeholder="Brief description..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                                <input
                                    type="file"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    accept=".pdf,.doc,.docx"
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                                    required
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowUploadModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
                                >
                                    {isUploading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
