import { Outlet, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { UserIcon, HomeIcon, BuildingOfficeIcon, UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

function Layout() {
  const { t } = useTranslation();

  const navItems = [
    { path: '/', icon: HomeIcon, label: t('dashboard.title') },
    { path: '/users', icon: UserIcon, label: t('users.title') },
    { path: '/properties', icon: BuildingOfficeIcon, label: t('properties.title') },
    { path: '/leads', icon: UserGroupIcon, label: t('leads.title') },
    { path: '/requests', icon: DocumentTextIcon, label: t('requests.title') },
  ];

  return (
    <div className="flex h-screen bg-accent">
      {/* Sidebar */}
      <div className="w-64 bg-primary text-white flex flex-col">
        <div className="p-4 text-2xl font-bold">ApexCuro</div>
        <nav className="flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center p-4 space-x-2 ${isActive ? 'bg-secondary' : 'hover:bg-blue-700'}`
              }
            >
              <item.icon className="w-6 h-6" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">{t('dashboard.title')}</h1>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <div className="flex items-center space-x-2">
              <UserIcon className="w-6 h-6 text-primary" />
              <span>Admin</span>
            </div>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;