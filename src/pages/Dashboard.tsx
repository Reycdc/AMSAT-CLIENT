import { useEffect, useState } from 'react';
import api from '../services/api';
import { Users, FileText, MessageSquare, Heart } from 'lucide-react';

interface Stats {
  counts: {
    users: number;
    contents: number;
    comments: number;
    likes: number;
  };
  income: number;
  recent_content: any[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard-stats');
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats?.counts.users || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Content</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats?.counts.contents || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <MessageSquare size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Comments</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats?.counts.comments || 0}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-xl">
            <Heart size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Likes</p>
            <h3 className="text-2xl font-bold text-gray-900">{stats?.counts.likes || 0}</h3>
          </div>
        </div>
      </div>

      {/* Recent Content Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Recent Content</h3>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {stats?.recent_content.map((content: any) => (
              <tr key={content.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{content.title}</td>
                <td className="px-6 py-4 text-gray-500">{content.user?.username || 'Unknown'}</td>
                <td className="px-6 py-4 text-gray-500">{new Date(content.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {(!stats?.recent_content || stats.recent_content.length === 0) && (
              <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-500">No recent content</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
