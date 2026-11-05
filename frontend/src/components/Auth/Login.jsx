import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaArrowRight, FaEnvelope, FaEye, FaEyeSlash, FaLeaf, FaLock } from 'react-icons/fa';
import { authAPI } from '../../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);

    try {
      const data = await authAPI.login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (data?.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        toast.success('Login successful! Welcome back.');
        navigate(data.data.role === 'admin' ? '/dashboard' : '/farmer-dashboard', { replace: true });
      } else {
        toast.error(data?.message || 'Invalid login credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative isolate bg-[#dfe7dc] px-3 pb-6 sm:px-6 lg:px-8">
      <img
        src="https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1600&q=80"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-green-950/62 backdrop-blur-[1px]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#12381e]/95 via-[#2f7044]/45 to-[#12381e]/55" />

      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-8 rounded-[28px] px-4 py-28 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
        <section className="hidden text-white lg:block">
          <div className="max-w-xl rounded-[24px] border border-white/15 bg-white/10 p-8 shadow-2xl shadow-green-950/25 backdrop-blur-md">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
              <FaLeaf />
            </div>
            <h1 className="text-5xl font-black leading-[0.96]">
              Welcome back to smarter farming
            </h1>
            <p className="mt-5 text-sm leading-6 text-white/75">
              Continue checking crops, reviewing weather advice, and tracking your farm decisions from one secure workspace.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3">
              {['Crop AI', 'Weather', 'Soil'].map((item) => (
                <div key={item} className="rounded-lg border border-white/10 bg-white/10 p-3 text-center text-xs font-black">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-[24px] border border-white/20 bg-white/15 p-6 text-white shadow-2xl shadow-green-950/25 backdrop-blur-md sm:p-8">
            <span className="mb-7 inline-flex rounded-full bg-[#dfff67] px-4 py-2 text-xs font-black uppercase text-[#12381e]">
              Sign in
            </span>
            <h2 className="text-4xl font-black text-white">Login to SMART FARM</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Access your AI crop diagnosis, soil reports, and weather guidance.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
              <label className="grid gap-2 text-sm font-bold text-white">
                Email address
                <span className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#37794d]" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="farmer@example.com"
                    className="w-full rounded-lg border border-white/20 bg-white/90 py-3 pl-11 pr-4 font-medium text-[#18361f] outline-none transition placeholder:text-stone-400 focus:border-[#dfff67] focus:ring-2 focus:ring-[#dfff67]/60"
                  />
                </span>
              </label>

              <label className="grid gap-2 text-sm font-bold text-white">
                Password
                <span className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#37794d]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-white/20 bg-white/90 py-3 pl-11 pr-12 font-medium text-[#18361f] outline-none transition placeholder:text-stone-400 focus:border-[#dfff67] focus:ring-2 focus:ring-[#dfff67]/60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-[#37794d]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 inline-flex items-center justify-center gap-3 rounded-full bg-[#dfff67] px-5 py-3 text-sm font-black text-[#12381e] transition hover:bg-[#edff8b] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Logging in...' : 'Login'}
                {!loading && <FaArrowRight />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-white/70">
              Do not have an account?{' '}
              <Link to="/register" className="font-black text-[#dfff67] hover:text-[#edff8b]">
                Create one
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
