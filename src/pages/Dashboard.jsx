import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
  const { t } = useTranslation();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('https://crm.aipilot.ps/api/stats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  const handleLogout = () => {
    logout(); // Clears user data and token via AuthContext
    navigate('/login'); // Redirects to login page
  };

  const chartData = stats?.properties_by_area
    ? {
        labels: stats.properties_by_area.map((item) => item._id),
        datasets: [
          {
            label: t('properties.title'),
            data: stats.properties_by_area.map((item) => item.count),
            backgroundColor: 'rgba(30, 58, 138, 0.7)',
            borderColor: 'rgba(30, 58, 138, 1)',
            borderWidth: 1,
          },
        ],
      }
    : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">
          {t('dashboard.welcome', { name: user?.username || '' })}
        </h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
        >
          {t('dashboard.logout')}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats && (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{t('properties.title')}</h3>
              <p className="text-2xl text-primary">{stats.total_properties || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{t('leads.title')}</h3>
              <p className="text-2xl text-primary">{stats.total_leads || 0}</p>
            </div>
            {user?.role === 'Admin' && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold">{t('requests.title')}</h3>
                <p className="text-2xl text-primary">{stats.total_requests || 0}</p>
              </div>
            )}
          </>
        )}
      </div>
      {chartData && (
        <div className="bg-white p-6 rounded-lg shadow">
          <Bar
            data={chartData}
            options={{
              plugins: {
                title: { display: true, text: t('properties.title') },
                legend: { display: true, position: 'top' },
              },
              scales: {
                y: { beginAtZero: true, title: { display: true, text: t('properties.title') } },
                x: { title: { display: true, text: t('dashboard.area') } },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;