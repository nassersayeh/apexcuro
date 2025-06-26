import React from 'react';
import { useTranslation } from 'react-i18next';
import NavBar from '../components/landing/NavBar'
import Footer from '../components/landing/Footer'

const TermsOfService = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
            <NavBar/>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mt-9 text-center">{t('terms.title')}</h1>
        <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('terms.acceptance')}</h2>
          <p className="text-gray-700">{t('terms.acceptance_description')}</p>
        </section>
        <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('terms.usage')}</h2>
          <p className="text-gray-700">{t('terms.usage_description')}</p>
        </section>
        <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('terms.responsibility')}</h2>
          <p className="text-gray-700">{t('terms.responsibility_description')}</p>
        </section>
        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('terms.modification')}</h2>
          <p className="text-gray-700">{t('terms.modification_description')}</p>
        </section>
      </div>
      </div>
      <Footer/>
    </div>
  );
};

export default TermsOfService;