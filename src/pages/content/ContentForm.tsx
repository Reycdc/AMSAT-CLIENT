import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { ChevronLeft, Save, Image as ImageIcon, X } from 'lucide-react';
import { getUserRolePath } from '../../utils/roleUtils';
import { useAuth } from '../../hooks/useAuth';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Menu {
  id: number;
  title?: string;
  label?: string;
  name?: string;
}

export default function ContentForm() {
  const { id, role } = useParams<{ id?: string; role: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    isi: '',
    date: new Date().toISOString().split('T')[0],
    menu_id: '',
    cover: null as File | null,
    status: 'Pending' as 'Pending' | 'Accept' | 'Reject'
  });

  useEffect(() => {
    fetchMenus();
    fetchCategories();
    if (isEdit) fetchContent();
  }, [id]);

  const fetchMenus = async () => {
    try {
      const response = await api.get('/menus/flat');
      setMenus(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch menus:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
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
        menu_id: data.menu_id?.toString() || '',
        cover: null,
        status: data.status || 'Pending'
      });
      // Set selected categories if available
      if (data.categories) {
        setSelectedCategories(data.categories.map((c: any) => c.id));
      }
    } catch (error) {
      console.error('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('isi', formData.isi);
    data.append('date', formData.date);
    data.append('menu_id', formData.menu_id);

    // Only append status if role is admin/redaktur
    if (role === 'admin' || role === 'redaktur') {
      data.append('status', formData.status);
    }

    // Append categories as array
    selectedCategories.forEach(catId => {
      data.append('category_ids[]', catId.toString());
    });

    if (formData.cover) {
      data.append('cover', formData.cover);
    }
    if (isEdit) {
      data.append('_method', 'PUT');
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

      const currentRole = role || getUserRolePath(user);
      navigate(`/${currentRole}/content`);

    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.errors?.menu_id?.[0] ||
        error.response?.data?.errors?.cover?.[0] ||
        'Unknown error';
      alert('Failed to save: ' + errorMessage);
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Menu</label>
            <select
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500"
              value={formData.menu_id}
              onChange={(e) => setFormData({ ...formData, menu_id: e.target.value })}
            >
              <option value="">Select Menu</option>
              {menus.map((menu) => (
                <option key={menu.id} value={menu.id}>
                  {menu.label || menu.title || menu.name}
                </option>
              ))}
            </select>
            {menus.length === 0 && (
              <p className="text-xs text-amber-600 mt-1">No menus available. Please create a menu first.</p>
            )}
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

          {(role === 'admin' || role === 'redaktur') && (
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="Pending">Pending</option>
                <option value="Accept">Verified (Accept)</option>
                <option value="Reject">Rejected</option>
              </select>
            </div>
          )}
        </div>

        {/* Categories Tags Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tags / Categories</label>
          <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg min-h-[50px] bg-gray-50">
            {categories.length === 0 ? (
              <span className="text-sm text-gray-400">No categories available</span>
            ) : (
              categories.map((category) => {
                const isSelected = selectedCategories.includes(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${isSelected
                      ? 'bg-red-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-red-400 hover:text-red-600'
                      }`}
                  >
                    {category.name}
                    {isSelected && <X size={14} />}
                  </button>
                );
              })
            )}
          </div>
          {selectedCategories.length > 0 && (
            <p className="text-xs text-gray-500 mt-1">{selectedCategories.length} tag(s) selected</p>
          )}
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
