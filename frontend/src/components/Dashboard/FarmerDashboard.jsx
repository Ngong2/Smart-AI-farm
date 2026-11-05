import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaArrowRight,
  FaCamera,
  FaChartLine,
  FaCloudRain,
  FaCloudSun,
  FaCreditCard,
  FaEnvelopeOpenText,
  FaExclamationTriangle,
  FaLeaf,
  FaSeedling,
  FaTint,
} from 'react-icons/fa';
import { farmerAPI } from '../../services/api';
import DashboardNavbar from './DashboardNavbar';

const emptyOverview = {
  summary: {
    cropDetections: 0,
    soilDetections: 0,
    weatherUpdates: 0,
    unreadMessages: 0,
    activeRisks: 0,
  },
  yieldOutlook: {
    score: 100,
    label: 'Strong',
    highCropRisks: 0,
    mediumCropRisks: 0,
    lowFertilitySoils: 0,
  },
  weatherSummary: {
    currentTemperature: null,
    currentHumidity: null,
    rainfallTotal: 0,
    maxTemp: 0,
    minHumidity: 0,
    droughtRisk: 'normal',
    rainOutlook: 'No rain update yet',
    advice: null,
  },
  cropRecords: [],
  soilRecords: [],
  weatherRecords: [],
  messages: [],
  subscription: {
    plan: 'none',
    status: 'inactive',
    amount: 0,
    currency: 'KES',
    expiresAt: null,
  },
};

const quickActions = [
  { title: 'Detect crop disease', text: 'Upload a leaf or crop photo.', icon: FaCamera, path: '/crop/detect' },
  { title: 'Check soil health', text: 'Analyze soil and get advice.', icon: FaSeedling, path: '/soil' },
  { title: 'Weather advisory', text: 'Review drought and rain guidance.', icon: FaCloudSun, path: '/weather' },
  { title: 'Subscription', text: 'Choose or renew your plan.', icon: FaCreditCard, path: '/subscription' },
];

const planLabels = {
  none: 'No plan',
  basic: 'Basic',
  standard: 'Standard',
  premium: 'Premium',
};

