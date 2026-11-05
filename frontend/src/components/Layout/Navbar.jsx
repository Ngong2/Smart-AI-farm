import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FaArrowRight, FaBars, FaSeedling, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navLinks = [
    { path: '/', name: 'Home' },
    { path: '/about', name: 'About Us' },
    { path: '/services', name: 'Services' },
    { path: '/subscription', name: 'Subscription' },
    { path: '/contact', name: 'Contact' },
  ];

  const allLinks = navLinks;

  const isActivePath = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <nav className="fixed inset-x-0 top-4 z-50 px-3 sm:px-6 lg:px-8">
      <div
        className={`mx-auto max-w-7xl rounded-[22px] border border-white/10 bg-[#12381e]/95 px-4 py-3 text-white shadow-xl shadow-green-950/20 backdrop-blur transition ${
          scrolled ? 'lg:max-w-6xl' : ''
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex min-w-0 items-center gap-2 font-black"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
              <FaSeedling />
            </span>
            <span className="truncate text-lg">SMART FARM</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {allLinks.map((link) => {
              const isActive = isActivePath(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                    isActive ? 'bg-white/10 text-[#dfff67]' : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            {isAuthenticated ? (
              <>
                <span className="rounded-full px-3 py-2 text-xs font-bold text-white/75">
                  {user.name?.split(' ')[0] || 'Farmer'}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full bg-[#dfff67] px-4 py-2 text-xs font-black text-[#12381e] transition hover:bg-[#edff8b]"
                >
                  Sign out
                  <FaArrowRight />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-full px-3 py-2 text-xs font-bold text-white/75 hover:bg-white/10 hover:text-white"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-[#dfff67] px-4 py-2 text-xs font-black text-[#12381e] transition hover:bg-[#edff8b]"
                >
                  Join
                  <FaArrowRight />
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white md:hidden"
            aria-label="Toggle navigation"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {isOpen && (
          <div className="overflow-hidden md:hidden">
              <div className="mt-4 grid gap-2 border-t border-white/10 pt-4">
                {allLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`rounded-full px-4 py-3 text-sm font-bold ${
                      isActivePath(link.path)
                        ? 'bg-white/10 text-[#dfff67]'
                        : 'text-white/75 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="mt-2 rounded-full bg-[#dfff67] px-4 py-3 text-sm font-black text-[#12381e]"
                  >
                    Sign out
                  </button>
                ) : (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="rounded-full border border-white/15 px-4 py-3 text-center text-sm font-bold text-white"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsOpen(false)}
                      className="rounded-full bg-[#dfff67] px-4 py-3 text-center text-sm font-black text-[#12381e]"
                    >
                      Join
                    </Link>
                  </div>
                )}
              </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
