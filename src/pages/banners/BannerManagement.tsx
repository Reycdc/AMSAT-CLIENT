import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Trash2, X, Image, ToggleLeft, ToggleRight } from 'lucide-react';

interface Banner {
  id: number;
  gambar: string;
  status: boolean;
  created_at: string;
}

export default function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    gambar: null as File | null,
    status: true
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await api.get('/banners');
      setBanners(response.data.data);
    } catch (error) {
      console.error('Failed to fetch banners', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = new FormData();
      if (formData.gambar) data.append('gambar', formData.gambar);
      data.append('status', formData.status ? '1' : '0');

      await api.post('/banners', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setIsModalOpen(false);
      setFormData({ gambar: null, status: true });
      fetchBanners();
    } catch (error: any) {
      alert('Failed to save: ' + (error.response?.data?.message || error.message));
    }
  };

  const toggleStatus = async (banner: Banner) => {
    try {
      const data = new FormData();
      data.append('_method', 'PUT');
      data.append('status', banner.status ? '0' : '1');

      await api.post(`/banners/${banner.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchBanners();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this banner?')) return;
    try {
      await api.delete(`/banners/${id}`);
      fetchBanners();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
          <p className="text-gray-500">Manage homepage banners</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-200"
        >
          <Plus size={20} />
          <span>Add Banner</span>
        </button>
      </div>

      {/* Active Banners Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Active Banners Preview</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {banners.filter(b => b.status).length === 0 ? (
            <div className="text-gray-500 text-sm">No active banners</div>
          ) : (
            banners.filter(b => b.status).map(banner => (
              <div key={banner.id} className="flex-shrink-0 w-48 h-24 rounded-lg overflow-hidden border-2 border-green-500">
                <img
                  src={`http://127.0.0.1:8000/storage/${banner.gambar}`}
                  alt="Banner"
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Banner List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Preview</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Created</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : banners.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-gray-500">
                <Image size={48} className="mx-auto mb-4 text-gray-300" />
                No banners found
              </td></tr>
            ) : (
              banners.map((banner) => (
                <tr key={banner.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="w-32 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={`http://127.0.0.1:8000/storage/${banner.gambar}`}
                        alt="Banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(banner)}
                      className="flex items-center gap-2"
                    >
                      {banner.status ? (
                        <>
                          <ToggleRight size={28} className="text-green-500" />
                          <span className="text-sm font-medium text-green-600">Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={28} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-500">Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(banner.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="inline-flex p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Add New Banner</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-100"
                  onChange={(e) => setFormData({ ...formData, gambar: e.target.files?.[0] || null })}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Recommended: 1920x600 pixels</p>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: !formData.status })}
                  className="flex items-center gap-2"
                >
                  {formData.status ? (
                    <>
                      <ToggleRight size={28} className="text-green-500" />
                      <span className="text-sm text-green-600">Active</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft size={28} className="text-gray-400" />
                      <span className="text-sm text-gray-500">Inactive</span>
                    </>
                  )}
                </button>
              </div>
              <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition">
                Upload Banner
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
