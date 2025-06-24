import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

function Properties() {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [file, setFile] = useState(null);
  const [editProperty, setEditProperty] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('https://crm.aipilot.ps/api/properties', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    fetchProperties();
  }, []);

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post('https://crm.aipilot.ps/api/properties/import', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      window.location.reload();
    } catch (error) {
      console.error('Error importing file:', error);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axios.get('https://crm.aipilot.ps/api/properties/export', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'properties.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting file:', error);
    }
  };

  const handleEdit = (property) => {
    setEditProperty({ ...property, releasing_date: property.releasing_date ? property.releasing_date.split('T')[0] : '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('properties.confirmDelete'))) {
      try {
        await axios.delete(`https://crm.aipilot.ps/api/properties/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProperties(properties.filter((p) => p._id !== id));
      } catch (error) {
        console.error('Error deleting property:', error);
      }
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const updatedProperty = {
        ...editProperty,
        actual_area: parseFloat(editProperty.actual_area) || 0,
        rent_price: parseFloat(editProperty.rent_price) || 0,
        sale_price: parseFloat(editProperty.sale_price) || 0,
        releasing_date: editProperty.releasing_date || null,
      };
      const response = await axios.put(
        `https://crm.aipilot.ps/api/properties/${editProperty._id}`,
        updatedProperty,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setProperties(
        properties.map((p) => (p._id === editProperty._id ? response.data : p))
      );
      setIsModalOpen(false);
      setEditProperty(null);
    } catch (error) {
      console.error('Error updating property:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProperty({ ...editProperty, [name]: value });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">{t('properties.title')}</h2>
      {user?.role === 'Admin' && (
        <div className="bg-white p-6 rounded-lg shadow flex space-x-4">
          <form onSubmit={handleImport}>
            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setFile(e.target.files[0])}
              className="p-2"
            />
            <button
              type="submit"
              className="bg-primary text-white p-2 rounded hover:bg-blue-700 transition"
            >
              {t('properties.importExcel')}
            </button>
          </form>
          <button
            onClick={handleExport}
            className="bg-primary text-white p-2 rounded hover:bg-blue-700 transition"
          >
            {t('properties.exportExcel')}
          </button>
        </div>
      )}
      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <table className="w-full min-w-max">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-right">{t('properties.unit_number')}</th>
              <th className="p-2 text-right">{t('properties.name')}</th>
              <th className="p-2 text-right">{t('properties.telephone')}</th>
              <th className="p-2 text-right">{t('properties.secondary_phone')}</th>
              <th className="p-2 text-right">{t('properties.email')}</th>
              <th className="p-2 text-right">{t('properties.area')}</th>
              <th className="p-2 text-right">{t('properties.building_name')}</th>
              <th className="p-2 text-right">{t('properties.status')}</th>
              <th className="p-2 text-right">{t('properties.actual_area')}</th>
              <th className="p-2 text-right">{t('properties.balcony_area')}</th>
              <th className="p-2 text-right">{t('properties.parking_number')}</th>
              <th className="p-2 text-right">{t('properties.floor')}</th>
              <th className="p-2 text-right">{t('properties.rooms_description')}</th>
              <th className="p-2 text-right">{t('properties.rent_price')}</th>
              <th className="p-2 text-right">{t('properties.sale_price')}</th>
              <th className="p-2 text-right">{t('properties.payments')}</th>
              <th className="p-2 text-right">{t('properties.releasing_date')}</th>
              <th className="p-2 text-right">{t('properties.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p._id} className="border-t">
                <td className="p-2">{p.unit_number}</td>
                <td className="p-2">{p.name}</td>
                <td className="p-2">{p.telephone}</td>
                <td className="p-2">{p.secondary_phone}</td>
                <td className="p-2">{p.email}</td>
                <td className="p-2">{p.area}</td>
                <td className="p-2">{p.building_name}</td>
                <td className="p-2">{p.status}</td>
                <td className="p-2">{p.actual_area}</td>
                <td className="p-2">{p.balcony_area}</td>
                <td className="p-2">{p.parking_number}</td>
                <td className="p-2">{p.floor}</td>
                <td className="p-2">{p.rooms_description}</td>
                <td className="p-2">{p.rent_price}</td>
                <td className="p-2">{p.sale_price}</td>
                <td className="p-2">{p.payments}</td>
                <td className="p-2">{p.releasing_date ? new Date(p.releasing_date).toLocaleDateString('ar-SA') : ''}</td>
                <td className="p-2">
                  {(user?.role === 'Admin' || user?.role === 'Sales Manager' || user?.role === 'Broker') && (
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-primary hover:underline"
                    >
                      {t('properties.edit')}
                    </button>
                  )}
                  {(user?.role === 'Admin' || user?.role === 'Sales Manager') && (
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-500 hover:underline ml-2"
                    >
                      {t('properties.delete')}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{t('properties.editProperty')}</h3>
            <form onSubmit={handleSaveEdit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">{t('properties.unit_number')}</label>
                  <input
                    type="text"
                    name="unit_number"
                    value={editProperty.unit_number}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.name')}</label>
                  <input
                    type="text"
                    name="name"
                    value={editProperty.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.telephone')}</label>
                  <input
                    type="text"
                    name="telephone"
                    value={editProperty.telephone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.secondary_phone')}</label>
                  <input
                    type="text"
                    name="secondary_phone"
                    value={editProperty.secondary_phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={editProperty.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.area')}</label>
                  <input
                    type="text"
                    name="area"
                    value={editProperty.area}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.building_name')}</label>
                  <input
                    type="text"
                    name="building_name"
                    value={editProperty.building_name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.status')}</label>
                  <input
                    type="text"
                    name="status"
                    value={editProperty.status}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.actual_area')}</label>
                  <input
                    type="number"
                    name="actual_area"
                    value={editProperty.actual_area}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.balcony_area')}</label>
                  <input
                    type="text"
                    name="balcony_area"
                    value={editProperty.balcony_area}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.parking_number')}</label>
                  <input
                    type="text"
                    name="parking_number"
                    value={editProperty.parking_number}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.floor')}</label>
                  <input
                    type="text"
                    name="floor"
                    value={editProperty.floor}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.rooms_description')}</label>
                  <input
                    type="text"
                    name="rooms_description"
                    value={editProperty.rooms_description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.rent_price')}</label>
                  <input
                    type="number"
                    name="rent_price"
                    value={editProperty.rent_price}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.sale_price')}</label>
                  <input
                    type="number"
                    name="sale_price"
                    value={editProperty.sale_price}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.payments')}</label>
                  <input
                    type="text"
                    name="payments"
                    value={editProperty.payments}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.releasing_date')}</label>
                  <input
                    type="date"
                    name="releasing_date"
                    value={editProperty.releasing_date}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
                >
                  {t('properties.cancel')}
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white p-2 rounded hover:bg-blue-700 transition"
                >
                  {t('properties.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Properties;