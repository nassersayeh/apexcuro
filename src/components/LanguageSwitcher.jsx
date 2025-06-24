import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 rounded ${i18n.language === 'en' ? 'bg-primary text-white' : 'bg-gray-200'}`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('ar')}
        className={`px-2 py-1 rounded ${i18n.language === 'ar' ? 'bg-primary text-white' : 'bg-gray-200'}`}
      >
        عربي
      </button>
    </div>
  );
}

export default LanguageSwitcher;