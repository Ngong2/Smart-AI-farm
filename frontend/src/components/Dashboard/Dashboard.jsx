import React, { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  FaBell,
  FaChartLine,
  FaCheckCircle,
  FaCloudRain,
  FaCloudSun,
  FaEnvelope,
  FaExclamationTriangle,
  FaLeaf,
  FaPaperPlane,
  FaSeedling,
  FaTint,
  FaUsers,
} from 'react-icons/fa';
import { adminAPI } from '../../services/api';
import DashboardNavbar from './DashboardNavbar';

const emptyOverview = {
  summary: {
    users: 0,
    cropDetections: 0,
    soilDetections: 0,
    recentCropDetections: 0,
    recentSoilDetections: 0,
    highCropRisk: 0,
    droughtRisk: 'normal',
  },
  yieldOutlook: {
    status: 'Stable',
    issueRate: 0,
    healthyRate: 0,
    highSeverity: 0,
    mediumSeverity: 0,
  },
  climate: {
    currentTemperature: null,
    currentHumidity: null,
    rainfallTotal: 0,
    maxTemp: 0,
    minHumidity: 0,
    droughtRisk: 'normal',
    rainOutlook: 'No rain update yet',
    latestAdvice: '',
  },
  users: [],
  cropRecords: [],
  soilRecords: [],
  weatherRecords: [],
  recentMessages: [],
};

const categoryOptions = [
  'general',
  'soil',
  'crop',
  'weather',
  'drought',
  'rain',
];

