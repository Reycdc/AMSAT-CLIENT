import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import {
  Satellite, Users, Calendar, Radio, ArrowRight, ExternalLink,
  Mail, MapPin, ChevronDown, Menu, X, Star, Zap, Globe
} from 'lucide-react';

interface Content {
  id: number;
  title: string;
  excerpt?: string;
  thumbnail?: string;
  date: string;
  user?: { username: string };
}

interface Gallery {
  id: number;
  title: string;
  image: string;
}

interface Banner {
  id: number;
  gambar: string;
}

interface Stats {
  counts: {
    users: number;
    contents: number;
    comments: number;
    likes: number;
  };
}

interface MenuItem {
  id: number;
  title: string;
  parent_id: number | null;
  children?: MenuItem[];
}

export default function LandingPage() {
  const [contents, setContents] = useState<Content[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contentsRes, galleriesRes, bannersRes, statsRes, menusRes] = await Promise.all([
          api.get('/content'),
          api.get('/galleries'),
          api.get('/banners?status=1'),
          api.get('/dashboard-stats'),
          api.get('/menus')
        ]);
        setContents(contentsRes.data.data.data?.slice(0, 6) || []);
        setGalleries(galleriesRes.data.data?.slice(0, 8) || []);
        setBanners(bannersRes.data.data || []);
        setStats(statsRes.data.data);
        setMenus(menusRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    };
    fetchData();

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Banner auto-rotate
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  // Build fully dynamic nav from database menus
  const navLinks = [
    { name: 'Home', href: '#hero', children: [] },
    { name: 'About', href: '#about', children: [] },
    // Dynamic menus from database
    ...menus.map(menu => ({
      name: menu.title,
      href: `#menu-${menu.id}`,
      menuId: menu.id,
      children: menu.children || []
    })),
    { name: 'Gallery', href: '#gallery', children: [] },
    { name: 'Contact', href: '#contact', children: [] },
  ];

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/95 backdrop-blur-xl shadow-xl shadow-black/10' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                <Satellite className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">AMSAT-ID</span>
                <span className="text-xs text-gray-400 block">Amateur Satellite Indonesia</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => link.children?.length > 0 && setOpenDropdown(index)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <a
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center gap-1"
                  >
                    {link.name}
                    {link.children?.length > 0 && (
                      <ChevronDown size={14} className={`transition-transform ${openDropdown === index ? 'rotate-180' : ''}`} />
                    )}
                  </a>
                  {/* Dropdown for children */}
                  {link.children?.length > 0 && openDropdown === index && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-slate-900/98 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl py-2 z-50">
                      {link.children.map((child: MenuItem) => (
                        <a
                          key={child.id}
                          href={`#menu-${child.id}`}
                          className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all"
                        >
                          {child.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                to="/login"
                className="ml-4 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-xl hover:from-red-500 hover:to-red-600 transition-all shadow-lg shadow-red-500/30"
              >
                Member Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-900/98 backdrop-blur-xl border-t border-white/10">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <a
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  >
                    {link.name}
                  </a>
                  {/* Sub-menus for mobile */}
                  {link.children?.length > 0 && (
                    <div className="pl-6 space-y-1">
                      {link.children.map((child: MenuItem) => (
                        <a
                          key={child.id}
                          href={`#menu-${child.id}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        >
                          {child.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Link
                to="/login"
                className="block mt-4 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white text-center font-medium rounded-xl"
              >
                Member Login
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          {/* Stars */}
          <div className="absolute inset-0 opacity-50">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-red-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        {/* Banner Carousel Background */}
        {banners.length > 0 && (
          <div className="absolute inset-0 opacity-20">
            <img
              src={`http://127.0.0.1:8000/storage/${banners[currentBanner]?.gambar}`}
              alt="Banner"
              className="w-full h-full object-cover transition-opacity duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/80 to-slate-950" />
          </div>
        )}

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">We Do Satellite Communications, Experiments And Educations</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Amateur Satellite
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
              Indonesia
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Bergabunglah dengan komunitas operator radio amatir Indonesia yang berfokus pada komunikasi satelit, eksperimen, dan edukasi teknologi antariksa.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#about"
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-2xl hover:from-red-500 hover:to-red-600 transition-all shadow-xl shadow-red-500/30 hover:shadow-red-500/50"
            >
              <span>Pelajari Lebih Lanjut</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              to="/register"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <Users className="w-5 h-5" />
              <span>Daftar Sekarang</span>
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-gray-500" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, label: 'Members', value: stats?.counts.users || 0, color: 'from-blue-500 to-cyan-500' },
              { icon: Radio, label: 'Articles', value: stats?.counts.contents || 0, color: 'from-purple-500 to-pink-500' },
              { icon: Calendar, label: 'Events', value: '50+', color: 'from-orange-500 to-red-500' },
              { icon: Globe, label: 'Countries', value: '15+', color: 'from-green-500 to-emerald-500' },
            ].map((stat, i) => (
              <div key={i} className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all hover:transform hover:scale-105">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-full border border-red-500/20 mb-6">
                <Zap className="w-4 h-4 text-red-500" />
                <span className="text-sm font-medium text-red-400">About AMSAT-ID</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Misi Kami di Dunia Antariksa
                </span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                AMSAT Indonesia (AMSAT-ID) adalah organisasi nirlaba yang didedikasikan untuk pengembangan radio amatir melalui komunikasi satelit. Kami memfasilitasi eksperimen, pendidikan, dan kolaborasi internasional dalam bidang teknologi antariksa.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Komunikasi satelit amatir',
                  'Pendidikan dan pelatihan',
                  'Eksperimen teknologi antariksa',
                  'Kolaborasi internasional'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-red-500 font-semibold hover:text-red-400 transition-colors"
              >
                <span>Learn more about us</span>
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-white/10 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Satellite className="w-32 h-32 text-red-500/20" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                {galleries[0] && (
                  <img
                    src={`http://127.0.0.1:8000/storage/${galleries[0].image}`}
                    alt="AMSAT-ID"
                    className="w-full h-full object-cover opacity-80"
                  />
                )}
              </div>
              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Radio className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Satellite</div>
                    <div className="font-bold text-white">IO-86</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Active</div>
                    <div className="font-bold text-white">Community</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="activities" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20 mb-6">
              <Radio className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-blue-400">Latest Activities</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Kegiatan Terbaru
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Ikuti perkembangan terbaru dari komunitas AMSAT Indonesia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((content) => (
              <article key={content.id} className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all hover:transform hover:scale-[1.02]">
                <div className="aspect-video bg-slate-800 relative overflow-hidden">
                  {content.thumbnail ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${content.thumbnail}`}
                      alt={content.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Radio className="w-12 h-12 text-gray-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6">
                  <div className="text-xs text-gray-500 mb-2">
                    {new Date(content.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-red-400 transition-colors">
                    {content.title}
                  </h3>
                  {content.excerpt && (
                    <p className="text-gray-400 text-sm line-clamp-2">{content.excerpt}</p>
                  )}
                </div>
              </article>
            ))}
          </div>

          {contents.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Radio className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p>No activities yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20 mb-6">
              <Star className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium text-purple-400">Gallery</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Galeri Foto
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Dokumentasi kegiatan dan momen berharga komunitas AMSAT Indonesia
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleries.map((gallery, i) => (
              <div
                key={gallery.id}
                className={`group relative overflow-hidden rounded-2xl ${i === 0 ? 'md:col-span-2 md:row-span-2' : ''
                  }`}
              >
                <div className={`${i === 0 ? 'aspect-square' : 'aspect-square'} bg-slate-800`}>
                  <img
                    src={`http://127.0.0.1:8000/storage/${gallery.image}`}
                    alt={gallery.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-white font-semibold truncate">{gallery.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {galleries.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Star className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p>No gallery images yet</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Bergabung dengan Komunitas
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Jadilah bagian dari komunitas operator radio amatir Indonesia yang berdedikasi untuk eksplorasi dan edukasi teknologi antariksa.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-2xl hover:from-red-500 hover:to-red-600 transition-all shadow-xl shadow-red-500/30"
            >
              <span>Daftar Membership</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#contact"
              className="flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <Mail className="w-5 h-5" />
              <span>Hubungi Kami</span>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20 mb-6">
                <Mail className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-400">Contact Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  Hubungi Kami
                </span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Ada pertanyaan atau ingin bergabung? Jangan ragu untuk menghubungi kami.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Email</div>
                    <a href="mailto:info@amsat-id.org" className="text-white hover:text-red-400 transition-colors">
                      info@amsat-id.org
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Location</div>
                    <p className="text-white">Jakarta, Indonesia</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                    <Globe className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Website</div>
                    <a href="https://amsat-id.org" target="_blank" rel="noopener noreferrer" className="text-white hover:text-red-400 transition-colors flex items-center gap-1">
                      amsat-id.org <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Kirim Pesan</h3>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Nama</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                      placeholder="Nama lengkap"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Callsign (Optional)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                    placeholder="e.g. YB0ABC"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Pesan</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none"
                    placeholder="Tulis pesan Anda..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-500 hover:to-red-600 transition-all shadow-lg shadow-red-500/30"
                >
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center">
                  <Satellite className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">AMSAT-ID</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-sm">
                Amateur Satellite Indonesia - We Do Satellite Communications, Experiments And Educations
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Home', 'About', 'Activities', 'Gallery', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href={`#${link.toLowerCase()}`} className="text-gray-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                {['TLE Data', 'Know-How', 'Logger', 'Membership'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} AMSAT Indonesia. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-400 hover:text-white transition-colors text-sm">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
