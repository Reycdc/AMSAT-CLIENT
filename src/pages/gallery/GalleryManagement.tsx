import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Trash2, X, Image, Eye, Edit } from 'lucide-react';

interface Gallery {
  id: number;
  title: string;
  description?: string;
  image: string;
  created_at: string;
}

export default function GalleryManagement() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<Gallery | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null as File | null
  });

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const response = await api.get('/galleries');
      setGalleries(response.data.data);
    } catch (error) {
      console.error('Failed to fetch galleries', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  const openModal = (mode: 'create' | 'edit', gallery?: Gallery) => {
    setModalMode(mode);
    if (mode === 'edit' && gallery) {
      setSelectedGallery(gallery);
      setFormData({
        title: gallery.title,
        description: gallery.description || '',
        image: null
      });
    } else {
      setSelectedGallery(null);
      setFormData({ title: '', description: '', image: null });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      if (formData.description) data.append('description', formData.description);
      if (formData.image) data.append('image', formData.image);

      if (modalMode === 'create') {
        await api.post('/galleries', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else if (selectedGallery) {
        data.append('_method', 'PUT');
        await api.post(`/galleries/${selectedGallery.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setIsModalOpen(false);
      fetchGalleries();
    } catch (error: any) {
      alert('Failed to save: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this gallery item?')) return;
    try {
      await api.delete(`/galleries/${id}`);
      fetchGalleries();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const openPreview = (gallery: Gallery) => {
    setPreviewImage(gallery);
    setIsPreviewOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-500">Manage your photo gallery</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-200"
        >
          <Plus size={20} />
          <span>Add Image</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading gallery...</div>
      ) : galleries.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl border border-gray-100">
          <Image size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No images in gallery</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleries.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="aspect-square bg-gray-100">
                <img
                  src={`http://127.0.0.1:8000/storage/${item.image}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold truncate">{item.title}</h3>
                  {item.description && (
                    <p className="text-white/70 text-sm truncate">{item.description}</p>
                  )}
                </div>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openPreview(item)}
                  className="p-2 bg-white/90 rounded-lg hover:bg-white transition shadow-sm"
                >
                  <Eye size={16} className="text-gray-700" />
                </button>
                <button
                  onClick={() => openModal('edit', item)}
                  className="p-2 bg-white/90 rounded-lg hover:bg-white transition shadow-sm"
                >
                  <Edit size={16} className="text-blue-600" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-white/90 rounded-lg hover:bg-white transition shadow-sm"
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">{modalMode === 'create' ? 'Add New Image' : 'Edit Image'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-100"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-100"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image {modalMode === 'edit' && '(Leave empty to keep current)'}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-100"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  required={modalMode === 'create'}
                />
              </div>
              <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition">
                {modalMode === 'create' ? 'Upload Image' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={() => setIsPreviewOpen(false)}>
          <div className="max-w-4xl w-full">
            <img
              src={`http://127.0.0.1:8000/storage/${previewImage.image}`}
              alt={previewImage.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="text-center mt-4">
              <h3 className="text-white text-xl font-semibold">{previewImage.title}</h3>
              {previewImage.description && (
                <p className="text-white/70 mt-1">{previewImage.description}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
          >
            <X size={24} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
