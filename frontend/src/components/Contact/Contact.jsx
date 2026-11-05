import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FaArrowRight,
  FaClock,
  FaCompass,
  FaEnvelope,
  FaHandshake,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaSeedling,
  FaUsers,
} from 'react-icons/fa';

const heroImage =
  'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80';

const supportCards = [
  { icon: FaUsers, title: 'Farmer support', text: 'Get help using crop diagnosis, weather advice, soil tools, and farm records.' },
  { icon: FaHandshake, title: 'Partnerships', text: 'Discuss cooperative, NGO, institution, or extension-program collaboration.' },
  { icon: FaClock, title: 'Response time', text: 'Most messages receive a follow-up within one working day.' },
];

const defaultMapLocation = 'Kakuma, Turkana County, Kenya';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gpsLocation: '',
    topic: 'General support',
    message: '',
  });
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    toast.success('Message received. The SMART FARM team will contact you soon.');
    setFormData({ name: '', email: '', phone: '', gpsLocation: '', topic: 'General support', message: '' });
  };

  const handleUseGps = () => {
    if (!navigator.geolocation) {
      toast.error('GPS location is not supported in this browser.');
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude.toFixed(6);
        const longitude = position.coords.longitude.toFixed(6);
        setFormData((previous) => ({
          ...previous,
          gpsLocation: `${latitude}, ${longitude}`,
        }));
        setGettingLocation(false);
        toast.success('GPS location added to your message.');
      },
      () => {
        setGettingLocation(false);
        toast.error('Could not get GPS location. Please allow location access.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const activeMapLocation = formData.gpsLocation || defaultMapLocation;
  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(activeMapLocation)}&z=13&output=embed`;

  return (
    <div className="bg-[#dfe7dc] px-3 pb-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-[#fbfdf8] shadow-2xl shadow-green-950/10">
        <section className="relative isolate overflow-hidden px-6 pb-12 pt-28 sm:px-10 lg:px-14">
          <img src={heroImage} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-green-950/60 backdrop-blur-[1px]" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#12381e]/95 via-[#2f7044]/55 to-[#12381e]/45" />

          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="flex flex-col justify-center rounded-[24px] border border-white/15 bg-white/10 p-6 text-white shadow-2xl shadow-green-950/20 backdrop-blur-md sm:p-8">
              <span className="mb-8 inline-flex w-fit rounded-full bg-[#dfff67] px-4 py-2 text-xs font-black uppercase text-[#12381e]">
                Contact SMART FARM
              </span>
              <h1 className="max-w-xl text-4xl font-black leading-[0.96] sm:text-5xl lg:text-6xl">
                Let us build better farm decisions together
              </h1>
              <p className="mt-7 max-w-lg text-base leading-7 text-green-50/85">
                Reach out for farmer support, partner onboarding, demonstrations, or help using SMART FARM AI tools.
              </p>

              <div className="mt-10 grid gap-4">
                <a href="mailto:info@smartfarm.co.ke" className="flex items-center gap-4 rounded-lg border border-white/15 bg-white/10 p-4 transition hover:bg-white/15">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
                    <FaEnvelope />
                  </span>
                  <span>
                    <span className="block text-xs font-black uppercase text-white/55">Email</span>
                    <span className="font-black">info@smartfarm.co.ke</span>
                  </span>
                </a>
                <a href="tel:+254700000000" className="flex items-center gap-4 rounded-lg border border-white/15 bg-white/10 p-4 transition hover:bg-white/15">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
                    <FaPhoneAlt />
                  </span>
                  <span>
                    <span className="block text-xs font-black uppercase text-white/55">Phone</span>
                    <span className="font-black">+254 700 000 000</span>
                  </span>
                </a>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="rounded-[24px] border border-white/20 bg-white/15 p-6 text-white shadow-2xl shadow-green-950/20 backdrop-blur-md sm:p-8">
              <h2 className="text-2xl font-black">Send a message</h2>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Share a few details and the team will follow up with the right support.
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <InputField label="Full name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
                <InputField label="Email address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
                <InputField label="Phone optional" name="phone" value={formData.phone} onChange={handleChange} placeholder="+254..." />
                <label className="grid gap-2 text-sm font-black">
                  GPS location optional
                  <span className="grid gap-3 rounded-lg border border-white/20 bg-white/10 p-3">
                    <input
                      name="gpsLocation"
                      value={formData.gpsLocation}
                      onChange={handleChange}
                      className="rounded-lg border border-white/20 bg-white/90 px-4 py-3 font-medium text-[#18361f] outline-none transition focus:border-[#dfff67] focus:ring-2 focus:ring-[#dfff67]/60"
                      placeholder="Latitude, longitude"
                    />
                    <button
                      type="button"
                      onClick={handleUseGps}
                      disabled={gettingLocation}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#dfff67] px-4 py-2.5 text-xs font-black text-[#12381e] transition hover:bg-[#edff8b] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <FaCompass />
                      {gettingLocation ? 'Getting GPS...' : 'Use my GPS location'}
                    </button>
                  </span>
                </label>
                <label className="grid gap-2 text-sm font-black">
                  Topic
                  <select
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    className="rounded-lg border border-white/20 bg-white/90 px-4 py-3 font-medium text-[#18361f] outline-none transition focus:border-[#dfff67] focus:ring-2 focus:ring-[#dfff67]/60"
                  >
                    <option>General support</option>
                    <option>Farmer onboarding</option>
                    <option>Partnership</option>
                    <option>Technical issue</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-black sm:col-span-2">
                  Message
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="resize-none rounded-lg border border-white/20 bg-white/90 px-4 py-3 font-medium text-[#18361f] outline-none transition focus:border-[#dfff67] focus:ring-2 focus:ring-[#dfff67]/60"
                    placeholder="Tell us what you need help with"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[#dfff67] px-5 py-3 text-sm font-black text-[#12381e] transition hover:bg-[#edff8b] sm:col-span-2"
                >
                  Send message
                  <FaArrowRight />
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="grid gap-5 px-6 py-16 sm:px-10 lg:grid-cols-3 lg:px-14">
          {supportCards.map((item) => (
            <article key={item.title} className="rounded-lg border border-green-900/10 bg-white p-6 shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
                {React.createElement(item.icon)}
              </div>
              <h2 className="text-xl font-black text-[#18361f]">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 px-6 pb-16 sm:px-10 lg:grid-cols-[1fr_1.2fr] lg:px-14">
          <div>
            <span className="text-xs font-black uppercase text-[#37794d]">Location</span>
            <h2 className="mt-3 text-3xl font-black text-[#18361f]">Kakuma, Turkana County</h2>
            <p className="mt-4 max-w-lg text-sm leading-6 text-stone-600">
              Supporting farmers, cooperatives, extension teams, and organizations working across dryland agriculture.
            </p>
            <div className="mt-6 rounded-lg border border-green-900/10 bg-white p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h3 className="font-black text-[#18361f]">Map location</h3>
                  <p className="mt-1 text-sm leading-6 text-stone-600">
                    {activeMapLocation}
                  </p>
                  <a
                    href={`https://www.google.com/maps?q=${encodeURIComponent(activeMapLocation)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#37794d] transition hover:text-[#12381e]"
                  >
                    Open in Google Maps
                    <FaArrowRight />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-lg border border-green-900/10 bg-[#12381e] shadow-xl shadow-green-950/10">
            <iframe
              title="SMART FARM Google Map"
              src={mapUrl}
              className="absolute inset-0 h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-green-950/85 to-transparent p-5 text-white">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black backdrop-blur-md">
                <FaSeedling className="text-[#dfff67]" />
                Google Map location preview
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const InputField = ({ label, ...props }) => (
  <label className="grid gap-2 text-sm font-black">
    {label}
    <input
      {...props}
      className="rounded-lg border border-white/20 bg-white/90 px-4 py-3 font-medium text-[#18361f] outline-none transition focus:border-[#dfff67] focus:ring-2 focus:ring-[#dfff67]/60"
    />
  </label>
);

export default Contact;
