import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaArrowRight,
  FaCheckCircle,
  FaCreditCard,
  FaLeaf,
  FaMobileAlt,
  FaSeedling,
} from 'react-icons/fa';
import { farmerAPI } from '../../services/api';

const fallbackPlans = [
  {
    id: 'basic',
    name: 'Basic',
    amount: 200,
    currency: 'KES',
    durationDays: 30,
    features: ['Crop disease checks', 'Weather advisory', 'Farmer dashboard'],
  },
  {
    id: 'standard',
    name: 'Standard',
    amount: 500,
    currency: 'KES',
    durationDays: 30,
    features: ['Crop disease checks', 'Weather advisory', 'Soil health analysis', 'Farm record tracking'],
  },
  {
    id: 'premium',
    name: 'Premium',
    amount: 1000,
    currency: 'KES',
    durationDays: 30,
    features: ['Crop disease checks', 'Weather advisory', 'Soil health analysis', 'Farm record tracking', 'Admin support messages'],
  },
];

const emptySubscription = {
  plan: 'none',
  status: 'inactive',
  amount: 0,
  currency: 'KES',
  expiresAt: null,
};

const planStyles = {
  basic: {
    icon: FaLeaf,
    image: 'https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=900&q=80',
  },
  standard: {
    icon: FaSeedling,
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=900&q=80',
  },
  premium: {
    icon: FaCreditCard,
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=900&q=80',
  },
};