const formatDate = (value) => {
  if (!value) return 'Recent';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const Dashboard = () => {
  const [adminUser] = useState(() => {
    const userData = localStorage.getItem('user');
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  });

  const [overview, setOverview] = useState(emptyOverview);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageForm, setMessageForm] = useState({
    targetType: 'all',
    recipientId: '',
    category: 'general',
    subject: '',
    message: '',
  });

  const loadOverview = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getOverview();
      if (response?.success) {
        setOverview({ ...emptyOverview, ...response.data });
      }
    } catch (error) {
      console.error('Admin overview error:', error);
      toast.error(error?.response?.data?.message || 'Failed to load admin dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const handleMessageChange = (event) => {
    const { name, value } = event.target;
    setMessageForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (messageForm.targetType === 'user' && !messageForm.recipientId) {
      toast.error('Select one user or choose all users');
      return;
    }

    setSending(true);
    try {
      const response = await adminAPI.sendMessage(messageForm);
      if (response?.success) {
        toast.success(response.message || 'Message saved successfully');
        setMessageForm({
          targetType: 'all',
          recipientId: '',
          category: 'general',
          subject: '',
          message: '',
        });
        await loadOverview();
      }
    } catch (error) {
      console.error('Send admin message error:', error);
      toast.error(error?.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const stats = [
    {
      label: 'Farmers',
      value: overview.summary.users,
      helper: 'Registered users',
      icon: FaUsers,
    },
    {
      label: 'Crop detections',
      value: overview.summary.cropDetections,
      helper: `${overview.summary.recentCropDetections} in last 30 days`,
      icon: FaLeaf,
    },
    {
      label: 'Soil detections',
      value: overview.summary.soilDetections,
      helper: `${overview.summary.recentSoilDetections} in last 30 days`,
      icon: FaSeedling,
    },
    {
      label: 'High crop risk',
      value: overview.summary.highCropRisk,
      helper: 'Needs follow-up',
      icon: FaExclamationTriangle,
    },
  ];

  const climateCards = [
    {
      label: 'Drought risk',
      value: overview.climate.droughtRisk === 'high' ? 'High' : 'Normal',
      helper: 'Based on heat, humidity, and risk alerts',
      icon: FaCloudSun,
    },
    {
      label: 'Rain update',
      value: overview.climate.rainOutlook,
      helper: `${Number(overview.climate.rainfallTotal || 0).toFixed(1)} mm forecast total`,
      icon: FaCloudRain,
    },
    {
      label: 'Temperature',
      value: overview.climate.currentTemperature
        ? `${overview.climate.currentTemperature}C`
        : 'No data',
      helper: `Forecast high ${overview.climate.maxTemp || 0}C`,
      icon: FaTint,
    },
  ];

  return (
    <div className="min-h-screen bg-[#dfe7dc]">
      <DashboardNavbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative isolate overflow-hidden rounded-[28px] bg-[#12381e] p-6 text-white shadow-2xl shadow-green-950/10 sm:p-8 lg:p-10">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-green-950/72" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#12381e]/95 via-[#2f7044]/55 to-[#12381e]/65" />

          <div className="grid gap-8 lg:grid-cols-[1fr_0.82fr] lg:items-end">
            <div className="rounded-[22px] border border-white/15 bg-white/10 p-6 backdrop-blur-md">
              <span className="mb-7 inline-flex rounded-full bg-[#dfff67] px-4 py-2 text-xs font-black uppercase text-[#12381e]">
                Admin command center
              </span>
              <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
                {greeting}, {adminUser?.name?.split(' ')[0] || 'Admin'}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">
                Monitor soil detections, crop disease pressure, yield risk, drought/rain updates, users, and platform messages from one private workspace.
              </p>
            </div>

            <div className="rounded-[22px] border border-white/15 bg-white/10 p-6 backdrop-blur-md">
              <p className="text-xs font-black uppercase text-[#dfff67]">Crop yield outlook</p>
              <h2 className="mt-2 text-3xl font-black">{overview.yieldOutlook.status}</h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="text-2xl font-black text-[#dfff67]">{overview.yieldOutlook.healthyRate}%</p>
                  <p className="mt-1 text-xs text-white/65">Healthy crop rate</p>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="text-2xl font-black text-[#dfff67]">{overview.yieldOutlook.issueRate}%</p>
                  <p className="mt-1 text-xs text-white/65">Yield risk rate</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-lg border border-green-900/10 bg-[#fbfdf8] p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-stone-500">{stat.label}</p>
                  <p className="mt-3 text-4xl font-black text-[#18361f]">{loading ? '...' : stat.value}</p>
                  <p className="mt-2 text-sm text-stone-500">{stat.helper}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
                  {React.createElement(stat.icon)}
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          {climateCards.map((card) => (
            <article key={card.label} className="rounded-lg border border-green-900/10 bg-white p-6 shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#12381e] text-[#dfff67]">
                {React.createElement(card.icon)}
              </div>
              <p className="text-sm font-bold text-stone-500">{card.label}</p>
              <h2 className="mt-2 text-2xl font-black text-[#18361f]">{loading ? '...' : card.value}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">{card.helper}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="rounded-lg border border-green-900/10 bg-[#fbfdf8] p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-xs font-black uppercase text-[#37794d]">Records</p>
              <h2 className="mt-2 text-2xl font-black text-[#18361f]">Soil detection records</h2>
            </div>
            <div className="overflow-hidden rounded-lg border border-green-900/10">
              {overview.soilRecords.length ? (
                overview.soilRecords.map((record) => (
                  <div key={record._id} className="grid gap-3 border-b border-green-900/10 bg-white p-5 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <h3 className="font-black capitalize text-[#18361f]">{record.soilType || 'Unknown soil'}</h3>
                      <p className="mt-1 text-sm text-stone-500">
                        {record.userId?.name || 'Farmer'} - fertility {record.analysis?.fertility || 'not recorded'}
                      </p>
                    </div>
                    <span className="w-fit rounded-full bg-[#eef8f1] px-4 py-2 text-xs font-black text-[#37794d]">
                      {formatDate(record.createdAt)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="bg-white p-6 text-sm font-semibold text-stone-500">
                  {loading ? 'Loading soil records...' : 'No soil detection records yet.'}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-green-900/10 bg-[#fbfdf8] p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-xs font-black uppercase text-[#37794d]">Crop and yield</p>
              <h2 className="mt-2 text-2xl font-black text-[#18361f]">Crop detection records</h2>
            </div>
            <div className="overflow-hidden rounded-lg border border-green-900/10">
              {overview.cropRecords.length ? (
                overview.cropRecords.map((record) => (
                  <div key={record._id} className="grid gap-3 border-b border-green-900/10 bg-white p-5 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <h3 className="font-black capitalize text-[#18361f]">{record.cropType || 'Crop analysis'}</h3>
                      <p className="mt-1 text-sm text-stone-500">
                        {record.detectedDisease || 'Diagnosis pending'} - {record.userId?.name || 'Farmer'}
                      </p>
                    </div>
                    <span className={`w-fit rounded-full px-4 py-2 text-xs font-black ${
                      record.severity === 'High'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-[#eef8f1] text-[#37794d]'
                    }`}>
                      {record.severity || 'Pending'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="bg-white p-6 text-sm font-semibold text-stone-500">
                  {loading ? 'Loading crop records...' : 'No crop detection records yet.'}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <form onSubmit={handleSendMessage} className="rounded-lg border border-green-900/10 bg-[#12381e] p-6 text-white shadow-sm">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
                <FaPaperPlane />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-[#dfff67]">Message center</p>
                <h2 className="text-2xl font-black">Send message to users</h2>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-black">
                  Send to
                  <select
                    name="targetType"
                    value={messageForm.targetType}
                    onChange={handleMessageChange}
                    className="rounded-lg border border-white/20 bg-white/90 px-4 py-3 font-medium text-[#18361f] outline-none focus:ring-2 focus:ring-[#dfff67]/60"
                  >
                    <option value="all">All users</option>
                    <option value="user">One user</option>
                  </select>
                </label>

                <label className="grid gap-2 text-sm font-black">
                  Category
                  <select
                    name="category"
                    value={messageForm.category}
                    onChange={handleMessageChange}
                    className="rounded-lg border border-white/20 bg-white/90 px-4 py-3 font-medium capitalize text-[#18361f] outline-none focus:ring-2 focus:ring-[#dfff67]/60"
                  >
                    {categoryOptions.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>
              </div>

              {messageForm.targetType === 'user' && (
                <label className="grid gap-2 text-sm font-black">
                  Select user
                  <select
                    name="recipientId"
                    value={messageForm.recipientId}
                    onChange={handleMessageChange}
                    className="rounded-lg border border-white/20 bg-white/90 px-4 py-3 font-medium text-[#18361f] outline-none focus:ring-2 focus:ring-[#dfff67]/60"
                  >
                    <option value="">Choose farmer</option>
                    {overview.users.map((person) => (
                      <option key={person._id} value={person._id}>
                        {person.name} - {person.location || person.email}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="grid gap-2 text-sm font-black">
                Subject
                <input
                  name="subject"
                  value={messageForm.subject}
                  onChange={handleMessageChange}
                  required
                  className="rounded-lg border border-white/20 bg-white/90 px-4 py-3 font-medium text-[#18361f] outline-none focus:ring-2 focus:ring-[#dfff67]/60"
                  placeholder="Rain warning, soil follow-up, crop alert..."
                />
              </label>

              <label className="grid gap-2 text-sm font-black">
                Message
                <textarea
                  name="message"
                  value={messageForm.message}
                  onChange={handleMessageChange}
                  required
                  rows="5"
                  className="resize-none rounded-lg border border-white/20 bg-white/90 px-4 py-3 font-medium text-[#18361f] outline-none focus:ring-2 focus:ring-[#dfff67]/60"
                  placeholder="Write the message users should receive..."
                />
              </label>

              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#dfff67] px-5 py-3 text-sm font-black text-[#12381e] transition hover:bg-[#edff8b] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {sending ? 'Sending...' : 'Send message'}
                {!sending && <FaPaperPlane />}
              </button>
            </div>
          </form>

          <div className="rounded-lg border border-green-900/10 bg-[#fbfdf8] p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
                <FaEnvelope />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-[#37794d]">Message records</p>
                <h2 className="text-2xl font-black text-[#18361f]">Recent admin messages</h2>
              </div>
            </div>

            <div className="grid gap-3">
              {overview.recentMessages.length ? (
                overview.recentMessages.map((message) => (
                  <article key={message._id} className="rounded-lg border border-green-900/10 bg-white p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#eef8f1] px-3 py-1 text-xs font-black capitalize text-[#37794d]">
                        {message.category}
                      </span>
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-black text-stone-500">
                        {message.targetType === 'all' ? 'All users' : message.recipientId?.name || 'One user'}
                      </span>
                    </div>
                    <h3 className="mt-4 font-black text-[#18361f]">{message.subject}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{message.message}</p>
                    <p className="mt-3 text-xs font-semibold text-stone-400">{formatDate(message.createdAt)}</p>
                  </article>
                ))
              ) : (
                <div className="rounded-lg bg-white p-6 text-sm font-semibold text-stone-500">
                  {loading ? 'Loading messages...' : 'No admin messages sent yet.'}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-green-900/10 bg-[#fbfdf8] p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
              <FaBell />
            </div>
            <div>
              <p className="text-xs font-black uppercase text-[#37794d]">Climate and user records</p>
              <h2 className="text-2xl font-black text-[#18361f]">Latest weather updates and users</h2>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-lg border border-green-900/10">
              {overview.weatherRecords.length ? (
                overview.weatherRecords.map((record) => (
                  <div key={record._id} className="border-b border-green-900/10 bg-white p-5 last:border-b-0">
                    <h3 className="font-black text-[#18361f]">{record.location || 'Weather update'}</h3>
                    <p className="mt-1 text-sm text-stone-500">
                      {record.currentWeather?.temperature || 0}C, {record.currentWeather?.humidity || 0}% humidity - {formatDate(record.createdAt)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {record.advice?.plantingAdvice || record.advice?.irrigationNeeds || 'No written advice recorded.'}
                    </p>
                  </div>
                ))
              ) : (
                <div className="bg-white p-6 text-sm font-semibold text-stone-500">
                  {loading ? 'Loading climate records...' : 'No climate records yet.'}
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-lg border border-green-900/10">
              {overview.users.length ? (
                overview.users.slice(0, 6).map((person) => (
                  <div key={person._id} className="grid gap-3 border-b border-green-900/10 bg-white p-5 last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <h3 className="font-black text-[#18361f]">{person.name}</h3>
                      <p className="mt-1 text-sm text-stone-500">{person.email} - {person.location || 'No location'}</p>
                    </div>
                    <span className="w-fit rounded-full bg-[#eef8f1] px-4 py-2 text-xs font-black text-[#37794d]">
                      {(person.primaryCrops || []).slice(0, 2).join(', ') || 'No crops'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="bg-white p-6 text-sm font-semibold text-stone-500">
                  {loading ? 'Loading users...' : 'No users found.'}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
