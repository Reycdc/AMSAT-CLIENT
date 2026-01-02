import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login({ username, password });
      // Navigate to dashboard after successful login
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://127.0.0.1:8000/api/auth/google';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-6 font-['Instrument_Sans',sans-serif]">
      <div className="w-full max-w-[1400px] bg-white rounded-3xl shadow-[0_20px_60px_rgba(220,38,38,0.15)] overflow-hidden min-h-[600px] flex flex-col lg:flex-row">
        {/* Left Side - Login Form */}
        <div className="flex-1 p-12 flex flex-col justify-center max-w-lg mx-auto lg:max-w-none">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-500 rounded-xl flex items-center justify-center text-white text-xl font-semibold shadow-lg shadow-red-200">
              AS
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">AMSAT-ID</h1>
              <p className="text-sm text-gray-500">Amateur Satellite Indonesia</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Login to Dashboard</h2>
            <p className="text-gray-500">Fill the below form to login</p>
          </div>

          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 border border-gray-200 rounded-lg bg-white flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-600 transition-all duration-200 text-sm font-medium text-gray-700"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
                <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05" />
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
              </svg>
              Sign in with Google
            </button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-gray-400 text-sm">OR</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-100 rounded-lg text-sm flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:bg-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all outline-none text-gray-800 placeholder-gray-400"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:bg-transparent focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all outline-none text-gray-800 placeholder-gray-400"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-sm font-medium text-red-600 hover:text-red-700">Forget Password?</a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-br from-red-600 to-red-500 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging In...
                </span>
              ) : 'Login'}
            </button>
          </form>

          <div className="text-center mt-8 text-sm text-gray-500">
            Don't have an account? <Link to="/register" className="font-semibold text-red-600 hover:text-red-700">Register here</Link>
          </div>
        </div>

        {/* Right Side - Dashboard Preview */}
        <div className="hidden lg:flex flex-[1.2] bg-gradient-to-br from-red-50 to-red-100 relative items-center justify-center p-12 overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute -top-24 -right-24 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-red-500 to-red-600 opacity-5 blur-3xl"></div>
          <div className="absolute -bottom-12 -left-12 w-[200px] h-[200px] rounded-full bg-gradient-to-br from-red-500 to-red-600 opacity-5 blur-3xl"></div>

          <div className="w-full max-w-lg z-10">
            <div className="text-center mb-8">
              <p className="text-gray-500 mb-2">AMSAT Asset Management</p>
              <h3 className="text-3xl font-bold text-gray-900 leading-tight">
                Manage your assets and inventory<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">more efficiently</span>
              </h3>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_10px_40px_rgba(220,38,38,0.1)] p-8">
              <div className="flex items-center gap-4 mb-8 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  AM
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">Welcome to AMSAT</div>
                  <div className="text-xs text-gray-400">Manage assets & inventory</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <div className="text-2xl font-bold text-red-600 mb-1">156</div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">Assets</div>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <div className="text-2xl font-bold text-red-600 mb-1">89</div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">Active</div>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <div className="text-2xl font-bold text-red-600 mb-1">24</div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-500">Cats</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl h-32 flex items-center justify-center border border-gray-100 border-dashed">
                <span className="text-gray-400 text-xs font-medium">Asset Activity Chart Placeholder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
