import { useTranslation } from 'react-i18next';
import NavBar from '../components/landing/NavBar';
import Footer from '../components/landing/Footer';

const FeaturesPage = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      <main className="flex-grow pt-16 bg-gray-100">
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">{t('landing.features.title')}</h2>
            <p className="text-lg text-gray-600 mb-12">{t('landing.features.subtitle')}</p>
            <div className="space-y-16">
              {/* Feature 1: Property Listings */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <img
                    src="https://images.surferseo.art/8d4bc73c-e7c6-4b62-bcf7-ed973f42e01e.jpeg"
                    alt={t('landing.features.feature1_title')}
                    className="rounded-lg shadow-lg w-full"
                  />
                </div>
                <div className="md:w-1/2 md:pl-8 text-left">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">{t('landing.features.feature1_title')}</h3>
                  <p className="text-gray-600">{t('landing.features.feature1_desc')}</p>
                </div>
              </div>
              {/* Feature 2: Client Lists */}
              <div className="flex flex-col md:flex-row-reverse items-center">
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <img
                    src="https://www.leadforensics.com/wp-content/uploads/2022/09/MicrosoftTeams-image-1.jpg"
                    alt={t('landing.features.feature2_title')}
                    className="rounded-lg shadow-lg w-full"
                  />
                </div>
                <div className="md:w-1/2 md:pr-8 text-left">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">{t('landing.features.feature2_title')}</h3>
                  <p className="text-gray-600">{t('landing.features.feature2_desc')}</p>
                </div>
              </div>
              {/* Feature 3: User Management */}
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <img
                    src="https://pluginrepublic.com/wp-content/uploads/2023/07/woocommerce-user-roles-graphic.jpg"
                    alt={t('landing.features.feature3_title')}
                    className="rounded-lg shadow-lg w-full"
                  />
                </div>
                <div className="md:w-1/2 md:pl-8 text-left">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-4">{t('landing.features.feature3_title')}</h3>
                  <p className="text-gray-600">{t('landing.features.feature3_desc')}</p>
                </div>
              </div>
            </div>
            <a
              href="/demo"
              className="inline-block mt-12 bg-primary text-white px-6 py-3 rounded hover:bg-blue-700 transition"
            >
              {t('landing.hero.cta_primary')}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FeaturesPage;