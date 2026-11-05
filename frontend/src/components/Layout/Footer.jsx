import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaFacebook, FaInstagram, FaPhoneAlt, FaSeedling, FaTwitter, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const year = new Date().getFullYear();

  const columns = [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Services', path: '/services' },
        { name: 'Subscription', path: '/subscription' },
        { name: 'Contact', path: '/contact' },
      ],
    },
    {
      title: 'Utility Pages',
      links: [
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Contact Support', path: '/contact' },
      ],
    },
    {
      title: 'Social Links',
      links: [
        { name: 'Facebook', path: 'https://facebook.com/smartfarm' },
        { name: 'Instagram', path: 'https://instagram.com/smartfarm' },
        { name: 'Twitter', path: 'https://twitter.com/smartfarm' },
        { name: 'YouTube', path: 'https://youtube.com/smartfarm' },
      ],
    },
  ];

  const socialIcons = [
    { Icon: FaFacebook, href: 'https://facebook.com/smartfarm', label: 'Facebook' },
    { Icon: FaInstagram, href: 'https://instagram.com/smartfarm', label: 'Instagram' },
    { Icon: FaTwitter, href: 'https://twitter.com/smartfarm', label: 'Twitter' },
    { Icon: FaYoutube, href: 'https://youtube.com/smartfarm', label: 'YouTube' },
  ];

  return (
    <footer className="bg-[#dfe7dc] px-3 pb-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-b-[28px] bg-[#12381e] px-6 py-12 text-white lg:px-12">
        <div className="grid gap-10 md:grid-cols-[1.2fr_2fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-xl font-black text-[#dfff67]">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
                <FaSeedling />
              </span>
              SMART FARM
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/65">
              AI-powered crop, soil, and weather guidance for farmers across Turkana.
            </p>
            <div className="mt-6 flex gap-3">
              {socialIcons.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-[#dfff67] hover:text-[#12381e]"
                >
                  {React.createElement(item.Icon)}
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-black text-white">{column.title}</h3>
                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      {link.path.startsWith('http') ? (
                        <a href={link.path} target="_blank" rel="noreferrer" className="text-sm text-white/60 transition hover:text-[#dfff67]">
                          {link.name}
                        </a>
                      ) : (
                        <Link to={link.path} className="text-sm text-white/60 transition hover:text-[#dfff67]">
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-sm font-black text-white">Contact Us</h3>
            <div className="mt-5 space-y-4">
              <a href="mailto:info@smartfarm.co.ke" className="flex items-center gap-3 text-sm text-white/70 transition hover:text-[#dfff67]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
                  <FaEnvelope />
                </span>
                info@smartfarm.co.ke
              </a>
              <a href="tel:+254700000000" className="flex items-center gap-3 text-sm text-white/70 transition hover:text-[#dfff67]">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
                  <FaPhoneAlt />
                </span>
                +254 700 000 000
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/45">
          Copyright {year} SMART FARM. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
