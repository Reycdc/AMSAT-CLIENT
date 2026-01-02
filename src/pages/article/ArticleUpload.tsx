import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export default function ArticleUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) return;

        setIsUploading(true);
        setStatus('idle');

        // Create FormData
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('type', 'article'); // Identifikasi tipe file

        try {
            // Endpoint yang disesuaikan, misal /api/documents atau /api/upload
            // Sesuaikan dengan endpoint backend yang tersedia atau buat baru
            await api.post('/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setStatus('success');
            setMessage('Article uploaded successfully!');
            setFile(null);
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Upload failed:', error);
            setStatus('error');
            setMessage('Failed to upload article. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Article</h1>
                <p className="text-gray-500">Upload new articles or documents to the repository</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                {status === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-2">
                        <CheckCircle size={20} />
                        {message}
                    </div>
                )}

                {status === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2">
                        <AlertCircle size={20} />
                        {message}
                    </div>
                )}

                <form onSubmit={handleUpload} className="space-y-6">
                    {/* File input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Article File (PDF, DOCX)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-red-500 transition-colors text-center cursor-pointer relative">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {file ? (
                                <div className="flex flex-col items-center">
                                    <FileText size={48} className="text-red-500 mb-2" />
                                    <p className="font-medium text-gray-900">{file.name}</p>
                                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Upload size={48} className="text-gray-300 mb-2" />
                                    <p className="font-medium text-gray-900">Click to browse or drag file here</p>
                                    <p className="text-sm text-gray-500">Supported formats: PDF, DOC, DOCX</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Title input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter article title"
                            required
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                        />
                    </div>

                    {/* Description input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description (Optional)
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of the article..."
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={!file || !title || isUploading}
                            className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                        >
                            {isUploading ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload size={20} />
                                    Upload Article
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
