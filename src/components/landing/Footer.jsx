import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{t('landing.footer.company')}</h3>
            <a href='/about-us' className="text-gray-400">{t('landing.footer.about')}</a>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">{t('landing.footer.social')}</h3>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/company/apexcuro/" className="text-gray-400 hover:text-primary">LinkedIn</a>
              <a href="https://www.facebook.com/ApexCuro" className="text-gray-400 hover:text-primary">Facebook</a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">{t('landing.footer.contact')}</h3>
            <a href="/privacy-policy" className="text-gray-400 hover:text-primary block">{t('landing.footer.privacy')}</a>
            <a href="/terms-of-service" className="text-gray-400 hover:text-primary block">{t('landing.footer.terms')}</a>
          </div>
        </div>
        <p className="text-center text-gray-400 mt-8">
          © 2025 ApexCuro. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;