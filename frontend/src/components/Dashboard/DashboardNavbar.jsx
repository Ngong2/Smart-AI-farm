import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaBell, FaSeedling, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const DashboardNavbar = ({ title = 'SMART FARM Dashboard', subtitle = 'Private dashboard' }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-green-900/10 bg-[#fbfdf8]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
            <FaSeedling />
          </span>
          <span>
            <span className="block text-sm font-black uppercase text-[#18361f]">{title}</span>
            <span className="block text-xs font-semibold text-stone-500">{subtitle}</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-green-900/10 bg-white text-[#37794d] sm:flex"
            aria-label="Notifications"
          >
            <FaBell />
          </button>
          <div className="hidden items-center gap-2 rounded-full border border-green-900/10 bg-white px-3 py-2 sm:flex">
            <FaUserCircle className="text-[#37794d]" />
            <span className="max-w-32 truncate text-sm font-bold text-[#18361f]">
              {user?.name || 'Farmer'}
            </span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-full bg-[#12381e] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#37794d]"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
