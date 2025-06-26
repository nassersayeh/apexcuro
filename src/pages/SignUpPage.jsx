import React, { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import NavBar from '../components/landing/NavBar';

const SignUpPage = () => {
  const { t } = useTranslation();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    type: 'individual',
    plan: 'free',
    billingCycle: 'monthly', // New field for billing cycle
  });
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState({ isOpen: false, message: '', isError: false });
  const [showPayment, setShowPayment] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = t('signup.errors.username');
    if (!formData.email) {
      newErrors.email = t('signup.errors.email');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('signup.errors.email_invalid');
    }
    if (!formData.password) {
      newErrors.password = t('signup.errors.password');
    } else if (formData.password.length < 6) {
      newErrors.password = t('signup.errors.password_length');
    }
    if (!formData.type) newErrors.type = t('signup.errors.type');
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    if (name === 'plan' && value === 'pro') {
      setShowPayment(true);
    } else if (name === 'plan' && value === 'free') {
      setShowPayment(false);
    }
  };

  const handleBillingChange = (e) => {
    setFormData({ ...formData, billingCycle: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const response = await axios.post('https://crm.aipilot.ps/api/auth/signup', formData);
      const { token, user } = response.data;
      await login(token, user);
      setModal({ isOpen: true, message: t('signup.success'), isError: false });
      setTimeout(() => {
        setModal({ isOpen: false, message: '', isError: false });
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      const errorMsg = t(err.response?.data?.error) || t('signup.error');
      setModal({ isOpen: true, message: errorMsg, isError: true });
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, message: '', isError: false });
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-5 pt-14">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-primary mb-6 text-center">
            {t('signup.title')}
          </h1>
          <p className="text-gray-600 mb-4 text-center">{t('signup.subtitle')}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                {t('signup.username')}
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 ${errors.username ? 'border-red-500' : 'border-gray-300'} focus:ring-primary`}
                placeholder={t('signup.username_placeholder')}
                required
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                {t('signup.email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:ring-primary`}
                placeholder={t('signup.email_placeholder')}
                required
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('signup.password')}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:ring-primary`}
                placeholder={t('signup.password_placeholder')}
                required
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                {t('signup.type')}
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 ${errors.type ? 'border-red-500' : 'border-gray-300'} focus:ring-primary`}
              >
                <option value="individual">{t('signup.individual')}</option>
                <option value="organization">{t('signup.organization')}</option>
              </select>
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
            </div>
            <div>
              <label htmlFor="plan" className="block text-sm font-medium text-gray-700">
                {t('signup.choose_plan')}
              </label>
              <select
                id="plan"
                name="plan"
                value={formData.plan}
                onChange={handleChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="free">
                  {formData.type === 'individual' ? t('signup.free_plan') : '$0 for 1 month'}
                </option>
                <option value="pro">
                  {formData.type === 'individual' ? '$49.99/month or $449.99/year' : '$99.99/month or $999.99/year'}
                </option>
              </select>
            </div>
            {formData.plan === 'pro' && (
              <div>
                <label htmlFor="billingCycle" className="block text-sm font-medium text-gray-700">
                  {t('signup.billing_cycle')}
                </label>
                <select
                  id="billingCycle"
                  name="billingCycle"
                  value={formData.billingCycle}
                  onChange={handleBillingChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="monthly">{t('signup.monthly')}</option>
                  <option value="yearly">{t('signup.yearly')}</option>
                </select>
              </div>
            )}
            {showPayment && (
              <div className="bg-gray-100 p-4 rounded-lg mt-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Payment Details</h3>
                <p className="text-gray-600">Please enter your payment information below:</p>
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="w-full p-2 border rounded"
                    disabled
                  />
                  <input
                    type="text"
                    placeholder="Expiry Date (MM/YY)"
                    className="w-full p-2 border rounded"
                    disabled
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="w-full p-2 border rounded"
                    disabled
                  />
                  <input
                    type="text"
                    placeholder="Cardholder Name"
                    className="w-full p-2 border rounded"
                    disabled
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">* Payment processing will be implemented later.</p>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              {t('signup.submit')}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            {t('signup.already_have_account')}{' '}
            <Link to="/login" className="text-primary hover:underline">
              {t('signup.sign_in')}
            </Link>
          </p>
        </div>

        {/* Modal for Success/Error Messages */}
        {modal.isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
              <h3 className={`text-lg font-semibold ${modal.isError ? 'text-red-500' : 'text-green-500'}`}>
                {modal.message}
              </h3>
              <button
                onClick={closeModal}
                className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                {t('signup.close')}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SignUpPage;