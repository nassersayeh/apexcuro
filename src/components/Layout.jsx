import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Layout = ({ children }) => {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      <nav className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <div className="mb-6">
          <h2 className="text-xl font-bold">{t('dashboard.title')}</h2>
          <p className="text-sm">{t('dashboard.welcome', { name: user?.username || '' })}</p>
        </div>
        <NavLink to="/dashboard" className="block py-2 hover:bg-gray-700 rounded">
          {t('dashboard.title')}
        </NavLink>
        {user?.role === 'Super Admin' && (
          <NavLink to="/users" className="block py-2 hover:bg-gray-700 rounded">
            {t('users.title')}
          </NavLink>
        )}
        <NavLink to="/properties" className="block py-2 hover:bg-gray-700 rounded">
          {t('properties.title')}
        </NavLink>
        <NavLink to="/leads" className="block py-2 hover:bg-gray-700 rounded">
          {t('leads.title')}
        </NavLink>
        {user?.role === 'Super Admin' && (
          <NavLink to="/requests" className="block py-2 hover:bg-gray-700 rounded">
            {t('requests.title')}
          </NavLink>
        )}
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
        >
          {t('dashboard.logout')}
        </button>
      </nav>
      <main className="flex-grow p-4">{children}</main>
    </div>
  );
};

export default Layout;