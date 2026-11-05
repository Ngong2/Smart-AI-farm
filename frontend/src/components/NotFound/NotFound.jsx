import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaHome, FaPhoneAlt, FaSeedling } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="bg-[#dfe7dc] px-3 pb-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-7rem)] max-w-7xl items-center justify-center overflow-hidden rounded-[28px] bg-[#12381e] px-6 py-28 text-white shadow-2xl shadow-green-950/10">
        <div className="max-w-xl text-center">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
            <FaSeedling className="text-2xl" />
          </div>
          <p className="text-sm font-black uppercase text-[#dfff67]">404</p>
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-5 text-sm leading-6 text-white/70">
            The page you are looking for does not exist or has been moved.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-3 rounded-full bg-[#dfff67] px-5 py-3 text-sm font-black text-[#12381e] transition hover:bg-[#edff8b]"
            >
              <FaHome />
              Home
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10"
            >
              Services
              <FaArrowRight />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 rounded-full border border-white/20 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10"
            >
              <FaPhoneAlt />
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
