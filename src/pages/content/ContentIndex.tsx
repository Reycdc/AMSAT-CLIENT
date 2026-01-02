import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { Plus, Edit, Trash2, Search, CheckCircle, XCircle } from 'lucide-react';

interface Content {
  id: number;
  title: string;
  date: string;
  user: { username: string };
  menu?: { name: string };
  categories: { name: string }[];
  status: 'Pending' | 'Accept' | 'Reject';
  redaktur?: { username: string };
  has_read: number;
}

export default function ContentIndex() {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>();

  const search = searchParams.get('search') || '';

  const fetchContent = async () => {
    setLoading(true);
    try {
      const params = { search, mode: 'dashboard' };
      const response = await api.get('/content', { params });
      setContents(response.data.data.data); // Pagination nested data
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [search]);

  const handleStatusChange = async (id: number, status: 'Accept' | 'Reject') => {
    if (!confirm(`Are you sure you want to ${status} this content?`)) return;
    try {
      await api.post(`/content/${id}/verify`, { status });
      fetchContent();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this content?')) return;
    try {
      await api.delete(`/content/${id}`);
      fetchContent();
    } catch (error) {
      alert('Failed to delete content');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
        <button
          onClick={() => navigate(`/${role}/content/create`)}
          className="flex items-center gap-2 bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 transition shadow-lg shadow-red-200"
        >
          <Plus size={20} />
          <span>Create Content</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search content..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-red-500"
            value={search}
            onChange={(e) => setSearchParams({ search: e.target.value })}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Title</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Author</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Type/Menu</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">Loading...</td></tr>
            ) : contents.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-gray-500">No content found</td></tr>
            ) : (
              contents.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 line-clamp-1">{item.title}</div>
                    <div className="text-xs mt-1 flex items-center gap-2">
                      {item.status === 'Accept' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          Verified {item.redaktur && `by ${item.redaktur.username}`}
                        </span>
                      )}
                      {item.status === 'Pending' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                          Pending Approval
                        </span>
                      )}
                      {item.status === 'Reject' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          Rejected
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.user?.username}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      {item.menu?.name || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(item.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    {/* Redaktur/Admin Actions */}
                    {(role === 'admin' || role === 'redaktur') && (
                      <>
                        {item.status !== 'Accept' && (
                          <button
                            onClick={() => handleStatusChange(item.id, 'Accept')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Approve"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        {item.status !== 'Reject' && (
                          <button
                            onClick={() => handleStatusChange(item.id, 'Reject')}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                        <div className="w-px h-6 bg-gray-200 mx-1"></div>
                      </>
                    )}

                    <button
                      onClick={() => navigate(`/${role}/content/edit/${item.id}`)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
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
    </div>
  );
}
