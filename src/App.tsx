import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import GuestGuard from './components/GuestGuard';
import DashboardLayout from './layouts/DashboardLayout';
import UserIndex from './pages/users/UserIndex';
import MembershipIndex from './pages/membership/MembershipIndex';
import ContentIndex from './pages/content/ContentIndex';
import ContentForm from './pages/content/ContentForm';
import EventList from './pages/events/EventList';
import EventForm from './pages/events/EventForm';
import GalleryManagement from './pages/gallery/GalleryManagement';
import BannerManagement from './pages/banners/BannerManagement';
import CategoryManagement from './pages/categories/CategoryManagement';
import MenuManagement from './pages/menus/MenuManagement';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* OAuth Callback */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          <Route path="/register" element={
            <GuestGuard>
              <Register />
            </GuestGuard>
          } />
          <Route path="/login" element={
            <GuestGuard>
              <Login />
            </GuestGuard>
          } />

          <Route path="/admin" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserIndex />} />
            <Route path="membership" element={<MembershipIndex />} />
            <Route path="content" element={<ContentIndex />} />
            <Route path="content/create" element={<ContentForm />} />
            <Route path="content/edit/:id" element={<ContentForm />} />
            <Route path="events" element={<EventList />} />
            <Route path="events/create" element={<EventForm />} />
            <Route path="events/edit/:id" element={<EventForm />} />
            <Route path="gallery" element={<GalleryManagement />} />
            <Route path="banners" element={<BannerManagement />} />
            <Route path="categories" element={<CategoryManagement />} />
            <Route path="menus" element={<MenuManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