const formatDate = (value) => {
  if (!value) return 'Not active';
  return new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const Subscription = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState(fallbackPlans);
  const [subscription, setSubscription] = useState(emptySubscription);
  const [selectedPlan, setSelectedPlan] = useState('standard');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  const loadSubscription = useCallback(async () => {
    if (!localStorage.getItem('token')) {
      setPlans(fallbackPlans);
      setSubscription(emptySubscription);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await farmerAPI.getSubscription();
      if (response?.success) {
        setPlans(response.data.plans || fallbackPlans);
        setSubscription(response.data.subscription || emptySubscription);
        if (response.data.subscription?.plan && response.data.subscription.plan !== 'none') {
          setSelectedPlan(response.data.subscription.plan);
        }
      }
    } catch (error) {
      console.error('Subscription load error:', error);
      toast.error(error?.response?.data?.message || 'Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubscription();
  }, [loadSubscription]);

  const activePlan = useMemo(
    () => plans.find((plan) => plan.id === subscription.plan),
    [plans, subscription.plan]
  );

  const selectedPlanDetails = useMemo(
    () => plans.find((plan) => plan.id === selectedPlan) || plans[0],
    [plans, selectedPlan]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedPlanDetails) {
      toast.error('Please choose a plan');
      return;
    }

    if (!isAuthenticated) {
      toast.error('Please login to activate a subscription');
      navigate('/login');
      return;
    }

    if (!paymentPhone.trim()) {
      toast.error('Please enter the M-Pesa phone number');
      return;
    }

    setSubmitting(true);
    try {
      const response = await farmerAPI.subscribe({
        planId: selectedPlanDetails.id,
        paymentPhone: paymentPhone.trim(),
      });

      if (response?.success) {
        setSubscription(response.data.subscription);
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem(
          'user',
          JSON.stringify({
            ...currentUser,
            ...response.data.user,
            token: currentUser.token,
          })
        );
        toast.success(response.message || 'Subscription activated');
      }
    } catch (error) {
      console.error('Subscription submit error:', error);
      toast.error(error?.response?.data?.message || 'Failed to activate subscription');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#dfe7dc]">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="relative isolate overflow-hidden rounded-[28px] bg-[#12381e] p-6 text-white shadow-2xl shadow-green-950/10 sm:p-8 lg:p-10">
          <img
            src="https://images.unsplash.com/photo-1527847263472-aa5338d178b8?auto=format&fit=crop&w=1600&q=80"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-green-950/72" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#12381e]/95 via-[#2f7044]/55 to-[#12381e]/70" />

          <div className="grid gap-8 lg:grid-cols-[1fr_0.78fr] lg:items-end">
            <div>
              <span className="mb-7 inline-flex rounded-full bg-[#dfff67] px-4 py-2 text-xs font-black uppercase text-[#12381e]">
                Monthly access
              </span>
              <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
                Choose your SMART FARM subscription
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">
                Pick the plan that fits your farm work and keep crop, soil, weather, and record tools available from your dashboard.
              </p>
            </div>

            <div className="rounded-[22px] border border-white/15 bg-white/10 p-6 backdrop-blur-md">
              <p className="text-xs font-black uppercase text-[#dfff67]">Current plan</p>
              <h2 className="mt-2 text-3xl font-black">
                {subscription.status === 'active' && activePlan ? activePlan.name : 'No active plan'}
              </h2>
              <p className="mt-4 text-sm leading-6 text-white/70">
                {!isAuthenticated
                  ? 'You can compare all subscription features before login. Sign in only when you are ready to activate a plan.'
                  : subscription.status === 'active'
                  ? `${subscription.currency} ${subscription.amount} plan expires ${formatDate(subscription.expiresAt)}.`
                  : 'Select one of the KES 200, 500, or 1000 plans to activate access.'}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const isActive = subscription.status === 'active' && subscription.plan === plan.id;
            const Icon = planStyles[plan.id]?.icon || FaSeedling;

            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => setSelectedPlan(plan.id)}
                className={`group overflow-hidden rounded-lg border bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl ${
                  isSelected ? 'border-[#37794d] ring-2 ring-[#dfff67]' : 'border-green-900/10'
                }`}
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={planStyles[plan.id]?.image}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-green-950/85 via-green-950/10 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
                    <Icon />
                  </div>
                  {isActive && (
                    <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-black text-[#12381e]">
                      Active
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-xs font-black uppercase text-[#37794d]">{plan.durationDays} days</p>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <h2 className="text-2xl font-black text-[#18361f]">{plan.name}</h2>
                    <p className="text-3xl font-black text-[#18361f]">
                      {plan.amount}
                      <span className="text-sm text-stone-500"> KES</span>
                    </p>
                  </div>
                  <div className="mt-5 grid gap-3">
                    {plan.features.map((feature) => (
                      <span key={feature} className="flex items-center gap-3 text-sm font-semibold text-stone-600">
                        <FaCheckCircle className="shrink-0 text-[#37794d]" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </section>

        <section className="mt-6 rounded-lg border border-green-900/10 bg-[#fbfdf8] p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-[#37794d]">Plan features</p>
              <h2 className="mt-2 text-2xl font-black text-[#18361f]">Compare what each subscription includes</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-stone-600">
              Every plan runs for 30 days. Higher plans include more farm tools and support from the SMART FARM dashboard.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <article
                  key={`${plan.id}-features`}
                  className={`rounded-lg border bg-white p-5 ${
                    isSelected ? 'border-[#37794d] shadow-lg shadow-green-950/10' : 'border-green-900/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-black text-[#18361f]">{plan.name}</h3>
                      <p className="mt-1 text-sm font-bold text-[#37794d]">
                        {plan.currency} {plan.amount}
                      </p>
                    </div>
                    {isSelected && (
                      <span className="rounded-full bg-[#dfff67] px-3 py-1 text-xs font-black text-[#12381e]">
                        Selected
                      </span>
                    )}
                  </div>

                  <div className="mt-5 grid gap-3">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-3 rounded-lg bg-[#eef8f1] px-4 py-3 text-sm font-bold text-[#18361f]">
                        <FaCheckCircle className="shrink-0 text-[#37794d]" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.82fr_1.18fr]">
          <aside className="rounded-lg border border-green-900/10 bg-[#fbfdf8] p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
              <FaMobileAlt />
            </div>
            <p className="mt-6 text-xs font-black uppercase text-[#37794d]">Selected plan</p>
            <h2 className="mt-2 text-3xl font-black text-[#18361f]">
              {selectedPlanDetails?.name || 'Plan'} - {selectedPlanDetails?.amount || 0} KES
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600">
              {isAuthenticated
                ? 'Enter the farmer payment phone number, then activate the selected monthly plan.'
                : 'Farmers can view all plan features here. Login when you are ready to activate the selected plan.'}
            </p>
            <div className="mt-5 grid gap-2">
              {(selectedPlanDetails?.features || []).map((feature) => (
                <span key={feature} className="flex items-center gap-3 text-sm font-bold text-[#18361f]">
                  <FaCheckCircle className="shrink-0 text-[#37794d]" />
                  {feature}
                </span>
              ))}
            </div>
          </aside>

          <form onSubmit={handleSubmit} className="rounded-lg border border-green-900/10 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-xs font-black uppercase text-[#37794d]">Payment details</p>
              <h2 className="mt-2 text-2xl font-black text-[#18361f]">Activate subscription</h2>
            </div>

            <label className="grid gap-2 text-sm font-bold text-[#18361f]">
              M-Pesa phone number
              <input
                type="tel"
                value={paymentPhone}
                onChange={(event) => setPaymentPhone(event.target.value)}
                placeholder="254700000000"
                className="w-full rounded-lg border border-green-900/10 bg-[#fbfdf8] px-4 py-3 font-medium text-[#18361f] outline-none transition placeholder:text-stone-400 focus:border-[#37794d] focus:ring-2 focus:ring-[#dfff67]/70"
              />
            </label>

            <div className="mt-5 rounded-lg bg-[#eef8f1] p-4 text-sm font-semibold leading-6 text-[#18361f]">
              {!isAuthenticated
                ? `Login to subscribe to ${selectedPlanDetails?.name || 'this'} plan for ${selectedPlanDetails?.currency || 'KES'} ${selectedPlanDetails?.amount || 0}.`
                : loading
                ? 'Loading subscription status...'
                : `You are activating ${selectedPlanDetails?.name || 'this'} plan for ${selectedPlanDetails?.currency || 'KES'} ${selectedPlanDetails?.amount || 0}.`}
            </div>

            <button
              type="submit"
              disabled={submitting || loading}
              className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#12381e] px-5 py-3 text-sm font-black text-white transition hover:bg-[#37794d] disabled:cursor-not-allowed disabled:opacity-70 sm:w-fit"
            >
              {!isAuthenticated ? 'Login to activate plan' : submitting ? 'Activating...' : 'Activate plan'}
              {!submitting && <FaArrowRight />}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default Subscription;
