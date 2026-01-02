import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Trash2, X } from 'lucide-react';

interface Membership {
  id: number;
  user_id: number;
  type: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
  start_date?: string;
  end_date?: string;
  status?: string;
}

export default function MembershipIndex() {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]); // For selecting user
  const [formData, setFormData] = useState({
    user_id: '',
    type: 'free'
  });

  const fetchMemberships = async () => {
    setLoading(true);
    try {
      const response = await api.get('/memberships');
      const data = response.data.data || [];
      setMemberships(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setMemberships([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      // API returns paginated data
      const userData = response.data.data?.data || response.data.data || [];
      setUsers(Array.isArray(userData) ? userData : []);
    } catch (error) {
      console.error(error);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchMemberships();
    fetchUsers();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/memberships', formData);
      setIsModalOpen(false);
      fetchMemberships();
    } catch (error: any) {
      alert('Failed to save: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete membership?")) return;
    try {
      await api.delete(`/memberships/${id}`);
      fetchMemberships();
    } catch (error) {
      alert("Failed to delete");
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Membership Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-200"
        >
          <Plus size={20} />
          <span>Assign Membership</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={3} className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : memberships.length === 0 ? (
              <tr><td colSpan={3} className="text-center py-8 text-gray-500">No memberships found</td></tr>
            ) : (
              memberships.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{m.user?.username}</div>
                    <div className="text-xs text-gray-500">{m.user?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                                            ${m.type === 'vip' ? 'bg-purple-100 text-purple-800' :
                        m.type === 'premium' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                      {m.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(m.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Assign Membership</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-100"
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  required
                >
                  <option value="">Select User</option>
                  {users?.map(u => (
                    <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-red-100"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="free">Free</option>
                  <option value="premium">Premium</option>
                  <option value="vip">VIP</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
