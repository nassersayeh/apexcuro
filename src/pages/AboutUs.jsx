import React from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '../components/landing/Footer';
import NavBar from '../components/landing/NavBar'
const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">

    <div className="min-h-screen bg-gray-100 py-10 px-10 sm:px-6 lg:px-8">
      <NavBar/>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-900 mt-9 text-center">{t('about.title')}</h1>
        <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('about.vision')}</h2>
          <p className="text-gray-700">{t('about.vision_description')}</p>
        </section>
        <section className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('about.story')}</h2>
          <p className="text-gray-700">{t('about.story_description')}</p>
        </section>
        <section className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-900 mb-4">{t('about.services')}</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>{t('about.service1')}</li>
            <li>{t('about.service2')}</li>
            <li>{t('about.service3')}</li>
            <li>{t('about.service4')}</li>
          </ul>
        </section>
      </div>
    </div>
      <Footer/>
    </div>
  );
};

export default AboutUs;