import { Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { getUserRolePath } from '../utils/roleUtils';

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { role } = useParams<{ role: string }>(); // Get role from URL

  // Fallback if role is missing (shouldn't happen due to Guard)
  const currentRole = role || getUserRolePath(user);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isSertifikatOpen, setIsSertifikatOpen] = useState(false);


  // Helper to check if route is active
  const isActive = (path: string) => location.pathname.startsWith(path);

  // Check if user has admin role
  const isAdmin = user?.roles?.some(role => role.name.toLowerCase() === 'admin' || role.name.toLowerCase() === 'superadmin') || false;

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout();
    }
  };

  // Determine menu label based on current role
  const getMenuLabel = () => {
    switch (currentRole) {
      case 'admin':
      case 'superadmin':
        return 'Admin Menu';
      case 'redaktur':
        return 'Redaktur Menu';
      case 'author':
        return 'Author Menu';
      default:
        return 'User Menu';
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
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{getMenuLabel()}</h3>
        </div>

        <ul className="space-y-1">
          <li>
            <Link to={`/${currentRole}`}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${location.pathname === `/${currentRole}`
                ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
                }`}>
              <svg className={`w-5 h-5 ${location.pathname === `/${currentRole}` ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="font-medium text-sm">Dashboard</span>
            </Link>
          </li>
          {isAdmin && (
            <ul className="space-y-1">
              <li>
                <Link to={`/${currentRole}/users`}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(`/${currentRole}/users`)
                    ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                  <svg className={`w-5 h-5 ${isActive(`/${currentRole}/users`) ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium text-sm">Users</span>
                </Link>
              </li>
            </ul>
          )}

          {(isAdmin || user?.roles?.some(r => ['author', 'redaktur'].includes(r.name.toLowerCase()))) && (
            <li>
              <Link to={`/${currentRole}/membership`}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(`/${currentRole}/membership`)
                  ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                <svg className={`w-5 h-5 ${isActive(`/${currentRole}/membership`) ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="font-medium text-sm">Membership</span>
              </Link>
            </li>
          )}
          <li>
            <Link to={`/${currentRole}/content`}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(`/${currentRole}/content`)
                ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
                }`}>
              <svg className={`w-5 h-5 ${isActive(`/${currentRole}/content`) ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="font-medium text-sm">Content</span>
            </Link>
          </li>

          {isAdmin && (
            <ul className="space-y-1">
              <li>
                <Link to={`/${currentRole}/events`}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(`/${currentRole}/events`)
                    ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                  <svg className={`w-5 h-5 ${isActive(`/${currentRole}/events`) ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium text-sm">Events</span>
                </Link>
              </li>
              <li>
                <Link to={`/${currentRole}/gallery`}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(`/${currentRole}/gallery`)
                    ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                  <svg className={`w-5 h-5 ${isActive(`/${currentRole}/gallery`) ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium text-sm">Gallery</span>
                </Link>
              </li>
              <li>
                <Link to={`/${currentRole}/banners`}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(`/${currentRole}/banners`)
                    ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                  <svg className={`w-5 h-5 ${isActive(`/${currentRole}/banners`) ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  <span className="font-medium text-sm">Banners</span>
                </Link>
              </li>
              <li>
                <Link to={`/${currentRole}/categories`}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(`/${currentRole}/categories`)
                    ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                  <svg className={`w-5 h-5 ${isActive(`/${currentRole}/categories`) ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="font-medium text-sm">Categories</span>
                </Link>
              </li>
            </ul>
          )}

          {/* Message Dropdown */}
          <li>
            <button
              onClick={() => setIsMessageOpen(!isMessageOpen)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(`/${currentRole}/message`)
                ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <svg className={`w-5 h-5 ${isActive(`/${currentRole}/message`) ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-medium text-sm flex-1 text-left">Message</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${isMessageOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Message Submenu */}
            <div className={`overflow-hidden transition-all duration-200 ${isMessageOpen ? 'max-h-48 mt-1' : 'max-h-0'}`}>
              <ul className="ml-4 space-y-1 border-l-2 border-gray-100 pl-4">
                <li>
                  <Link
                    to={`/${currentRole}/message/inbox`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${location.pathname === `/${currentRole}/message/inbox`
                      ? 'bg-red-50 text-red-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    Kotak Masuk
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${currentRole}/message/sent`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${location.pathname === `/${currentRole}/message/sent`
                      ? 'bg-red-50 text-red-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Terkirim
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${currentRole}/message/draft`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${location.pathname === `/${currentRole}/message/draft`
                      ? 'bg-red-50 text-red-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Draft
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/${currentRole}/message/compose`}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${location.pathname === `/${currentRole}/message/compose`
                      ? 'bg-red-50 text-red-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Buat
                  </Link>
                </li>
              </ul>
            </div>
          </li>



          {/* Sertifikat Dropdown */}
          {isAdmin && (
            <li>
              <button
                onClick={() => setIsSertifikatOpen(!isSertifikatOpen)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(`/${currentRole}/sertifikat`)
                  ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className={`w-5 h-5 ${isActive(`/${currentRole}/sertifikat`) ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span className="font-medium text-sm flex-1 text-left">Sertifikat</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isSertifikatOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className={`overflow-hidden transition-all duration-200 ${isSertifikatOpen ? 'max-h-40 mt-1' : 'max-h-0'}`}>
                <ul className="ml-4 space-y-1 border-l-2 border-gray-100 pl-4">
                  <li>
                    <Link
                      to={`/${currentRole}/sertifikat/create`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${location.pathname === `/${currentRole}/sertifikat/create`
                        ? 'bg-red-50 text-red-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Create Sertifikat
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/${currentRole}/sertifikat/events`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${location.pathname === `/${currentRole}/sertifikat/events`
                        ? 'bg-red-50 text-red-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      List Event
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`/${currentRole}/sertifikat/participants`}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${location.pathname === `/${currentRole}/sertifikat/participants`
                        ? 'bg-red-50 text-red-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      List Peserta
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          )}

          {/* Article Menu */}
          <li>
            <Link to={`/${currentRole}/article`}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(`/${currentRole}/article`)
                ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
                }`}>
              <svg className={`w-5 h-5 ${isActive(`/${currentRole}/article`) ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="font-medium text-sm">Article Repository</span>
            </Link>
          </li>

          {isAdmin && (
            <li>
              <Link to={`/${currentRole}/menus`}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive(`/${currentRole}/menus`)
                  ? 'bg-gradient-to-r from-red-50 to-red-100 text-red-600 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                <svg className={`w-5 h-5 ${isActive(`/${currentRole}/menus`) ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="font-medium text-sm">Menus</span>
              </Link>
            </li>
          )}
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
