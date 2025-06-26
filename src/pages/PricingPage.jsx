import { useTranslation } from 'react-i18next';
import NavBar from '../components/landing/NavBar';
import Footer from '../components/landing/Footer';

const PricingPage = () => {
  const { t } = useTranslation();
  const getFeatures = (key) => {
    const features = t(key, { returnObjects: true });
    return Array.isArray(features) ? features : [];
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-16 bg-gray-100">
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">{t('landing.pricing.title')}</h2>
            <p className="text-lg text-gray-600 mb-12">{t('landing.pricing.subtitle')}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Free Plan */}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{t('landing.pricing.free.title')}</h3>
                <p className="text-4xl font-bold text-primary mb-4">{t('landing.pricing.free.price')}</p>
                <p className="text-gray-600 mb-6">{t('landing.pricing.free.description')}</p>
                <ul className="text-left text-gray-600 mb-8">
                  {getFeatures('landing.pricing.free.features').map((feature, index) => (
                    <li key={index} className="mb-2">✓ {feature}</li>
                  ))}
                </ul>
                <a
                  href="/signup"
                  className="block bg-primary text-white px-6 py-3 rounded hover:bg-blue-700 transition"
                >
                  {t('landing.pricing.free.cta')}
                </a>
              </div>
              {/* Pro Plan */}
              <div className="bg-white p-8 rounded-lg shadow-md border-2 border-primary">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{t('landing.pricing.pro.title')}</h3>
                <p className="text-4xl font-bold text-primary mb-2">{t('landing.pricing.pro.price_monthly')}</p>
                <p className="text-gray-600 mb-4">{t('landing.pricing.pro.price_yearly')}</p>
                <p className="text-gray-600 mb-6">{t('landing.pricing.pro.description')}</p>
                <ul className="text-left text-gray-600 mb-8">
                  {getFeatures('landing.pricing.pro.features').map((feature, index) => (
                    <li key={index} className="mb-2">✓ {feature}</li>
                  ))}
                </ul>
                <a
                  href="/signup"
                  className="block bg-primary text-white px-6 py-3 rounded hover:bg-blue-700 transition"
                >
                  {t('landing.pricing.pro.cta')}
                </a>
              </div>
              {/* Enterprise Plan */}
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{t('landing.pricing.enterprise.title')}</h3>
                <p className="text-4xl font-bold text-primary mb-2">{t('landing.pricing.enterprise.price_monthly')}</p>
                <p className="text-gray-600 mb-4">{t('landing.pricing.enterprise.price_yearly')}</p>
                <p className="text-gray-600 mb-6">{t('landing.pricing.enterprise.description')}</p>
                <ul className="text-left text-gray-600 mb-8">
                  {getFeatures('landing.pricing.enterprise.features').map((feature, index) => (
                    <li key={index} className="mb-2">✓ {feature}</li>
                  ))}
                </ul>
                <a
                  href="/demo"
                  className="block bg-primary text-white px-6 py-3 rounded hover:bg-blue-700 transition"
                >
                  {t('landing.pricing.enterprise.cta')}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PricingPage;