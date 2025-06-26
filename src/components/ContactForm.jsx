import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const ContactForm = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://crm.aipilot.ps/api/leads', form);
      setMessage(t('landing.form.success'));
      setForm({ name: '', email: '' });
    } catch (error) {
      setMessage(t('landing.form.error'));
    }
  };

  return (
    <section id="contact" className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">{t('landing.form.title')}</h2>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={t('landing.form.name')}
              className="w-full p-3 rounded text-gray-800 border border-gray-300 focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder={t('landing.form.email')}
              className="w-full p-3 rounded text-gray-800 border border-gray-300 focus:outline-none focus:border-primary"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white px-6 py-3 rounded hover:bg-blue-700 transition"
          >
            {t('landing.form.submit')}
          </button>
          {message && <p className="mt-4 text-gray-800">{message}</p>}
        </form>
      </div>
    </section>
  );
};

export default ContactForm;