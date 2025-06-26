import { useTranslation } from 'react-i18next';

const Features = () => {
  const { t } = useTranslation();

  return (
    <section id="features" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-primary mb-4">
          {t('landing.features.title')}
        </h2>
        <p className="text-lg text-gray-600 text-center mb-12">
          {t('landing.features.subtitle')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gray-100 rounded-lg shadow hover:scale-105 transition-transform duration-300">
            <div className="text-accent text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t('landing.features.feature1_title')}
            </h3>
            <p className="text-gray-600">{t('landing.features.feature1_desc')}</p>
          </div>
          <div className="text-center p-6 bg-gray-100 rounded-lg shadow hover:scale-105 transition-transform duration-300">
            <div className="text-accent text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t('landing.features.feature2_title')}
            </h3>
            <p className="text-gray-600">{t('landing.features.feature2_desc')}</p>
          </div>
          <div className="text-center p-6 bg-gray-100 rounded-lg shadow hover:scale-105 transition-transform duration-300">
            <div className="text-accent text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t('landing.features.feature3_title')}
            </h3>
            <p className="text-gray-600">{t('landing.features.feature3_desc')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;