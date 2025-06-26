import React from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '../components/landing/Footer';
import NavBar from '../components/landing/NavBar'

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">

    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <NavBar/>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mt-9 text-center">{t('privacy.title')}</h1>
        <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('privacy.introduction')}</h2>
          <p className="text-gray-700">{t('privacy.introduction_description')}</p>
        </section>
        <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('privacy.data_collection')}</h2>
          <p className="text-gray-700">{t('privacy.data_collection_description')}</p>
        </section>
        <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('privacy.data_usage')}</h2>
          <p className="text-gray-700">{t('privacy.data_usage_description')}</p>
        </section>
        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('privacy.data_protection')}</h2>
          <p className="text-gray-700">{t('privacy.data_protection_description')}</p>
        </section>
      </div>
    </div>
      <Footer/>
    </div>
  );
};

export default PrivacyPolicy;