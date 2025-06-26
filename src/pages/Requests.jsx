import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

function Requests() {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState([]);
  const [addRequest, setAddRequest] = useState({
    property_id: '',
    client_name: '',
    client_phone: '',
    client_email: '',
    request_type: 'Rent',
    status: 'Pending',
  });
  const [editRequest, setEditRequest] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, message: '', isError: false });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get('https://crm.aipilot.ps/api/requests', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setRequests(response.data);
      } catch (error) {
        setModal({ isOpen: true, message: t('requests.error_fetching'), isError: true });
      }
    };
    if (user?.role === 'Super Admin') fetchRequests();
  }, [user, t]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://crm.aipilot.ps/api/requests', addRequest, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRequests([...requests, response.data]);
      setAddRequest({
        property_id: '',
        client_name: '',
        client_phone: '',
        client_email: '',
        request_type: 'Rent',
        status: 'Pending',
      });
      setIsAddModalOpen(false);
      setModal({ isOpen: true, message: t('requests.request_added'), isError: false });
    } catch (error) {
      setModal({ isOpen: true, message: t('requests.error_adding'), isError: true });
    }
  };

  const handleEdit = (request) => {
    setEditRequest(request);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://crm.aipilot.ps/api/requests/${editRequest._id}`,
        editRequest,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setRequests(requests.map((r) => (r._id === editRequest._id ? response.data : r)));
      setIsEditModalOpen(false);
      setEditRequest(null);
      setModal({ isOpen: true, message: t('requests.request_updated'), isError: false });
    } catch (error) {
      setModal({ isOpen: true, message: t('requests.error_updating'), isError: true });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('requests.confirmDelete'))) {
      try {
        await axios.delete(`https://crm.aipilot.ps/api/requests/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setRequests(requests.filter((r) => r._id !== id));
        setModal({ isOpen: true, message: t('requests.request_deleted'), isError: false });
      } catch (error) {
        setModal({ isOpen: true, message: t('requests.error_deleting'), isError: true });
      }
    }
  };

  const handleInputChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    if (isEdit) {
      setEditRequest({ ...editRequest, [name]: value });
    } else {
      setAddRequest({ ...addRequest, [name]: value });
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, message: '', isError: false });
  };

  if (user?.role !== 'Super Admin') {
    return <p className="text-red-500">{t('dashboard.no_permission')}</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">{t('requests.title')}</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-primary text-white p-2 rounded hover:bg-blue-600 transition"
        >
          {t('requests.addRequest')}
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-right">{t('requests.property_id')}</th>
              <th className="p-2 text-right">{t('requests.client_name')}</th>
              <th className="p-2 text-right">{t('requests.client_phone')}</th>
              <th className="p-2 text-right">{t('requests.client_email')}</th>
              <th className="p-2 text-right">{t('requests.request_type')}</th>
              <th className="p-2 text-right">{t('requests.status')}</th>
              <th className="p-2 text-right">{t('requests.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-2">{r.property_id}</td>
                <td className="p-2">{r.client_name}</td>
                <td className="p-2">{r.client_phone}</td>
                <td className="p-2">{r.client_email}</td>
                <td className="p-2">{r.request_type}</td>
                <td className="p-2">{r.status}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleEdit(r)}
                    className="text-primary hover:underline mr-2"
                  >
                    {t('requests.edit')}
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    className="text-red-500 hover:underline"
                  >
                    {t('requests.delete')}
                  </button>
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
            <h3 className="text-xl font-bold mb-4">{t('requests.addRequest')}</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">{t('requests.property_id')}</label>
                <input
                  type="text"
                  name="property_id"
                  value={addRequest.property_id}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('requests.client_name')}</label>
                <input
                  type="text"
                  name="client_name"
                  value={addRequest.client_name}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('requests.client_phone')}</label>
                <input
                  type="text"
                  name="client_phone"
                  value={addRequest.client_phone}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('requests.client_email')}</label>
                <input
                  type="email"
                  name="client_email"
                  value={addRequest.client_email}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('requests.request_type')}</label>
                <select
                  name="request_type"
                  value={addRequest.request_type}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Rent">{t('requests.rent')}</option>
                  <option value="Sale">{t('requests.sale')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">{t('requests.status')}</label>
                <select
                  name="status"
                  value={addRequest.status}
                  onChange={(e) => handleInputChange(e)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Pending">{t('requests.pending')}</option>
                  <option value="Approved">{t('requests.approved')}</option>
                  <option value="Rejected">{t('requests.rejected')}</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
                >
                  {t('requests.cancel')}
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white p-2 rounded hover:bg-blue-600 transition"
                >
                  {t('requests.save')}
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
            <h3 className="text-xl font-bold mb-4">{t('requests.editRequest')}</h3>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">{t('requests.property_id')}</label>
                <input
                  type="text"
                  name="property_id"
                  value={editRequest.property_id}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('requests.client_name')}</label>
                <input
                  type="text"
                  name="client_name"
                  value={editRequest.client_name}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('requests.client_phone')}</label>
                <input
                  type="text"
                  name="client_phone"
                  value={editRequest.client_phone}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('requests.client_email')}</label>
                <input
                  type="email"
                  name="client_email"
                  value={editRequest.client_email}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">{t('requests.request_type')}</label>
                <select
                  name="request_type"
                  value={editRequest.request_type}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Rent">{t('requests.rent')}</option>
                  <option value="Sale">{t('requests.sale')}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">{t('requests.status')}</label>
                <select
                  name="status"
                  value={editRequest.status}
                  onChange={(e) => handleInputChange(e, true)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Pending">{t('requests.pending')}</option>
                  <option value="Approved">{t('requests.approved')}</option>
                  <option value="Rejected">{t('requests.rejected')}</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
                >
                  {t('requests.cancel')}
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white p-2 rounded hover:bg-blue-600 transition"
                >
                  {t('requests.save')}
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

export default Requests;