import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Trash2, X, Edit, Menu, ChevronRight, GripVertical } from 'lucide-react';

interface MenuItem {
  id: number;
  title: string;
  parent_id: number | null;
  urutan: number;
  children?: MenuItem[];
  parent?: MenuItem;
}

export default function MenuManagement() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [allMenus, setAllMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    parent_id: '',
    urutan: 0
  });

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const response = await api.get('/menus');
      setMenus(response.data.data);
      // Flatten for parent selection
      const flatten = (items: MenuItem[], arr: MenuItem[] = []): MenuItem[] => {
        items.forEach(item => {
          arr.push(item);
          if (item.children) flatten(item.children, arr);
        });
        return arr;
      };
      setAllMenus(flatten(response.data.data));
    } catch (error) {
      console.error('Failed to fetch menus', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const openModal = (mode: 'create' | 'edit', menu?: MenuItem) => {
    setModalMode(mode);
    if (mode === 'edit' && menu) {
      setSelectedMenu(menu);
      setFormData({
        title: menu.title,
        parent_id: menu.parent_id?.toString() || '',
        urutan: menu.urutan
      });
    } else {
      setSelectedMenu(null);
      setFormData({ title: '', parent_id: '', urutan: 0 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        parent_id: formData.parent_id ? parseInt(formData.parent_id) : null,
        urutan: formData.urutan
      };

      if (modalMode === 'create') {
        await api.post('/menus', payload);
      } else if (selectedMenu) {
        await api.put(`/menus/${selectedMenu.id}`, payload);
      }
      setIsModalOpen(false);
      fetchMenus();
    } catch (error: any) {
      alert('Failed to save: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (menu: MenuItem) => {
    const hasChildren = menu.children && menu.children.length > 0;
    if (hasChildren) {
      if (!confirm(`This menu has ${menu.children?.length} sub-menu(s). Delete anyway? (Children will also be deleted)`)) return;
    } else {
      if (!confirm(`Delete menu "${menu.title}"?`)) return;
    }
    try {
      await api.delete(`/menus/${menu.id}`);
      fetchMenus();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => (
    <div key={item.id}>
      <div
        className={`flex items-center justify-between p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition group`}
        style={{ paddingLeft: `${1.5 + level * 1.5}rem` }}
      >
        <div className="flex items-center gap-3">
          <GripVertical size={16} className="text-gray-300 cursor-move" />
          {level > 0 && <ChevronRight size={16} className="text-gray-400" />}
          <div className={`p-1.5 rounded-lg ${level === 0 ? 'bg-red-50' : 'bg-gray-100'}`}>
            <Menu size={16} className={level === 0 ? 'text-red-600' : 'text-gray-500'} />
          </div>
          <div>
            <span className="font-medium text-gray-900">{item.title}</span>
            <span className="ml-2 text-xs text-gray-400">Order: {item.urutan}</span>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => openModal('create', undefined)}
            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition text-xs"
            title="Add sub-menu"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => openModal('edit', item)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => handleDelete(item)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      {item.children && item.children.map(child => renderMenuItem(child, level + 1))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-500">Manage navigation menu structure</p>
        </div>
        <button
          onClick={() => openModal('create')}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-200"
        >
          <Plus size={20} />
          <span>Add Menu</span>
        </button>
      </div>

      {/* Menu Tree */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Menu size={18} />
            Menu Structure
          </h3>
        </div>
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : menus.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Menu size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No menus found</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add Menu" to create your first menu item</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {menus.map(item => renderMenuItem(item))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">{modalMode === 'create' ? 'Add New Menu' : 'Edit Menu'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Menu Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-100"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Home, About, Contact"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Menu (Optional)</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-100"
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                >
                  <option value="">None (Root Menu)</option>
                  {allMenus
                    .filter(m => modalMode === 'edit' ? m.id !== selectedMenu?.id : true)
                    .map(menu => (
                      <option key={menu.id} value={menu.id}>{menu.title}</option>
                    ))
                  }
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-100"
                  value={formData.urutan}
                  onChange={(e) => setFormData({ ...formData, urutan: parseInt(e.target.value) || 0 })}
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>
              <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition">
                {modalMode === 'create' ? 'Create Menu' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
