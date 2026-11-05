import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaChartLine,
  FaCheckCircle,
  FaCloudSunRain,
  FaHandshake,
  FaLeaf,
  FaMapMarkedAlt,
  FaMobileAlt,
  FaSeedling,
  FaShieldAlt,
  FaUsers,
} from 'react-icons/fa';

const heroImage =
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80';

const fieldImage =
  'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1200&q=80';

const metrics = [
  ['500+', 'Farmers supported'],
  ['98%', 'Crop check accuracy'],
  ['24/7', 'AI guidance access'],
];

const values = [
  {
    icon: FaMobileAlt,
    title: 'Built for field use',
    text: 'Simple mobile workflows help farmers check crops, read advisories, and keep records without complex setup.',
  },
  {
    icon: FaCloudSunRain,
    title: 'Grounded in local conditions',
    text: 'Weather, soil, and crop recommendations are framed around practical decisions for Turkana dryland farming.',
  },
  {
    icon: FaUsers,
    title: 'Designed with communities',
    text: 'SMART FARM supports farmers, extension officers, groups, and local partners working toward better yields.',
  },
];

const process = [
  {
    icon: FaLeaf,
    title: 'Capture field data',
    text: 'Farmers submit crop images, soil information, crop choices, and location context.',
  },
  {
    icon: FaChartLine,
    title: 'Analyze with AI',
    text: 'The platform interprets disease signals, weather risk, soil needs, and farm history.',
  },
  {
    icon: FaCheckCircle,
    title: 'Recommend next steps',
    text: 'Farmers receive clear actions for treatment, irrigation, planting timing, and soil improvement.',
  },
];

const credibility = [
  { icon: FaShieldAlt, title: 'Responsible advice', text: 'AI recommendations are positioned as decision support, with expert review encouraged for severe cases.' },
  { icon: FaMapMarkedAlt, title: 'County focus', text: 'The platform is shaped around Turkana farmers and the realities of low-connectivity agricultural work.' },
  { icon: FaHandshake, title: 'Partner ready', text: 'Suitable for cooperatives, NGOs, extension teams, and institutions supporting farmer resilience.' },
];

const About = () => {
  return (
    <div className="bg-[#dfe7dc] px-3 pb-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-[#fbfdf8] shadow-2xl shadow-green-950/10">
        <section className="relative isolate overflow-hidden bg-[#2f7044]">
          <img src={heroImage} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-green-950/60" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#12381e]/95 via-[#2f7044]/75 to-[#12381e]/45" />

          <div className="grid min-h-[640px] gap-8 px-6 pb-10 pt-28 sm:px-10 lg:grid-cols-[1fr_0.86fr] lg:px-14">
            <div className="flex flex-col justify-center">
              <span className="mb-8 inline-flex w-fit rounded-full bg-[#dfff67] px-4 py-2 text-xs font-black uppercase text-[#12381e]">
                About SMART FARM
              </span>
              <h1 className="max-w-3xl text-4xl font-black leading-[0.96] text-white sm:text-5xl lg:text-6xl">
                Professional AI support for smarter agriculture
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-green-50/85">
                SMART FARM is an agricultural intelligence platform helping Turkana farmers diagnose crop problems, understand weather risk, improve soil decisions, and manage farm records from one simple digital experience.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-3 rounded-full bg-[#dfff67] px-5 py-3 text-sm font-black text-[#12381e] transition hover:bg-[#edff8b]"
                >
                  Explore services
                  <FaArrowRight />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 rounded-full border border-white/25 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10"
                >
                  Partner with us
                </Link>
              </div>
            </div>

            <div className="flex items-end">
              <div className="w-full rounded-[22px] border border-white/15 bg-white/10 p-5 text-white shadow-2xl shadow-green-950/25 backdrop-blur-md">
                <img src={fieldImage} alt="Healthy crops in a farm field" className="h-72 w-full rounded-[16px] object-cover" />
                <div className="grid gap-3 pt-5 sm:grid-cols-3">
                  {metrics.map(([value, label]) => (
                    <div key={label} className="rounded-lg bg-white/10 p-4">
                      <div className="text-2xl font-black text-[#dfff67]">{value}</div>
                      <p className="mt-1 text-xs leading-5 text-white/70">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 px-6 py-16 sm:px-10 lg:grid-cols-[0.82fr_1.18fr] lg:px-14">
          <div>
            <span className="text-xs font-black uppercase text-[#37794d]">What changed</span>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[#18361f] sm:text-4xl">
              From guesswork to guided farm decisions.
            </h2>
          </div>
          <p className="text-base leading-7 text-stone-600">
            Many farmers make decisions with limited access to specialists, fragmented weather information, and late crop disease detection. SMART FARM brings those signals together so farmers can move faster, protect crops earlier, and plan with more confidence.
          </p>
        </section>

        <section className="grid gap-6 px-6 pb-16 sm:px-10 lg:grid-cols-3 lg:px-14">
          {values.map((item) => (
            <article key={item.title} className="rounded-lg border border-green-900/10 bg-white p-6 shadow-sm">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
                {React.createElement(item.icon)}
              </div>
              <h2 className="text-xl font-black text-[#18361f]">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-stone-600">{item.text}</p>
            </article>
          ))}
        </section>

        <section className="bg-[#eef8f1] px-6 py-16 sm:px-10 lg:px-14">
          <div className="mb-10 max-w-2xl">
            <span className="text-xs font-black uppercase text-[#37794d]">How it works</span>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[#18361f] sm:text-4xl">
              A practical workflow for every farm check.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {process.map((item, index) => (
              <article key={item.title} className="rounded-lg bg-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#37794d] text-white">
                    {React.createElement(item.icon)}
                  </div>
                  <span className="text-4xl font-black text-[#dfff67]">0{index + 1}</span>
                </div>
                <h3 className="mt-8 text-xl font-black text-[#18361f]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[0.9fr_1.1fr] lg:px-14">
          <div>
            <span className="text-xs font-black uppercase text-[#37794d]">Trust and delivery</span>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[#18361f] sm:text-4xl">
              Built for farmers, useful for organizations.
            </h2>
            <p className="mt-5 text-sm leading-6 text-stone-600">
              SMART FARM can support individual growers as well as agricultural programs that need clear farmer-facing digital advisory tools.
            </p>
          </div>
          <div className="grid gap-4">
            {credibility.map((item) => (
              <div key={item.title} className="flex gap-4 rounded-lg border border-green-900/10 bg-white p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
                  {React.createElement(item.icon)}
                </div>
                <div>
                  <h3 className="font-black text-[#18361f]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-stone-600">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#12381e] px-6 py-12 text-white sm:px-10 lg:px-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-black">Ready to improve farm decisions?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                Explore the tools or contact the team to discuss farmer onboarding, partnerships, and support.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex w-fit items-center gap-3 rounded-full bg-[#dfff67] px-5 py-3 text-sm font-black text-[#12381e] transition hover:bg-[#edff8b]"
            >
              Contact us
              <FaArrowRight />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
