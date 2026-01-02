import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { ChevronLeft, Save, Image as ImageIcon } from 'lucide-react';

export default function ContentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [menus, setMenus] = useState<any[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    isi: '',
    date: new Date().toISOString().split('T')[0],
    menu_id: '',
    cover: null as File | null
  });

  useEffect(() => {
    fetchMenus();
    if (isEdit) fetchContent();
  }, [id]);

  const fetchMenus = async () => {
    try {
      const response = await api.get('/menus/flat');
      setMenus(response.data.data);
    } catch (error) {
      console.error('Failed to fetch menus');
    }
  };

  const fetchContent = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/content/${id}`);
      const data = response.data.data;
      setFormData({
        title: data.title,
        isi: data.isi,
        date: data.date.split('T')[0],
        menu_id: data.menu_id,
        cover: null
      });
      // Handle existing cover logic if needed
    } catch (error) {
      console.error('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('isi', formData.isi);
    data.append('date', formData.date);
    data.append('menu_id', formData.menu_id);
    if (formData.cover) {
      data.append('cover', formData.cover);
    }
    if (isEdit) {
      data.append('_method', 'PUT'); // Axios PUT with FormData workaround
    }

    try {
      if (isEdit) {
        await api.post(`/content/${id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/content', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/admin/content');
    } catch (error: any) {
      alert('Failed to save: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, cover: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Content' : 'Create Content'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category (Menu)</label>
            <select
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500"
              value={formData.menu_id}
              onChange={(e) => setFormData({ ...formData, menu_id: e.target.value })}
            >
              <option value="">Select Category</option>
              {menus.map((menu: any) => (
                <option key={menu.id} value={menu.id}>{menu.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <textarea
            required
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 font-mono text-sm"
            value={formData.isi}
            onChange={(e) => setFormData({ ...formData, isi: e.target.value })}
            placeholder="Write your content here (Markdown/HTML supported)..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition-colors relative cursor-pointer">
            <input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />

            {preview ? (
              <img src={preview} alt="Preview" className="h-48 mx-auto object-contain" />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <ImageIcon size={48} className="mb-2" />
                <span className="text-sm">Click to upload cover image</span>
              </div>
            )}
          </div>
          {formData.cover && <p className="text-xs text-gray-500 mt-2">Selected: {formData.cover.name}</p>}
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mr-4 px-6 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50"
          >
            <Save size={20} />
            <span>{loading ? 'Saving...' : 'Save Content'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
