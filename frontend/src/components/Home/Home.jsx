import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaArrowRight,
  FaCamera,
  FaChevronDown,
  FaChevronUp,
  FaCloudSunRain,
  FaFlask,
  FaMobileAlt,
  FaSeedling,
} from 'react-icons/fa';

const farmImages = {
  drone:
    'https://images.unsplash.com/photo-1527847263472-aa5338d178b8?auto=format&fit=crop&w=1200&q=80',
  cropRows:
    'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1000&q=80',
  spraying:
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1000&q=80',
  field:
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80',
  aerial:
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80',
};

const benefits = [
  { value: '98%', label: 'Crop Health Accuracy' },
  { value: '7X', label: 'Faster Farm Decisions' },
  { value: '24/7', label: 'AI Field Monitoring' },
];

const serviceCards = [
  {
    title: 'Crop Diagnosis',
    description: 'Leaf disease detection from mobile photos',
    image: farmImages.cropRows,
  },
  {
    title: 'Weather Advisory',
    description: 'Rainfall and planting-window guidance',
    image: farmImages.spraying,
  },
  {
    title: 'Soil Intelligence',
    description: 'Nutrient recommendations for dryland crops',
    image: farmImages.field,
  },
];

const faqs = [
  {
    question: 'What type of crops does SMART FARM support?',
    answer:
      'SMART FARM supports common Turkana crops including maize, sorghum, vegetables, legumes, and orchard crops, with recommendations tailored to local conditions.',
  },
  {
    question: 'Do I need special equipment to use the AI tools?',
    answer:
      'No. Farmers can start with a phone camera for crop checks, location access for weather advice, and simple soil observations or reports.',
  },
  {
    question: 'Can the platform work in low-connectivity areas?',
    answer:
      'Yes. The experience is designed for low-bandwidth use, with lightweight screens and workflows that can be completed when connectivity returns.',
  },
  {
    question: 'How accurate is the crop disease detection?',
    answer:
      'The AI provides high-confidence guidance, but severe cases should still be confirmed with an extension officer or local agronomist.',
  },
  {
    question: 'Can SMART FARM help me plan irrigation?',
    answer:
      'Yes. Weather, crop stage, and soil information are combined to suggest practical irrigation timing and water-saving actions.',
  },
];

