import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import NavBar from '../components/landing/NavBar';

const ContactPage = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    company_size: '',
    country: '',
  });
  const [errors, setErrors] = useState({});
  const [modal, setModal] = useState({ isOpen: false, message: '', isError: false });

  const validateForm = () => {
    const newErrors = {};
    if (!form.first_name) newErrors.first_name = t('landing.demo.errors.first_name');
    if (!form.last_name) newErrors.last_name = t('landing.demo.errors.last_name');
    if (!form.email) {
      newErrors.email = t('landing.demo.errors.email');
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = t('landing.demo.errors.email_invalid');
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      await axios.post('https://crm.aipilot.ps/api/contacts', form);
      setModal({ isOpen: true, message: t('landing.demo.success'), isError: false });
      setForm({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        company_name: '',
        company_size: '',
        country: '',
      });
      setErrors({});
    } catch (error) {
      setModal({ isOpen: true, message: t('landing.demo.error'), isError: true });
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, message: '', isError: false });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavBar />
      <main className="flex-grow pt-16">
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary mb-8">{t('landing.demo.title')}</h2>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
              <div className="mb-4">
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  placeholder={t('landing.demo.first_name')}
                  className={`w-full p-3 rounded border ${errors.first_name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-primary`}
                  required
                />
                {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder={t('landing.demo.last_name')}
                  className={`w-full p-3 rounded border ${errors.last_name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-primary`}
                  required
                />
                {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t('landing.demo.email')}
                  className={`w-full p-3 rounded border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:border-primary`}
                  required
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              <div className="mb-4">
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={t('landing.demo.phone')}
                  className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:border-primary"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="company_name"
                  value={form.company_name}
                  onChange={handleChange}
                  placeholder={t('landing.demo.company_name')}
                  className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:border-primary"
                />
              </div>
              <div className="mb-4">
                <select
                  name="company_size"
                  value={form.company_size}
                  onChange={handleChange}
                  className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:border-primary"
                >
                  <option value="">{t('landing.demo.company_size')}</option>
                  {Object.entries(t('landing.demo.company_size_options', { returnObjects: true })).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <select
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:border-primary"
                >
                  <option value="">{t('landing.demo.country')}</option>
                  {Object.entries(t('landing.demo.country_options', { returnObjects: true })).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white px-6 py-3 rounded hover:bg-blue-700 transition"
              >
                {t('landing.demo.submit')}
              </button>
            </form>
          </div>
        </section>
      </main>

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
              {t('landing.demo.close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactPage;