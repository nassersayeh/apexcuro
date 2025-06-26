import { useContext, useEffect, useState } from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import * as XLSX from 'xlsx';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [tabData, setTabData] = useState(null);
  const [tabLoading, setTabLoading] = useState(false);
  const [tabError, setTabError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({});
  const [excelFile, setExcelFile] = useState(null);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('https://crm.aipilot.ps/api/stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Fetch stats error:', error.response?.data || error.message);
        setError(t('dashboard.error_fetching_data'));
        setLoading(false);
      }
    };
    fetchStats();
  }, [t]);

  useEffect(() => {
    const fetchTabData = async () => {
      setTabLoading(true);
      setTabError(null);
      try {
        let response;
        switch (activeTab) {
          case 'properties':
            response = await axios.get('https://crm.aipilot.ps/api/properties', {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            break;
          case 'leads':
            response = await axios.get('https://crm.aipilot.ps/api/clients', {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            break;
          case 'requests':
            if (user?.type === 'superAdmin') {
              response = await axios.get('https://crm.aipilot.ps/api/listings', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
              });
            }
            break;
          case 'users':
            if (user?.type === 'superAdmin') {
              response = await axios.get('https://crm.aipilot.ps/api/users', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
              });
            }
            break;
          default:
            break;
        }
        setTabData(response?.data || []);
      } catch (error) {
        console.error(`Fetch ${activeTab} error:`, error.response?.data || error.message);
        setTabError(t('dashboard.error_fetching_tab_data', { tab: t(`${activeTab}.title`) }));
      } finally {
        setTabLoading(false);
      }
    };
    fetchTabData();
  }, [activeTab, t, user?.type]);

  const chartData = stats?.properties_by_area
    ? {
        labels: stats.properties_by_area.map((item) => item._id),
        datasets: [
          {
            label: t('properties.title'),
            data: stats.properties_by_area.map((item) => item.count),
            backgroundColor: '#FFD700',
            borderColor: '#1E3A8A',
            borderWidth: 1,
          },
        ],
      }
    : null;

  const tabs = [
    { id: 'overview', label: t('dashboard.title'), icon: '📊' },
    { id: 'properties', label: t('properties.title'), icon: '🏠' },
    { id: 'leads', label: t('leads.title'), icon: '📩' },
    ...(user?.type === 'superAdmin'
      ? [
          { id: 'requests', label: t('requests.title'), icon: '📝' },
          { id: 'users', label: t('users.title'), icon: '👥' },
        ]
      : []),
  ];

  const handleLogout = () => {
    logout();
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('i18nextLng', newLang);
  };

  const handleAddModal = (type) => {
    setNewItem({ type });
    setShowAddModal(true);
  };

  const handleInputChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleExcelChange = (e) => {
    setExcelFile(e.target.files[0]);
  };

  const handleExcelUpload = async (type) => {
    if (!excelFile) return;
    const formData = new FormData();
    formData.append('file', excelFile);
    try {
      let endpoint;
      switch (type) {
        case 'properties':
          endpoint = 'https://crm.aipilot.ps/api/properties/import';
          break;
        case 'leads':
          endpoint = 'https://crm.aipilot.ps/api/clients/import';
          break;
        default:
          return;
      }
      const response = await axios.post(endpoint, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(t(`${type}.import_success`));
      setTabData(response.data);
      setExcelFile(null);
    } catch (error) {
      console.error(`${type} import error:`, error.response?.data || error.message);
      alert(t(`${type}.import_error`));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint;
      switch (newItem.type) {
        case 'property':
          endpoint = 'https://crm.aipilot.ps/api/properties';
          break;
        case 'lead':
          endpoint = 'https://crm.aipilot.ps/api/clients';
          break;
        case 'request':
          endpoint = 'https://crm.aipilot.ps/api/listings';
          break;
        case 'users':
          endpoint = 'https://crm.aipilot.ps/api/users';
          break;
        default:
          return;
      }
      const response = await axios.post(endpoint, newItem, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTabData([...tabData, response.data]);
      setShowAddModal(false);
      setNewItem({});
      alert(t(`${newItem.type}_added`));
    } catch (error) {
      console.error(`${newItem.type} add error:`, error.response?.data || error.message);
      alert(t(`${newItem.type}.error_adding_${newItem.type}`));
    }
  };

  const handleEdit = (item,type) => {
    setEditItem(item);
    setNewItem({ ...item, type: type || 'property' });
    setShowAddModal(true);
  };

  const handleDelete = async (id, type) => {
    if (window.confirm(t(`${type}.confirmDelete`))) {
      try {
        let endpoint;
        switch (type) {
          case 'properties':
            endpoint = `https://crm.aipilot.ps/api/properties/${id}`;
            break;
          case 'leads':
            endpoint = `https://crm.aipilot.ps/api/clients/${id}`;
            break;
          case 'requests':
            endpoint = `https://crm.aipilot.ps/api/listings/${id}`;
            break;
          case 'users':
            endpoint = `https://crm.aipilot.ps/api/users/${id}`;
            break;
          default:
            return;
        }
        await axios.delete(endpoint, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTabData(tabData.filter((item) => item._id !== id));
        alert(t(`${type}.${type}_deleted`));
      } catch (error) {
        console.error(`Delete ${type} error:`, error.response?.data || error.message);
        alert(t(`${type}.error_deleting_${type}`));
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let endpoint;
      switch (newItem.type) {
        case 'property':
          endpoint = `https://crm.aipilot.ps/api/properties/${editItem._id}`;
          break;
        case 'lead':
          endpoint = `https://crm.aipilot.ps/api/clients/${editItem._id}`;
          break;
        case 'request':
          endpoint = `https://crm.aipilot.ps/api/listings/${editItem._id}`;
          break;
        case 'users':
          endpoint = `https://crm.aipilot.ps/api/users/${editItem._id}`;
          break;
        default:
          return;
      }
      const response = await axios.put(endpoint, newItem, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTabData(tabData.map((item) => (item._id === editItem._id ? response.data : item)));
      setShowAddModal(false);
      setNewItem({});
      setEditItem(null);
      alert(t(`${newItem.type}.${newItem.type}_updated`));
    } catch (error) {
      console.error(`Update ${newItem.type} error:`, error.response?.data || error.message);
      alert(t(`${newItem.type}.error_updating_${newItem.type}`));
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-blue-900 text-white p-4 space-y-4">
        <h1 className="text-2xl font-bold text-gold-500 mb-6">ApexCuro</h1>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`w-full text-left p-2 rounded-lg hover:bg-gold-500 ${activeTab === tab.id ? 'bg-gold-500' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="flex-1 p-6 bg-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-900">
            {t('dashboard.welcome', { name: user?.username || '' })}
          </h2>
          <div className="space-x-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {t('dashboard.logout')}
            </button>
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {i18n.language === 'en' ? 'عربي' : 'English'}
            </button>
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        {loading && <p className="text-blue-900">{t('dashboard.loading')}</p>}
        {!loading && (
          <div>
            {tabLoading && <p className="text-blue-900">{t('dashboard.loading')}</p>}
            {tabError && <p className="text-red-500">{tabError}</p>}
            {!tabLoading && !tabError && (
              <div className="bg-white p-6 rounded-lg shadow-lg">
                {activeTab === 'overview' && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                        <h3 className="text-lg font-semibold text-blue-900">{t('properties.title')}</h3>
                        <p className="text-2xl text-gold-700">{stats.total_properties || 0}</p>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                        <h3 className="text-lg font-semibold text-blue-900">{t('leads.title')}</h3>
                        <p className="text-2xl text-gold-700">{stats.total_leads || 0}</p>
                      </div>
                      {user?.type === 'superAdmin' && (
                        <>
                          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                            <h3 className="text-lg font-semibold text-blue-900">{t('requests.title')}</h3>
                            <p className="text-2xl text-gold-700">{stats.total_requests || 0}</p>
                          </div>
                          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                            <h3 className="text-lg font-semibold text-blue-900">{t('users.title')}</h3>
                            <p className="text-2xl text-gold-700">{stats.total_users || 0}</p>
                          </div>
                        </>
                      )}
                    </div>
                    {chartData && (
                      <div className="mb-6">
                        <Bar
                          data={chartData}
                          options={{
                            plugins: {
                              title: { display: true, text: t('properties.title'), color: '#1E3A8A' },
                              legend: { display: true, position: 'top', labels: { color: '#1E3A8A' } },
                            },
                            scales: {
                              y: {
                                beginAtZero: true,
                                title: { display: true, text: t('properties.count'), color: '#1E3A8A' },
                                ticks: { color: '#1E3A8A' },
                              },
                              x: {
                                title: { display: true, text: t('dashboard.area'), color: '#1E3A8A' },
                                ticks: { color: '#1E3A8A' },
                              },
                            },
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
                {activeTab === 'properties' && (
                  <div>
                    <div className="flex justify-between mb-4">
                      <button
                        onClick={() => handleAddModal('property')}
                        className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        {t('properties.addProperty')}
                      </button>
                      <div>
                        <input
                          type="file"
                          accept=".xlsx, .xls"
                          onChange={handleExcelChange}
                          className="mr-2"
                        />
                        <button
                          onClick={() => handleExcelUpload('properties')}
                          className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          {t('properties.importExcel')}
                        </button>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-blue-900 mb-4">{t('dashboard.property_list')}</h3>
                    {tabData && (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-blue-900 text-white">
                            <th className="p-2 border">{t('properties.name')}</th>
                            <th className="p-2 border">{t('properties.unitNumber')}</th>
                            <th className="p-2 border">{t('properties.city')}</th>
                            <th className="p-2 border">{t('properties.price')}</th>
                            <th className="p-2 border">{t('properties.area')}</th>
                            <th className="p-2 border">{t('properties.status')}</th>
                            <th className="p-2 border">{t('properties.actions')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tabData.map((property) => (
                            <tr key={property._id} className="border">
                              <td className="p-2">{property.name || '-'}</td>
                              <td className="p-2">{property.unitNumber || '-'}</td>
                              <td className="p-2">{property.city || '-'}</td>
                              <td className="p-2">{property.price || '-'}</td>
                              <td className="p-2">{property.area || '-'}</td>
                              <td className="p-2">{property.status || '-'}</td>
                              <td className="p-2">
                                <button
                                  onClick={() => handleEdit(property,'property')}
                                  className="px-2 py-1 bg-blue-500 text-white rounded mr-2 hover:bg-blue-700"
                                >
                                  {t('properties.edit')}
                                </button>
                                <button
                                  onClick={() => handleDelete(property._id, 'properties')}
                                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                                >
                                  {t('properties.delete')}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
                {activeTab === 'leads' && (
                  <div>
                    <div className="flex justify-between mb-4">
                      <button
                        onClick={() => handleAddModal('lead')}
                        className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        {t('leads.addLead')}
                      </button>
                      <div>
                        <input
                          type="file"
                          accept=".xlsx, .xls"
                          onChange={handleExcelChange}
                          className="mr-2"
                        />
                        <button
                          onClick={() => handleExcelUpload('leads')}
                          className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          {t('leads.importExcel')}
                        </button>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-blue-900 mb-4">{t('dashboard.client_list')}</h3>
                    {tabData && (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-blue-900 text-white">
                            <th className="p-2 border">{t('leads.name')}</th>
                            <th className="p-2 border">{t('leads.email')}</th>
                            <th className="p-2 border">{t('leads.phone')}</th>
                            <th className="p-2 border">{t('leads.status')}</th>
                            <th className="p-2 border">{t('leads.actions')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tabData.map((lead) => (
                            <tr key={lead._id} className="border">
                              <td className="p-2">{lead.name || '-'}</td>
                              <td className="p-2">{lead.email || '-'}</td>
                              <td className="p-2">{lead.phone || '-'}</td>
                              <td className="p-2">{lead.status || '-'}</td>
                              <td className="p-2">
                                <button
                                  onClick={() => handleEdit(lead,'lead')}
                                  className="px-2 py-1 bg-blue-500 text-white rounded mr-2 hover:bg-blue-700"
                                >
                                  {t('leads.edit')}
                                </button>
                                <button
                                  onClick={() => handleDelete(lead._id, 'leads')}
                                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                                >
                                  {t('leads.delete')}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
                {user?.type === 'superAdmin' && activeTab === 'requests' && (
                  <div>
                    <button
                      onClick={() => handleAddModal('request')}
                      className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      {t('requests.addRequest')}
                    </button>
                    <h3 className="text-xl font-semibold text-blue-900 mb-4">{t('dashboard.requests_list')}</h3>
                    {tabData && (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-blue-900 text-white">
                            <th className="p-2 border">{t('requests.property_id')}</th>
                            <th className="p-2 border">{t('requests.client_name')}</th>
                            <th className="p-2 border">{t('requests.client_email')}</th>
                            <th className="p-2 border">{t('requests.request_type')}</th>
                            <th className="p-2 border">{t('requests.status')}</th>
                            <th className="p-2 border">{t('requests.actions')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tabData.map((request) => (
                            <tr key={request._id} className="border">
                              <td className="p-2">{request.property_id || '-'}</td>
                              <td className="p-2">{request.client_name || '-'}</td>
                              <td className="p-2">{request.client_email || '-'}</td>
                              <td className="p-2">{request.request_type || '-'}</td>
                              <td className="p-2">{request.status || '-'}</td>
                              <td className="p-2">
                                <button
                                  onClick={() => handleEdit(request,"request")}
                                  className="px-2 py-1 bg-blue-500 text-white rounded mr-2 hover:bg-blue-700"
                                >
                                  {t('requests.edit')}
                                </button>
                                <button
                                  onClick={() => handleDelete(request._id, 'requests')}
                                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                                >
                                  {t('requests.delete')}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
                {user?.type === 'superAdmin' && activeTab === 'users' && (
                  <div>
                    <form
                      onSubmit={handleSubmit}
                      className="bg-gray-200 p-4 rounded-lg mb-4"
                    >
                      <h3 className="text-xl font-semibold text-blue-900 mb-2">{t('users.addUser')}</h3>
                      <input
                        type="text"
                        name="username"
                        placeholder={t('users.username')}
                        onChange={handleInputChange}
                        className="w-full p-2 mb-2 border rounded"
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder={t('users.email')}
                        onChange={handleInputChange}
                        className="w-full p-2 mb-2 border rounded"
                      />
                      <input
                        type="password"
                        name="password"
                        placeholder={t('users.password')}
                        onChange={handleInputChange}
                        className="w-full p-2 mb-2 border rounded"
                      />
                      <select
                        name="role"
                        onChange={handleInputChange}
                        className="w-full p-2 mb-2 border rounded"
                      >
                        <option value="">{t('users.role')}</option>
                        <option value="admin">{t('users.admin')}</option>
                        <option value="salesManager">{t('users.salesManager')}</option>
                        <option value="backOffice">{t('users.backOffice')}</option>
                        <option value="broker">{t('users.broker')}</option>
                        <option value="agent">{t('users.agent')}</option>
                      </select>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        {t('users.save')}
                      </button>
                    </form>
                    <h3 className="text-xl font-semibold text-blue-900 mb-4">{t('dashboard.users_list')}</h3>
                    {tabData && (
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-blue-900 text-white">
                            <th className="p-2 border">{t('users.username')}</th>
                            <th className="p-2 border">{t('users.email')}</th>
                            <th className="p-2 border">{t('users.role')}</th>
                            <th className="p-2 border">{t('users.actions')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tabData.map((userItem) => (
                            <tr key={userItem._id} className="border">
                              <td className="p-2">{userItem.username}</td>
                              <td className="p-2">{userItem.email}</td>
                              <td className="p-2">{userItem.role}</td>
                              <td className="p-2">
                                <button
                                  onClick={() => handleEdit(userItem,'users')}
                                  className="px-2 py-1 bg-blue-500 text-white rounded mr-2 hover:bg-blue-700"
                                >
                                  {t('users.edit')}
                                </button>
                                <button
                                  onClick={() => handleDelete(userItem._id, 'users')}
                                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                                >
                                  {t('users.delete')}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">
                {t(`${newItem.type}_add${newItem.type === 'property' ? 'Property' : newItem.type === 'lead' ? 'Lead' : newItem.type === 'request' ? 'Request' : 'User'}`)}
              </h3>
              <form onSubmit={editItem ? handleUpdate : handleSubmit}>
                {newItem.type === 'property' && (
                  <>
                    <input
                      type="text"
                      name="unitNumber"
                      value={newItem.unitNumber || ''}
                      placeholder={t('properties.unitNumber')}
                      onChange={handleInputChange}
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                      type="text"
                      name="name"
                      value={newItem.name || ''}
                      placeholder={t('properties.name')}
                      onChange={handleInputChange}
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                      type="text"
                      name="area"
                      value={newItem.area || ''}
                      placeholder={t('properties.area')}
                      onChange={handleInputChange}
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                      type="text"
                      name="city"
                      value={newItem.city || ''}
                      placeholder={t('properties.city')}
                      onChange={handleInputChange}
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                      type="number"
                      name="price"
                      value={newItem.price || ''}
                      placeholder={t('properties.price')}
                      onChange={handleInputChange}
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <select
                      name="status"
                      value={newItem.status || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 mb-2 border rounded"
                    >
                      <option value="">{t('properties.status')}</option>
                      <option value="available">{t('properties.available')}</option>
                      <option value="sold">{t('properties.sold')}</option>
                      <option value="pending">{t('properties.pending')}</option>
                    </select>
                  </>
                )}
                {newItem.type === 'lead' && (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={newItem.name || ''}
                      placeholder={t('leads.name')}
                      onChange={handleInputChange}
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                      type="email"
                      name="email"
                      value={newItem.email || ''}
                      placeholder={t('leads.email')}
                      onChange={handleInputChange}
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                      type="text"
                      name="phone"
                      value={newItem.phone || ''}
                      placeholder={t('leads.phone')}
                      onChange={handleInputChange}
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <select
                      name="status"
                      value={newItem.status || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 mb-2 border rounded"
                    >
                      <option value="">{t('leads.status')}</option>
                      <option value="active">{t('leads.active')}</option>
                      <option value="inactive">{t('leads.inactive')}</option>
                    </select>
                  </>
                )}
                {newItem.type === 'request' && (
                  <>
                    <input
                      type="text"
                      name="property_id"
                      value={newItem.property_id || ''}
                      placeholder={t('requests.property_id')}
                      onChange={handleInputChange}
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                      type="text"
                      name="client_name"
                      value={newItem.client_name || ''}
                      placeholder={t('requests.client_name')}
                      onChange={handleInputChange}
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                      type="text"
                      name="client_phone"
                      value={newItem.client_phone || ''}
                      placeholder={t('requests.client_phone')}
                      onChange={handleInputChange}
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                      type="text"
                      name="client_email"
                      value={newItem.client_email || ''}
                      placeholder={t('requests.client_email')}
                      onChange={handleInputChange}
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <select
                      name="request_type"
                      value={newItem.request_type || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 mb-2 border rounded"
                    >
                      <option value="">{t('requests.request_type')}</option>
                      <option value="rent">{t('requests.rent')}</option>
                      <option value="sale">{t('requests.sale')}</option>
                    </select>
                    <select
                      name="status"
                      value={newItem.status || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 mb-2 border rounded"
                    >
                      <option value="">{t('requests.status')}</option>
                      <option value="pending">{t('requests.pending')}</option>
                      <option value="approved">{t('requests.approved')}</option>
                      <option value="rejected">{t('requests.rejected')}</option>
                    </select>
                  </>
                )}
                {newItem.type === 'users' && (
                  <>
                    <input
                      type="text"
                      name="username"
                      value={newItem.username || ''}
                      placeholder={t('users.username')}
                      onChange={handleInputChange}
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                      type="email"
                      name="email"
                      value={newItem.email || ''}
                      placeholder={t('users.email')}
                      onChange={handleInputChange}
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                      type="password"
                      name="password"
                      value={newItem.password || ''}
                      placeholder={t('users.password')}
                      onChange={handleInputChange}
                      className="w-full p-2 mb-2 border rounded"
                    />
                    <select
                      name="role"
                      value={newItem.role || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 mb-2 border rounded"
                    >
                      <option value="">{t('users.role')}</option>
                      <option value="admin">{t('users.admin')}</option>
                      <option value="salesManager">{t('users.salesManager')}</option>
                      <option value="backOffice">{t('users.backOffice')}</option>
                      <option value="broker">{t('users.broker')}</option>
                      <option value="agent">{t('users.agent')}</option>
                    </select>
                  </>
                )}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => { setShowAddModal(false); setNewItem({}); setEditItem(null); }}
                    className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {t('properties.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    {editItem ? t('properties.save') : t('properties.save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withTranslation()(Dashboard);