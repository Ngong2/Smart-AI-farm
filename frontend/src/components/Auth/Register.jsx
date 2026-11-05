import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FaArrowLeft,
  FaArrowRight,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLeaf,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaSeedling,
  FaUser,
} from 'react-icons/fa';
import { authAPI } from '../../services/api';

const cropOptions = ['Maize', 'Sorghum', 'Beans', 'Vegetables', 'Cassava', 'Millet'];

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    farmSize: '',
    primaryCrops: [],
    password: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleCropToggle = (crop) => {
    setFormData((previous) => {
      const exists = previous.primaryCrops.includes(crop);
      return {
        ...previous,
        primaryCrops: exists
          ? previous.primaryCrops.filter((item) => item !== crop)
          : [...previous.primaryCrops, crop],
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (step === 1) {
      setStep(2);
      return;
    }

    if (formData.primaryCrops.length === 0) {
      toast.error('Please select at least one crop');
      return;
    }

    setLoading(true);

    try {
      const data = await authAPI.register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone ? formData.phone.trim() : undefined,
        location: formData.location.trim(),
        farmSize: formData.farmSize ? parseFloat(formData.farmSize) : undefined,
        primaryCrops: formData.primaryCrops,
        password: formData.password,
      });

      if (data?.success) {
        toast.success('Account created successfully!');
        setTimeout(() => navigate('/login', { replace: true }), 1200);
      } else {
        toast.error(data?.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative isolate bg-[#dfe7dc] px-3 pb-6 sm:px-6 lg:px-8">
      <img
        src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1600&q=80"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-green-950/64 backdrop-blur-[1px]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#12381e]/95 via-[#2f7044]/45 to-[#12381e]/60" />

      <div className="mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-8 rounded-[28px] px-4 py-28 sm:px-8 lg:grid-cols-[1.12fr_0.88fr] lg:px-12">
        <section className="flex items-center justify-center">
          <div className="w-full max-w-2xl rounded-[24px] border border-white/20 bg-white/15 p-6 text-white shadow-2xl shadow-green-950/25 backdrop-blur-md sm:p-8">
            <span className="mb-7 inline-flex rounded-full bg-[#dfff67] px-4 py-2 text-xs font-black uppercase text-[#12381e]">
              Sign up
            </span>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-4xl font-black text-white">Join SMART FARM</h1>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  Create your farmer profile and start using AI-powered farm guidance.
                </p>
              </div>
              <div className="flex h-11 w-fit overflow-hidden rounded-full border border-white/20 bg-white/10 text-xs font-black">
                <span className={`px-4 py-3 ${step === 1 ? 'bg-[#dfff67] text-[#12381e]' : 'text-white/65'}`}>Profile</span>
                <span className={`px-4 py-3 ${step === 2 ? 'bg-[#dfff67] text-[#12381e]' : 'text-white/65'}`}>Crops</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
              {step === 1 && (
                <div className="grid gap-5 sm:grid-cols-2">
                  <InputField icon={<FaUser />} label="Full name" name="name" value={formData.name} onChange={handleChange} placeholder="John Ekai" required />
                  <InputField icon={<FaEnvelope />} label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="farmer@email.com" required />
                  <InputField icon={<FaPhone />} label="Phone optional" name="phone" value={formData.phone} onChange={handleChange} placeholder="254700000000" />
                  <InputField icon={<FaMapMarkerAlt />} label="Location" name="location" value={formData.location} onChange={handleChange} placeholder="Kakuma" required />
                  <InputField label="Farm size optional" name="farmSize" type="number" step="0.01" value={formData.farmSize} onChange={handleChange} placeholder="2.5 acres" />
                  <PasswordField showPassword={showPassword} setShowPassword={setShowPassword} value={formData.password} onChange={handleChange} />
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-xl font-black text-white">Select your primary crops</h2>
                  <p className="mt-2 text-sm text-white/70">Choose at least one crop so advice can be more relevant.</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    {cropOptions.map((crop) => {
                      const selected = formData.primaryCrops.includes(crop);
                      return (
                        <button
                          key={crop}
                          type="button"
                          onClick={() => handleCropToggle(crop)}
                          className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-4 text-sm font-black transition ${
                            selected
                              ? 'border-[#37794d] bg-[#dfff67] text-[#12381e]'
                              : 'border-white/20 bg-white/10 text-white hover:border-[#dfff67]/60 hover:bg-white/15'
                          }`}
                        >
                          <FaSeedling />
                          {crop}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex flex-1 items-center justify-center gap-3 rounded-full border border-white/25 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10"
                  >
                    <FaArrowLeft />
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex flex-1 items-center justify-center gap-3 rounded-full bg-[#dfff67] px-5 py-3 text-sm font-black text-[#12381e] transition hover:bg-[#edff8b] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Creating...' : step === 1 ? 'Next' : 'Create account'}
                  {!loading && <FaArrowRight />}
                </button>
              </div>
            </form>

            <p className="mt-7 text-center text-sm text-white/70">
              Already have an account?{' '}
              <Link to="/login" className="font-black text-[#dfff67] hover:text-[#edff8b]">
                Sign in
              </Link>
            </p>
          </div>
        </section>

        <section className="hidden text-white lg:block">
          <div className="rounded-[24px] border border-white/15 bg-white/10 p-8 shadow-2xl shadow-green-950/25 backdrop-blur-md">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#dfff67] text-[#12381e]">
              <FaLeaf />
            </div>
            <h2 className="max-w-md text-5xl font-black leading-[0.96]">
              Better advice starts with your farm profile
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-white/75">
              Crop type, location, and farm size help SMART FARM deliver more useful recommendations.
            </p>
            <div className="mt-8 grid gap-3">
              {['Personalized crop advice', 'Weather-aware planning', 'Soil and record tracking'].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/10 p-4 text-sm font-black">
                  <FaSeedling className="text-[#dfff67]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const inputClass =
  'w-full rounded-lg border border-white/20 bg-white/90 py-3 pl-11 pr-4 font-medium text-[#18361f] outline-none transition placeholder:text-stone-400 focus:border-[#dfff67] focus:ring-2 focus:ring-[#dfff67]/60';

const InputField = ({ icon, label, ...props }) => (
  <label className="grid gap-2 text-sm font-bold text-white">
    {label}
    <span className="relative">
      {icon && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#37794d]">{icon}</span>}
      <input {...props} className={icon ? inputClass : inputClass.replace('pl-11', 'pl-4')} />
    </span>
  </label>
);

const PasswordField = ({ showPassword, setShowPassword, value, onChange }) => (
  <label className="grid gap-2 text-sm font-bold text-white">
    Password
    <span className="relative">
      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#37794d]" />
      <input
        type={showPassword ? 'text' : 'password'}
        name="password"
        minLength={6}
        value={value}
        onChange={onChange}
        required
        placeholder="Create a password"
        className="w-full rounded-lg border border-white/20 bg-white/90 py-3 pl-11 pr-12 font-medium text-[#18361f] outline-none transition placeholder:text-stone-400 focus:border-[#dfff67] focus:ring-2 focus:ring-[#dfff67]/60"
      />
      <button
        type="button"
        onClick={() => setShowPassword((current) => !current)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-[#37794d]"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </span>
  </label>
);

export default Register;