const formatDate = (value) => {
  if (!value) return 'Recent';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const FarmerDashboard = () => {
  const [user] = useState(() => {
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

  const loadOverview = useCallback(async () => {
    setLoading(true);
    try {
      const response = await farmerAPI.getOverview();
      if (response?.success) {
        setOverview({ ...emptyOverview, ...response.data });
      }
    } catch (error) {
      console.error('Farmer dashboard error:', error);
      toast.error(error?.response?.data?.message || 'Failed to load farmer dashboard');
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

  const stats = [
    { label: 'Crop checks', value: overview.summary.cropDetections, helper: 'Disease detection records', icon: FaLeaf },
    { label: 'Soil checks', value: overview.summary.soilDetections, helper: 'Soil analysis records', icon: FaSeedling },
    { label: 'Weather updates', value: overview.summary.weatherUpdates, helper: 'Climate advice records', icon: FaCloudRain },
    { label: 'Messages', value: overview.summary.unreadMessages, helper: 'Admin updates received', icon: FaEnvelopeOpenText },
  ];

  const riskCards = [
    {
      label: 'Subscription',
      value: overview.subscription.status === 'active'
        ? `${planLabels[overview.subscription.plan] || 'Active'} plan`
        : 'Inactive',
      helper: overview.subscription.status === 'active'
        ? `${overview.subscription.currency || 'KES'} ${overview.subscription.amount || 0} plan expires ${formatDate(overview.subscription.expiresAt)}`
        : 'Choose a KES 200, 500, or 1000 monthly plan',
      icon: FaCreditCard,
    },
    {
      label: 'Crop yield outlook',
      value: overview.yieldOutlook.label,
      helper: `${overview.yieldOutlook.score}% field readiness score`,
      icon: FaChartLine,
    },
    {
      label: 'Drought status',
      value: overview.weatherSummary.droughtRisk === 'high' ? 'High risk' : 'Normal',
      helper: 'Based on heat, humidity, and weather risks',
      icon: FaExclamationTriangle,
    },
    {
      label: 'Rain update',
      value: overview.weatherSummary.rainOutlook,
      helper: `${Number(overview.weatherSummary.rainfallTotal || 0).toFixed(1)} mm forecast rain`,
      icon: FaTint,
    },
  ];

  return (
    <div className="min-h-screen bg-[#dfe7dc]">
      <DashboardNavbar title="Farmer Dashboard" subtitle="Your farm workspace" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative isolate overflow-hidden rounded-[28px] bg-[#12381e] p-6 text-white shadow-2xl shadow-green-950/10 sm:p-8 lg:p-10">
          <img
            src="https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1600&q=80"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-green-950/70" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#12381e]/95 via-[#2f7044]/55 to-[#12381e]/60" />

          <div className="grid gap-8 lg:grid-cols-[1fr_0.86fr] lg:items-end">
            <div className="rounded-[22px] border border-white/15 bg-white/10 p-6 backdrop-blur-md">
              <span className="mb-7 inline-flex rounded-full bg-[#dfff67] px-4 py-2 text-xs font-black uppercase text-[#12381e]">
                Farmer command center
              </span>
              <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
                {greeting}, {user?.name?.split(' ')[0] || 'Farmer'}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">
                Track crop disease checks, soil health, yield risk, drought/rain updates, and messages from SMART FARM support.
              </p>
            </div>

            <div className="rounded-[22px] border border-white/15 bg-white/10 p-6 backdrop-blur-md">
              <p className="text-xs font-black uppercase text-[#dfff67]">Today’s priority</p>
              <h2 className="mt-2 text-3xl font-black">
                {overview.summary.activeRisks > 0 ? 'Review farm risks' : 'Farm records look stable'}
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/70">
                {loading
                  ? 'Loading your latest farm records...'
                  : `${overview.summary.activeRisks} active risk signal${overview.summary.activeRisks === 1 ? '' : 's'} found from crop, soil, and climate data.`}
              </p>
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
          {riskCards.map((card) => (
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

        <section className="mt-6 rounded-lg border border-green-900/10 bg-[#fbfdf8] p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-xs font-black uppercase text-[#37794d]">Quick actions</p>
            <h2 className="mt-2 text-2xl font-black text-[#18361f]">Open farm tools</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => (
              <Link key={action.title} to={action.path} className="group rounded-lg border border-green-900/10 bg-white p-5 transition hover:border-[#37794d]/40 hover:shadow-lg">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
                  {React.createElement(action.icon)}
                </div>
                <h3 className="font-black text-[#18361f]">{action.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{action.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-[#37794d]">
                  Launch
                  <FaArrowRight className="transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-green-900/10 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-[#37794d]">Farm access plan</p>
              <h2 className="mt-2 text-2xl font-black text-[#18361f]">
                {overview.subscription.status === 'active'
                  ? `${planLabels[overview.subscription.plan] || 'Active'} subscription is active`
                  : 'Choose a subscription to keep farm tools active'}
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                Plans are available at KES 200, KES 500, and KES 1000 for crop, soil, weather, and support workflows.
              </p>
            </div>
            <Link
              to="/subscription"
              className="inline-flex w-fit items-center gap-3 rounded-full bg-[#12381e] px-5 py-3 text-sm font-black text-white transition hover:bg-[#37794d]"
            >
              Manage plan
              <FaArrowRight />
            </Link>
          </div>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr]">
          <RecordPanel
            title="Crop detection records"
            label="Crop health"
            emptyText={loading ? 'Loading crop records...' : 'No crop disease detections yet.'}
            records={overview.cropRecords}
            renderRecord={(record) => (
              <>
                <h3 className="font-black capitalize text-[#18361f]">{record.cropType || 'Crop analysis'}</h3>
                <p className="mt-1 text-sm text-stone-500">
                  {record.detectedDisease || 'Diagnosis pending'} - severity {record.severity || 'pending'}
                </p>
                <p className="mt-1 text-xs font-semibold text-stone-400">{formatDate(record.createdAt)}</p>
              </>
            )}
          />

          <RecordPanel
            title="Soil detection records"
            label="Soil health"
            emptyText={loading ? 'Loading soil records...' : 'No soil detection records yet.'}
            records={overview.soilRecords}
            renderRecord={(record) => (
              <>
                <h3 className="font-black capitalize text-[#18361f]">{record.soilType || 'Unknown soil'}</h3>
                <p className="mt-1 text-sm text-stone-500">
                  Fertility {record.analysis?.fertility || 'not recorded'} - organic matter {record.analysis?.organicMatter || 'not recorded'}
                </p>
                <p className="mt-1 text-xs font-semibold text-stone-400">{formatDate(record.createdAt)}</p>
              </>
            )}
          />
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <aside className="rounded-lg border border-green-900/10 bg-[#12381e] p-6 text-white shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
              <FaCloudSun />
            </div>
            <p className="mt-6 text-xs font-black uppercase text-[#dfff67]">Climate guidance</p>
            <h2 className="mt-2 text-2xl font-black">Drought and rain update</h2>
            <p className="mt-4 text-sm leading-6 text-white/70">
              {overview.weatherSummary.advice?.plantingAdvice ||
                overview.weatherSummary.advice?.irrigationNeeds ||
                'No weather advice yet. Open Weather Advisory to generate your first update.'}
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/10 p-4">
                <p className="text-2xl font-black text-[#dfff67]">
                  {overview.weatherSummary.currentTemperature ? `${overview.weatherSummary.currentTemperature}C` : '--'}
                </p>
                <p className="mt-1 text-xs text-white/65">Temperature</p>
              </div>
              <div className="rounded-lg bg-white/10 p-4">
                <p className="text-2xl font-black text-[#dfff67]">
                  {overview.weatherSummary.currentHumidity ? `${overview.weatherSummary.currentHumidity}%` : '--'}
                </p>
                <p className="mt-1 text-xs text-white/65">Humidity</p>
              </div>
            </div>
          </aside>

          <div className="rounded-lg border border-green-900/10 bg-[#fbfdf8] p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
                <FaEnvelopeOpenText />
              </div>
              <div>
                <p className="text-xs font-black uppercase text-[#37794d]">SMART FARM messages</p>
                <h2 className="text-2xl font-black text-[#18361f]">Updates from admin</h2>
              </div>
            </div>
            <div className="grid gap-3">
              {overview.messages.length ? (
                overview.messages.map((message) => (
                  <article key={message._id} className="rounded-lg border border-green-900/10 bg-white p-5">
                    <span className="rounded-full bg-[#eef8f1] px-3 py-1 text-xs font-black capitalize text-[#37794d]">
                      {message.category}
                    </span>
                    <h3 className="mt-4 font-black text-[#18361f]">{message.subject}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{message.message}</p>
                    <p className="mt-3 text-xs font-semibold text-stone-400">{formatDate(message.createdAt)}</p>
                  </article>
                ))
              ) : (
                <div className="rounded-lg bg-white p-6 text-sm font-semibold text-stone-500">
                  {loading ? 'Loading messages...' : 'No admin messages yet.'}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const RecordPanel = ({ title, label, records, emptyText, renderRecord }) => (
  <div className="rounded-lg border border-green-900/10 bg-[#fbfdf8] p-6 shadow-sm">
    <div className="mb-6">
      <p className="text-xs font-black uppercase text-[#37794d]">{label}</p>
      <h2 className="mt-2 text-2xl font-black text-[#18361f]">{title}</h2>
    </div>
    <div className="overflow-hidden rounded-lg border border-green-900/10">
      {records.length ? (
        records.map((record) => (
          <div key={record._id} className="border-b border-green-900/10 bg-white p-5 last:border-b-0">
            {renderRecord(record)}
          </div>
        ))
      ) : (
        <div className="bg-white p-6 text-sm font-semibold text-stone-500">{emptyText}</div>
      )}
    </div>
  </div>
);

export default FarmerDashboard;
