import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaArrowRight, FaEye, FaEyeSlash, FaLeaf, FaLock, FaShieldAlt, FaUserShield } from 'react-icons/fa';
import { authAPI } from '../../services/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  let savedUser = {};

  try {
    savedUser = JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    savedUser = {};
  }

  const isAdmin = localStorage.getItem('token') && savedUser?.role === 'admin';

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  if (isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error('Please enter admin username and password');
      return;
    }

    setLoading(true);

    try {
      const data = await authAPI.adminLogin({
        username: formData.username.trim(),
        password: formData.password,
      });

      if (data?.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        toast.success('Admin login successful.');
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(data?.message || 'Invalid admin credentials');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      toast.error(error?.response?.data?.message || 'Admin login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative isolate bg-[#dfe7dc] px-3 pb-6 sm:px-6 lg:px-8">
      <img
        src="https://images.unsplash.com/photo-1527847263472-aa5338d178b8?auto=format&fit=crop&w=1600&q=80"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-green-950/68 backdrop-blur-[1px]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#12381e]/95 via-[#2f7044]/45 to-[#12381e]/65" />

      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-8 rounded-[28px] px-4 py-28 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-12">
        <section className="hidden text-white lg:block">
          <div className="max-w-xl rounded-[24px] border border-white/15 bg-white/10 p-8 shadow-2xl shadow-green-950/25 backdrop-blur-md">
            <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
              <FaShieldAlt />
            </div>
            <h1 className="text-5xl font-black leading-[0.96]">
              Secure admin access for SMART FARM
            </h1>
            <p className="mt-5 text-sm leading-6 text-white/75">
              Manage the private dashboard, monitor platform activity, and review farm intelligence from a protected admin entrance.
            </p>
            <div className="mt-8 grid gap-3">
              {['Hidden from public navigation', 'Backend-owned credentials', 'Protected dashboard session'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 p-4 text-sm font-black">
                  <FaLeaf className="text-[#dfff67]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-md rounded-[24px] border border-white/20 bg-white/15 p-6 text-white shadow-2xl shadow-green-950/25 backdrop-blur-md sm:p-8">
            <span className="mb-7 inline-flex rounded-full bg-[#dfff67] px-4 py-2 text-xs font-black uppercase text-[#12381e]">
              Admin login
            </span>
            <h2 className="text-4xl font-black">Open dashboard</h2>
            <p className="mt-3 text-sm leading-6 text-white/70">
              Enter the admin username and password configured in the backend.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
              <label className="grid gap-2 text-sm font-bold text-white">
                Username
                <span className="relative">
                  <FaUserShield className="absolute left-4 top-1/2 -translate-y-1/2 text-[#37794d]" />
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Admin username"
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
                    placeholder="Admin password"
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
                {loading ? 'Checking access...' : 'Login as admin'}
                {!loading && <FaArrowRight />}
              </button>
            </form>

            <Link to="/" className="mt-7 inline-flex text-sm font-black text-[#dfff67] hover:text-[#edff8b]">
              Back to public website
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminLogin;