const Home = () => {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="bg-[#dfe7dc] px-3 pb-6 pt-0 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-[#fbfdf8] shadow-2xl shadow-green-950/10">
        <section className="relative isolate overflow-hidden px-4 pb-5 pt-4 sm:px-6 lg:px-8">
          <img
            src={farmImages.aerial}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-green-950/55 backdrop-blur-[1px]" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#12381e]/80 via-[#2f7044]/35 to-[#12381e]/75" />

          <div className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
            <div className="flex min-h-[430px] flex-col justify-center rounded-[24px] border border-white/15 bg-white/10 px-4 py-10 shadow-2xl shadow-green-950/20 backdrop-blur-md sm:px-8 lg:px-10">
              <span className="mb-8 inline-flex w-fit items-center gap-2 rounded-full bg-[#dfff67] px-4 py-2 text-xs font-bold uppercase text-[#12381e]">
                AI farming for Turkana
              </span>
              <h1 className="max-w-xl text-4xl font-black leading-[0.96] text-white sm:text-5xl lg:text-6xl">
                Your trusted partner in smart farming
              </h1>
              <div className="mt-7 flex max-w-xl items-start gap-4">
                <span className="mt-3 h-px w-16 shrink-0 bg-[#dfff67]" />
                <p className="text-sm leading-6 text-green-50/85 sm:text-base">
                  Diagnose crop disease, read the weather, understand soil needs, and make confident farm decisions with AI built for Turkana growers.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-3 rounded-full bg-[#dfff67] px-5 py-3 text-sm font-bold text-[#12381e] shadow-lg shadow-green-950/20 transition hover:-translate-y-0.5 hover:bg-[#edff8b]"
                >
                  Start free
                  <FaArrowRight className="text-xs" />
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-3 rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Explore tools
                </Link>
              </div>
            </div>

            <article className="relative min-h-[430px] overflow-hidden rounded-[24px] border border-white/15 bg-white/10 shadow-2xl shadow-green-950/20 backdrop-blur-md">
              <img
                src={farmImages.drone}
                alt="Agricultural drone flying above crop rows"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-950/80 via-green-950/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="max-w-md text-sm font-semibold leading-6">
                  SMART FARM combines crop imaging, weather intelligence, and soil reports to give growers fast, practical next steps.
                </p>
              </div>
            </article>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_0.72fr]">
            <div className="relative min-h-48 overflow-hidden rounded-[20px] border border-white/15 bg-white/10 shadow-xl shadow-green-950/20 backdrop-blur-md">
              <img src={farmImages.cropRows} alt="Green crop rows" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-green-950/80 to-green-950/10" />
              <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                <strong className="text-2xl">500+</strong>
                <span className="text-sm font-bold">Farmers supported</span>
                <p className="mt-2 max-w-xs text-xs leading-5 text-white/80">
                  Local crop checks, advisory history, and farm planning in one place.
                </p>
              </div>
            </div>

            <div className="rounded-[20px] border border-white/15 bg-white/10 p-6 text-white shadow-xl shadow-green-950/20 backdrop-blur-md">
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
                <FaSeedling />
              </div>
              <h2 className="text-xl font-black">About SMART FARM</h2>
              <p className="mt-3 text-sm leading-6 text-green-50/85">
                An AI farm assistant for crop detection, soil guidance, and weather-aware planning, made for practical decisions in the field.
              </p>
            </div>

            <div className="rounded-[20px] border border-white/30 bg-[#dfff67]/85 p-6 text-[#12381e] shadow-xl shadow-green-950/20 backdrop-blur-md">
              <p className="text-sm font-bold leading-6">
                From disease detection to irrigation timing, your farm data becomes clear, timely advice.
              </p>
              <Link
                to="/contact"
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#2f7044] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#12381e]"
              >
                Get in touch
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-black leading-tight text-[#18361f] sm:text-5xl">
              Reap the rewards of using SMART FARM AI
            </h2>
          </div>

          <div className="mx-auto mt-12 overflow-hidden rounded-lg border border-green-900/10 bg-white">
            <div className="grid md:grid-cols-3">
              {benefits.map((benefit) => (
                <div key={benefit.label} className="border-b border-green-900/10 px-6 py-8 text-center md:border-b-0 md:border-r last:md:border-r-0">
                  <div className="text-4xl font-black text-[#37794d] sm:text-5xl">{benefit.value}</div>
                  <p className="mt-2 text-sm font-medium text-stone-500">{benefit.label}</p>
                </div>
              ))}
            </div>
            <div className="grid border-t border-green-900/10 lg:grid-cols-[1.9fr_1fr]">
              <div className="p-6 sm:p-8">
                <h3 className="text-xl font-black text-[#18361f]">Automate routine farm checks</h3>
                <p className="mt-16 max-w-2xl text-sm leading-6 text-stone-600">
                  SMART FARM turns field observations into recommendations within minutes. It is practical farm intelligence for growers who need answers while the work is happening.
                </p>
              </div>
              <div className="grid border-t border-green-900/10 lg:border-l lg:border-t-0">
                {['Automation', 'Precision', 'Scalability', 'Sustainability'].map((item, index) => (
                  <div
                    key={item}
                    className={`flex items-center justify-center border-b border-green-900/10 px-5 py-4 text-sm font-semibold last:border-b-0 ${
                      index === 0 ? 'bg-[#37794d] text-white' : 'text-stone-500'
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2 className="rounded-tl-[18px] rounded-tr-[18px] bg-[#eef8f1] px-4 py-3 text-2xl font-black text-[#18361f] sm:text-3xl">
              Our Services
            </h2>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full bg-[#37794d] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#12381e]"
            >
              View all
              <FaArrowRight />
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {serviceCards.map((service) => (
              <article key={service.title} className="group relative min-h-56 overflow-hidden rounded-lg">
                <img src={service.image} alt={service.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 via-green-950/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h3 className="text-2xl font-black">{service.title}</h3>
                  <p className="mt-1 text-sm text-white/85">{service.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="relative min-h-[520px] overflow-hidden rounded-[20px]">
            <img src={farmImages.aerial} alt="Aerial view of cultivated fields" className="h-full min-h-[520px] w-full object-cover" />
            <div className="absolute inset-0 bg-green-950/10" />
            <div className="absolute inset-0 flex items-center justify-center p-5">
              <div className="max-w-md rounded-lg border-8 border-[#e8ffae] bg-[#eff9d8] text-center shadow-2xl shadow-green-950/30">
                <img src={farmImages.drone} alt="Drone inspection over crops" className="h-52 w-full object-cover" />
                <p className="p-5 text-sm font-bold leading-6 text-[#18361f]">
                  Farming is no longer guesswork. With SMART FARM, field intelligence moves into the hands of every grower.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[0.78fr_1.6fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-black leading-tight text-[#18361f] sm:text-4xl">
              Frequently asked questions
            </h2>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#37794d] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#12381e]"
            >
              Contact us
              <FaArrowRight />
            </Link>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <button
                  key={faq.question}
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : index)}
                  className="w-full rounded-lg border border-green-900/10 bg-white p-5 text-left shadow-sm transition hover:border-[#37794d]/40"
                >
                  <span className="flex items-start justify-between gap-4">
                    <span className="font-black text-[#18361f]">{faq.question}</span>
                    {isOpen ? <FaChevronUp className="mt-1 shrink-0 text-[#37794d]" /> : <FaChevronDown className="mt-1 shrink-0 text-[#37794d]" />}
                  </span>
                  {isOpen && <span className="mt-4 block text-sm leading-6 text-stone-600">{faq.answer}</span>}
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 bg-[#12381e] px-4 py-8 text-white sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {[
            { Icon: FaCamera, title: 'Crop AI', text: 'Photo diagnosis and treatment guidance' },
            { Icon: FaCloudSunRain, title: 'Weather', text: 'Localized alerts and planting advice' },
            { Icon: FaFlask, title: 'Soil', text: 'Fertilizer and crop suitability insights' },
            { Icon: FaMobileAlt, title: 'Mobile first', text: 'Simple workflows for field use' },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 rounded-lg border border-white/10 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
                {React.createElement(item.Icon)}
              </div>
              <div>
                <h3 className="font-black">{item.title}</h3>
                <p className="mt-1 text-sm leading-5 text-white/70">{item.text}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Home;
