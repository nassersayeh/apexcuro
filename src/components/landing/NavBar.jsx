import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';

const NavBar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const handleLogout = async () => {
    try {
      await axios.post('https://crm.aipilot.ps/api/users/logout', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      logout();
      navigate('/login');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-primary">ApexCuro</div>
        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4 items-center">
          <a href="/" className="text-gray-700 hover:text-primary">{t('landing.nav.home')}</a>
          <a href="/features" className="text-gray-700 hover:text-primary">{t('landing.nav.features')}</a>
          <a href="/pricing" className="text-gray-700 hover:text-primary">{t('landing.nav.pricing')}</a>
          {user ? (
            <button onClick={handleLogout} className="text-gray-700 hover:text-primary">
              {t('dashboard.logout')}
            </button>
          ) : (
            <>
              <a href="/login" className="text-gray-700 hover:text-primary">{t('landing.nav.login')}</a>
              <a
                href="/signup"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                {t('landing.nav.signup')}
              </a>
            </>
          )}
          <button
            onClick={toggleLanguage}
            className="text-gray-700 hover:text-primary"
          >
            {t('landing.nav.language')}
          </button>
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-gray-700 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-2">
            <a href="/" className="text-gray-700 hover:text-primary">{t('landing.nav.home')}</a>
            <a href="/features" className="text-gray-700 hover:text-primary">{t('landing.nav.features')}</a>
            <a href="/pricing" className="text-gray-700 hover:text-primary">{t('landing.nav.pricing')}</a>
            {user ? (
              <button onClick={handleLogout} className="text-gray-700 hover:text-primary text-left">
                {t('dashboard.logout')}
              </button>
            ) : (
              <>
                <a href="/login" className="text-gray-700 hover:text-primary">{t('landing.nav.login')}</a>
                <a
                  href="/signup"
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  {t('landing.nav.signup')}
                </a>
              </>
            )}
            <button
              onClick={toggleLanguage}
              className="text-gray-700 hover:text-primary text-left"
            >
              {t('landing.nav.language')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;