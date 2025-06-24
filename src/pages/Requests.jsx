import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

function Requests() {
  const { t } = useTranslation(); // تصحيح: استخدام useTranslation بدلاً من useContext للترجمة
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('https://crm.aipilot.ps/api/requests', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setRequests(response.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-primary">{t('requests.title')}</h2>
      <div className="bg-white p-6 rounded shadow">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">{t('properties.title')}</th>
              <th className="p-2 text-left">{t('requests.status')}</th>
              <th className="p-2 text-left">{t('requests.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-2">{r.property_id?.unit_number || 'N/A'}</td>
                <td className="p-2">{r.status}</td>
                <td className="p-2">
                  {user?.role === 'Sales Manager' && (
                    <>
                      <button className="text-green-500 hover:underline">{t('requests.approve')}</button>
                      <button className="text-red-500 hover:underline ml-2">{t('requests.reject')}</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Requests;