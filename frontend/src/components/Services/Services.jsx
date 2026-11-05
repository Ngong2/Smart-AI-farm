import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaCamera,
  FaChartLine,
  FaCheckCircle,
  FaCloudSunRain,
  FaFlask,
  FaMapMarkedAlt,
  FaMobileAlt,
  FaSeedling,
} from 'react-icons/fa';

const heroImage =
  'https://images.unsplash.com/photo-1527847263472-aa5338d178b8?auto=format&fit=crop&w=1600&q=80';

const services = [
  {
    title: 'Crop Disease Detection',
    tag: 'AI vision',
    text: 'Upload a crop photo and receive disease guidance, risk signals, and treatment recommendations.',
    detail: 'Best for early leaf checks, pest pressure review, and repeat farm monitoring.',
    icon: FaCamera,
    image: 'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=900&q=80',
    path: '/crop/detect',
  },
  {
    title: 'Weather Advisory',
    tag: 'Forecasting',
    text: 'Plan planting, spraying, irrigation, and harvesting around local rainfall and heat conditions.',
    detail: 'Built for daily decisions where weather timing affects field work and crop survival.',
    icon: FaCloudSunRain,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80',
    path: '/weather',
  },
  {
    title: 'Soil Health Analysis',
    tag: 'Soil intelligence',
    text: 'Convert soil observations and reports into fertilizer, crop suitability, and improvement advice.',
    detail: 'Useful for improving productivity in dryland fields with limited inputs.',
    icon: FaFlask,
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80',
    path: '/soil',
  },
  {
    title: 'Farm Records',
    tag: 'Tracking',
    text: 'Keep crop checks, treatment history, soil reports, and advisory decisions organized over time.',
    detail: 'Helps farmers and support teams compare seasons and follow up on recommendations.',
    icon: FaMapMarkedAlt,
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=900&q=80',
    path: '/crop/history',
  },
];

const metrics = [
  ['98%', 'Crop check accuracy'],
  ['7X', 'Faster advisory decisions'],
  ['24/7', 'AI support access'],
  ['4', 'Core farm workflows'],
];

const workflow = [
  { icon: FaMobileAlt, title: 'Submit farm data', text: 'Use a phone to upload crop images, location details, soil inputs, or field notes.' },
  { icon: FaChartLine, title: 'Generate insight', text: 'SMART FARM analyzes the information against crop, soil, and weather intelligence.' },
  { icon: FaCheckCircle, title: 'Act with confidence', text: 'Farmers receive clear next steps for treatment, timing, and farm management.' },
];

const Services = () => {
  return (
    <div className="bg-[#dfe7dc] px-3 pb-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-[#fbfdf8] shadow-2xl shadow-green-950/10">
        <section className="relative isolate overflow-hidden px-6 pb-10 pt-28 text-white sm:px-10 lg:px-14">
          <img src={heroImage} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover" />
          <div className="absolute inset-0 -z-10 bg-green-950/60 backdrop-blur-[1px]" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#12381e]/95 via-[#2f7044]/60 to-[#12381e]/40" />

          <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-end">
            <div className="rounded-[24px] border border-white/15 bg-white/10 p-6 shadow-2xl shadow-green-950/20 backdrop-blur-md sm:p-8">
              <span className="mb-7 inline-flex rounded-full bg-[#dfff67] px-4 py-2 text-xs font-black uppercase text-[#12381e]">
                Professional services
              </span>
              <h1 className="max-w-3xl text-4xl font-black leading-[0.96] sm:text-5xl lg:text-6xl">
                Smart farm tools for every field decision
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-7 text-green-50/85">
                SMART FARM brings crop diagnosis, weather planning, soil intelligence, and farm records into one focused AI workflow for growers and agricultural partners.
              </p>
              <Link
                to="/contact"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#dfff67] px-5 py-3 text-sm font-black text-[#12381e] transition hover:bg-[#edff8b]"
              >
                Request support
                <FaArrowRight />
              </Link>
            </div>

            <div className="grid overflow-hidden rounded-[22px] border border-white/15 bg-white/10 shadow-2xl shadow-green-950/20 backdrop-blur-md sm:grid-cols-2">
              {metrics.map(([value, label]) => (
                <div key={label} className="border-b border-white/15 p-6 even:sm:border-l sm:[&:nth-child(n+3)]:border-b-0">
                  <div className="text-4xl font-black text-[#dfff67]">{value}</div>
                  <p className="mt-2 text-sm leading-5 text-white/70">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 sm:px-10 lg:px-14">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="text-xs font-black uppercase text-[#37794d]">Core services</span>
              <h2 className="mt-3 text-3xl font-black leading-tight text-[#18361f] sm:text-4xl">
                Practical intelligence, organized by farm need.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-stone-600">
              Each service is designed to turn farmer input into clear recommendations that can be used immediately in the field.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {services.map((service) => (
              <article key={service.title} className="grid overflow-hidden rounded-lg border border-green-900/10 bg-white shadow-sm sm:grid-cols-[0.78fr_1fr]">
                <div className="relative min-h-64">
                  <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-950/85 via-green-950/15 to-transparent" />
                  <div className="absolute bottom-5 left-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
                    {React.createElement(service.icon)}
                  </div>
                </div>
                <div className="flex flex-col p-6">
                  <span className="text-xs font-black uppercase text-[#37794d]">{service.tag}</span>
                  <h3 className="mt-2 text-2xl font-black text-[#18361f]">{service.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-stone-600">{service.text}</p>
                  <p className="mt-4 rounded-lg bg-[#eef8f1] p-4 text-sm font-semibold leading-6 text-[#18361f]">{service.detail}</p>
                  <Link
                    to={service.path}
                    className="mt-auto inline-flex w-fit items-center gap-3 pt-6 text-sm font-black text-[#37794d] transition hover:text-[#12381e]"
                  >
                    Open tool
                    <FaArrowRight />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-8 bg-[#eef8f1] px-6 py-16 sm:px-10 lg:grid-cols-[0.85fr_1.15fr] lg:px-14">
          <div>
            <span className="text-xs font-black uppercase text-[#37794d]">Delivery model</span>
            <h2 className="mt-3 text-3xl font-black leading-tight text-[#18361f] sm:text-4xl">
              From field signal to recommendation.
            </h2>
          </div>
          <div className="grid gap-4">
            {workflow.map((item, index) => (
              <div key={item.title} className="flex gap-4 rounded-lg bg-white p-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#37794d] text-white">
                  {React.createElement(item.icon)}
                </div>
                <div>
                  <span className="text-xs font-black text-[#d0df4a]">STEP 0{index + 1}</span>
                  <h3 className="mt-1 font-black text-[#18361f]">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-stone-600">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#12381e] px-6 py-12 text-white sm:px-10 lg:px-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-3xl font-black">Need a farm advisory setup?</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
                Contact SMART FARM for farmer onboarding, group support, extension programs, or service partnerships.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex w-fit items-center gap-3 rounded-full bg-[#dfff67] px-5 py-3 text-sm font-black text-[#12381e] transition hover:bg-[#edff8b]"
            >
              Contact team
              <FaArrowRight />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;
