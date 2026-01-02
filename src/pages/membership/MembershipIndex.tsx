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

import { useAuth } from '../../hooks/useAuth';

export default function MembershipIndex() {
  const { user } = useAuth();
  const isAdmin = user?.roles?.some(r => r.name.toLowerCase() === 'admin' || r.name.toLowerCase() === 'superadmin') || false;
  const isRedaktur = user?.roles?.some(r => r.name.toLowerCase() === 'redaktur') || false;
  const isAuthor = user?.roles?.some(r => r.name.toLowerCase() === 'author') || false;

  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    user_id: '',
    type: 'free',
    status: 'active'
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
      if (isEdit && selectedId) {
        await api.put(`/memberships/${selectedId}`, formData);
      } else {
        await api.post('/memberships', formData);
      }
      setIsModalOpen(false);
      fetchMemberships();
      resetForm();
    } catch (error: any) {
      alert('Failed to save: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (m: Membership) => {
    setIsEdit(true);
    setSelectedId(m.id);
    setFormData({
      user_id: m.user_id.toString(),
      type: m.type,
      status: m.status || 'active'
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsEdit(false);
    setSelectedId(null);
    setFormData({ user_id: '', type: 'free', status: 'active' });
  };

  const handleJoin = async (type: string) => {
    if (!confirm(`Join ${type} membership?`)) return;
    try {
      await api.post('/memberships', {
        user_id: user?.id,
        type: type,
        status: 'active'
      });
      alert('Congratulations! You have joined the ' + type + ' membership.');
      fetchMemberships();
    } catch (error: any) {
      alert('Failed to join: ' + (error.response?.data?.message || error.message));
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

  // Render Author View (Tiered Cards)
  if (isAuthor) {
    const currentMembership = memberships.find(m => m.user_id === user?.id);

    const pricingPlans = [
      {
        type: 'free',
        name: 'Basic',
        price: 'Free',
        color: 'from-blue-500 to-indigo-600',
        features: ['Standard Dashboard access', 'Limited storage', 'Community support', 'Basic reports']
      },
      {
        type: 'premium',
        name: 'Advanced',
        price: '$25',
        period: 'PER MONTH',
        color: 'from-purple-600 to-indigo-700',
        popular: true,
        features: ['Full Dashboard access', '10GB storage', 'Priority email support', 'Advanced analytics', 'Custom branding']
      },
      {
        type: 'vip',
        name: 'Pro',
        price: '$35',
        period: 'PER MONTH',
        color: 'from-purple-800 to-indigo-900',
        features: ['Everything in Advanced', 'Unlimited storage', '24/7 Phone support', 'Dedicated account manager', 'Early access to features']
      }
    ];

    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Membership Plans</h1>
          <p className="text-xl text-gray-600">Choose the perfect plan for your needs and start creating today.</p>
          {currentMembership && (
            <div className="mt-6 inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-bold border border-green-100">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              You are currently a <span className="uppercase">{currentMembership.type}</span> member
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => {
            const isCurrent = currentMembership?.type === plan.type;
            return (
              <div key={plan.type} className={`relative flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:-translate-y-2 border border-blue-50/50 ${plan.popular ? 'ring-4 ring-purple-500/20 scale-105 z-10' : ''} ${isCurrent ? 'ring-4 ring-green-500/20' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 right-0 mt-4 mr-4">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-white/30">Most Popular</span>
                  </div>
                )}

                <div className={`p-10 bg-gradient-to-br ${plan.color} text-white`}>
                  <div className="flex justify-between items-baseline mb-4">
                    <h2 className="text-2xl font-bold tracking-tight">{plan.name}</h2>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-6xl font-black tracking-tighter">{plan.price}</span>
                    {plan.period && <span className="text-white/70 font-bold text-xs uppercase tracking-widest ml-1">{plan.period}</span>}
                  </div>
                </div>

                <div className="flex-1 p-10">
                  <ul className="space-y-5 mb-10">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-4 text-gray-600">
                        <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-xl flex items-center justify-center ${plan.popular ? 'bg-purple-100' : 'bg-blue-100'}`}>
                          <svg className={`w-4 h-4 ${plan.popular ? 'text-purple-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => !isCurrent && handleJoin(plan.type)}
                    disabled={isCurrent}
                    className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95 ${isCurrent
                        ? 'bg-green-100 text-green-700 cursor-default shadow-none border-2 border-green-200'
                        : plan.popular
                          ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200'
                          : 'bg-gray-900 text-white hover:bg-black shadow-gray-200'
                      }`}
                  >
                    {isCurrent ? 'Your Current Plan' : currentMembership ? 'Upgrade Plan' : 'Get Started Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Admin & Redaktur View (Table)
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Membership Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage user membership statuses and types</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-200"
          >
            <Plus size={20} />
            <span>Assign Membership</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              {(isAdmin || isRedaktur) && <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-gray-500">Loading data...</span>
                </div>
              </td></tr>
            ) : memberships.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-12 text-gray-500">No memberships found</td></tr>
            ) : (
              memberships.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold uppercase">
                        {m.user?.username.substring(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{m.user?.username}</div>
                        <div className="text-xs text-gray-500">{m.user?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter
                                            ${m.type === 'vip' ? 'bg-purple-100 text-purple-700' :
                        m.type === 'premium' ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'}`}>
                      {m.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase
                                            ${m.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${m.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      {m.status || 'active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() => handleEdit(m)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(m.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 italic">View Only</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">{isEdit ? 'Update Membership' : 'Assign Membership'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">User</label>
                <select
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600 transition-all bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={formData.user_id}
                  onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                  required
                  disabled={isEdit}
                >
                  <option value="">Select User</option>
                  {users?.map(u => (
                    <option key={u.id} value={u.id}>{u.username} ({u.email})</option>
                  ))}
                </select>
                {isEdit && <p className="text-[10px] text-gray-400 mt-1 italic">User cannot be changed during edit</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600 transition-all bg-gray-50"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                    <option value="vip">VIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-100 focus:border-red-600 transition-all bg-gray-50"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-red-600 text-white py-4 rounded-xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-100">
                {isEdit ? 'Update Membership' : 'Save Membership'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
