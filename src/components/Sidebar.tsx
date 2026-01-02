import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Helper to check if route is active
  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  return (
    <aside className="w-64 bg-white shadow-xl flex flex-col overflow-hidden h-full">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-200">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
          </div>
          <div>
            <span className="text-xl font-bold text-gray-800 block leading-none">AMSAT-ID</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <div className="px-3 mb-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Admin Menu</h3>
        </div>

        <ul className="space-y-1">
          <li>
            <Link to="/admin/dashboard"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/admin/dashboard')
                ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
                }`}>
              <svg className={`w-5 h-5 ${isActive('/admin/dashboard') ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="font-medium text-sm">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/users"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/admin/users')
                ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
                }`}>
              <svg className={`w-5 h-5 ${isActive('/admin/users') ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-medium text-sm">Users</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/membership"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/admin/membership')
                ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
                }`}>
              <svg className={`w-5 h-5 ${isActive('/admin/membership') ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="font-medium text-sm">Membership</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/content"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/admin/content')
                ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
                }`}>
              <svg className={`w-5 h-5 ${isActive('/admin/content') ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="font-medium text-sm">Content</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/events"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/admin/events')
                ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
                }`}>
              <svg className={`w-5 h-5 ${isActive('/admin/events') ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-sm">Events</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/gallery"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/admin/gallery')
                ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
                }`}>
              <svg className={`w-5 h-5 ${isActive('/admin/gallery') ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-sm">Gallery</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/banners"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/admin/banners')
                ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
                }`}>
              <svg className={`w-5 h-5 ${isActive('/admin/banners') ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              <span className="font-medium text-sm">Banners</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/categories"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/admin/categories')
                ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
                }`}>
              <svg className={`w-5 h-5 ${isActive('/admin/categories') ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <span className="font-medium text-sm">Categories</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/menus"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive('/admin/menus')
                ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
                }`}>
              <svg className={`w-5 h-5 ${isActive('/admin/menus') ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span className="font-medium text-sm">Menus</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group" onClick={handleLogout}>
          <div className="relative">
            {user?.thumbnail ? (
              <img src={user.thumbnail} alt={user.username} className="w-10 h-10 rounded-xl object-cover" />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.username || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.roles?.[0]?.name || 'Member'}</p>
          </div>

          <button className="text-gray-400 hover:text-red-600 transition-colors" title="Logout">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
