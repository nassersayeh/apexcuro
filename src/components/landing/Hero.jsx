import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();
  return (
    <section id="home" className="bg-gray-100 min-h-screen flex items-center">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            {t('landing.hero.headline')}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {t('landing.hero.subheadline')}
          </p>
          <div className="flex space-x-4 justify-center md:justify-start">
            <a
              href="/demo"
              className="bg-primary text-white px-6 py-3 rounded hover:bg-blue-700 transition"
            >
              {t('landing.hero.cta_primary')}
            </a>
            <a
              href="#features"
              className="bg-secondary text-white px-6 py-3 rounded hover:bg-green-600 transition"
            >
              {t('landing.hero.cta_secondary')}
            </a>
          </div>
        </div>
        <div className="md:w-1/2 mt-8 md:mt-0">
          <img
            src="https://www.hubspot.com/hs-fs/hubfs/Homepage%20w_%20Customer%20Agent%20for%20Spotlight%20-%20Dimension%20Size%201216x838%20(1).png?width=2432&height=1682&name=Homepage%20w_%20Customer%20Agent%20for%20Spotlight%20-%20Dimension%20Size%201216x838%20(1).png"
            alt="ApexCuro Hero"
            className="rounded-lg shadow-lg w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;