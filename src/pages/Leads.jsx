import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

function Leads() {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get('https://crm.aipilot.ps/api/leads', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setLeads(response.data);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };
    fetchLeads();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">{t('leads.title')}</h2>
      <div className="bg-white p-6 rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l._id} className="border-t">
                <td className="p-2">{l.name}</td>
                <td className="p-2">{l.email}</td>
                <td className="p-2">{l.status}</td>
                <td className="p-2">
                  {(user?.role === 'Admin' || (user?.role === 'Broker' && l.assigned_to === user.id)) && (
                    <button className="text-primary hover:underline">Edit</button>
                  )}
                  {user?.role === 'Admin' && (
                    <button className="text-red-500 hover:underline ml-2">Delete</button>
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

export default Leads;