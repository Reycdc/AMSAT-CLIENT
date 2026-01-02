import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import GuestGuard from './components/GuestGuard';
import RoleRouteGuard from './components/RoleRouteGuard'; // Correctly imported
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

// Message Pages
import Inbox from './pages/message/Inbox';
import Sent from './pages/message/Sent';
import Draft from './pages/message/Draft';
import Compose from './pages/message/Compose';

// Sertifikat Pages
import CreateSertifikat from './pages/certificates/CreateSertifikat';
import EventsList from './pages/certificates/EventsList';
import ParticipantsList from './pages/certificates/ParticipantsList';
import ArticleRepository from './pages/article/ArticleRepository';
import CertificateOffer from './pages/certificates/CertificateOffer';

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

          {/* Dynamic Role-Based Routes */}
          <Route path="/:role" element={
            <ProtectedRoute>
              <RoleRouteGuard>
                <DashboardLayout />
              </RoleRouteGuard>
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
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

            {/* Message Routes */}
            <Route path="message/inbox" element={<Inbox />} />
            <Route path="message/sent" element={<Sent />} />
            <Route path="message/draft" element={<Draft />} />
            <Route path="message/compose" element={<Compose />} />

            {/* Sertifikat Routes */}
            <Route path="sertifikat/create" element={<CreateSertifikat />} />
            <Route path="sertifikat/events" element={<EventsList />} />
            <Route path="sertifikat/participants" element={<ParticipantsList />} />
            <Route path="certificate-offer" element={<CertificateOffer />} />

            {/* Article Routes */}
            <Route path="article" element={<ArticleRepository />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
