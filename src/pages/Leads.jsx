import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

function Leads() {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [leads, setLeads] = useState([]);
  const [addLead, setAddLead] = useState({ name: '', email: '', phone: '', status: 'Active' });
  const [editLead, setEditLead] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, message: '', isError: false });

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await axios.get('https://crm.aipilot.ps/api/clients', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setLeads(response.data);
      } catch (error) {
        setModal({ isOpen: true, message: t('leads.error_fetching'), isError: true });
      }
    };
    fetchLeads();
  }, [t]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://crm.aipilot.ps/api/leads', addLead, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setLeads([...leads, response.data]);
      setAddLead({ name: '', email: '', phone: '', status: 'Active' });
      setIsAddModalOpen(false);
      setModal({ isOpen: true, message: t('leads.lead_added'), isError: false });
    } catch (error) {
      setModal({ isOpen: true, message: t('leads.error_adding'), isError: true });
    }
  };

  const handleEdit = (lead) => {
    setEditLead(lead);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://crm.aipilot.ps/api/leads/${editLead._id}`,
        editLead,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setLeads(leads.map((l) => (l._id === editLead._id ? response.data : l)));
      setIsEditModalOpen(false);
      setEditLead(null);
      setModal({ isOpen: true, message: t('leads.lead_updated'), isError: false });
    } catch (error) {
      setModal({ isOpen: true, message: t('leads.error_updating'), isError: true });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('leads.confirmDelete'))) {
      try {
        await axios.delete(`https://crm.aipilot.ps/api/leads/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setLeads(leads.filter((l) => l._id !== id));
        setModal({ isOpen: true, message: t('leads.lead_deleted'), isError: false });
      } catch (error) {
        setModal({ isOpen: true, message: t('leads.error_deleting'), isError: true });
      }
    }
  };

  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditLead({ ...editLead, [name]: value });
    } else {
      setAddLead({ ...addLead, [name]: value });
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, message: '', isError: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">{t('leads.title')}</h2>
        {user?.role === 'Super Admin' && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary text-white p-2 rounded hover:bg-blue-600 transition"
          >
            {t('leads.addLead')}
          </button>
        )}
      </div>
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-right">{t('leads.name')}</th>
              <th className="p-2 text-right">{t('leads.email')}</th>
              <th className="p-2 text-right">{t('leads.phone')}</th>
              <th className="p-2 text-right">{t('leads.status')}</th>
              <th className="p-2 text-right">{t('leads.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l._id} className="border-t">
                <td className="p-2">{l.name}</td>
                <td className="p-2">{l.email}</td>
                <td className="p-2">{l.phone}</td>
                <td className="p-2">{l.status}</td>
                <td className="p-2">
                  {user?.role === 'Super Admin' && (
                    <>
                      <button
                        onClick={() => handleEdit(l)}
                        className="text-primary hover:underline mr-2"
                      >
                        {t('leads.edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(l._id)}
                        className="text-red-500 hover:underline"
                      >
                        {t('leads.delete')}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{t('leads.addLead')}</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">{t('leads.name')}</label>
                <input
                  type="text"
                  name="name"
                  value={addLead.name}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('leads.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={addLead.email}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('leads.phone')}</label>
                <input
                  type="text"
                  name="phone"
                  value={addLead.phone}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('leads.status')}</label>
                <select
                  name="status"
                  value={addLead.status}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Active">{t('leads.active')}</option>
                  <option value="Inactive">{t('leads.inactive')}</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
                >
                  {t('leads.cancel')}
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white p-2 rounded hover:bg-blue-600 transition"
                >
                  {t('leads.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">{t('leads.editLead')}</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">{t('leads.name')}</label>
                <input
                  type="text"
                  name="name"
                  value={editLead.name}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('leads.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={editLead.email}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('leads.phone')}</label>
                <input
                  type="text"
                  name="phone"
                  value={editLead.phone}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('leads.status')}</label>
                <select
                  name="status"
                  value={editLead.status}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Active">{t('leads.active')}</option>
                  <option value="Inactive">{t('leads.inactive')}</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
                >
                  {t('leads.cancel')}
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white p-2 rounded hover:bg-blue-600 transition"
                >
                  {t('leads.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success/Error Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className={`text-lg font-semibold ${modal.isError ? 'text-red-500' : 'text-green-500'}`}>
              {modal.message}
            </h3>
            <button
              onClick={closeModal}
              className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              {t('login.close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Leads;