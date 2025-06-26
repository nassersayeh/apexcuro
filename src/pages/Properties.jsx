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
  const [addProperty, setAddProperty] = useState({
    unit_number: '',
    name: '',
    telephone: '',
    secondary_phone: '',
    email: '',
    area: '',
    building_name: '',
    status: '',
    actual_area: '',
    balcony_area: '',
    parking_number: '',
    floor: '',
    rooms_description: '',
    rent_price: '',
    sale_price: '',
    payments: '',
    releasing_date: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState();
  const [modal, setModal] = useState({ isOpen: false, message: '', isError: false });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('https://crm.aipilot.ps/api/properties', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
        setProperties(response.data);
      } catch (error) {
        setModal({ isOpen: true, message: t('properties.errorFetching'), isError: true });
      }
    };
    fetchProperties();
  }, [t]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const newProperty = {
        ...addProperty,
        actual_area: parseFloat(addProperty.actual_area) || 0,
        rent_price: parseFloat(addProperty.rent_price) || 0,
        sale_price: parseFloat(addProperty.sale_price) || 0,
        releasing_date: addProperty.releasing_date || null,
      };
      const response = await axios.post('https://crm.aipilot.ps/api/properties', newProperty, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setProperties([...properties, response.data]);
      setAddProperty({
        unit_number: '',
        name: '',
        telephone: '',
        secondary_phone: '',
        email: '',
        area: '',
        building_name: '',
        status: '',
        actual_area: '',
        balcony_area: '',
        parking_number: '',
        floor: '',
        rooms_description: '',
        rent_price: '',
        sale_price: '',
        payments: '',
        releasing_date: '',
      });
      setAddModalOpen(false);
      setModal({ isOpen: true, message: t('properties.property_added'), isError: false });
    } catch (error) {
      setModal({ isOpen: true, message: t('properties.error_adding_property'),isError: true });
    }
  };

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
      setModal({ isOpen: true, message: t('properties.import_success'), isError: false });
    } catch (error) {
      setModal({ isOpen: true, message: t('properties.import_error'), isError: true });
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
      setModal({ isOpen: true, message: t('properties.export_success'), isError: false });
    } catch (error) {
      setModal({ isOpen: true, message: t('properties.export_error'), isError: true });
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
        setModal({ isOpen: true, message: t('properties.delete'), isError: false });
      } catch (error) {
        setModal({ isOpen: true, message: t('properties.error_deleting'), isError: true });
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
      setModal({ isOpen: true, message: t('properties.property_updated'), isError: false });
    } catch (error) {
      setModal({ isOpen: true, message: t('properties.error_updating'), isError: true });
    }
  };

  const handleInputChange = (e, isEdit = false, isAdd = false) => {
    const { name, value } = e.target;
    if (isAdd) {
      setAddProperty({ ...addProperty, [name]: value });
    } else if (isEdit) {
      setEditProperty({ ...editProperty, [name]: value });
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, message: '', isError: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">{t('properties.title')}</h2>
        {user?.role === 'Super Admin' && (
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-primary text-white p-2 rounded hover:bg-blue-600 transition"
          >
            {t('properties.addProperty')}
          </button>
        )}
      </div>
      {user?.role === 'Super Admin' && (
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
              className="bg-primary text-white p-2 rounded hover:bg-blue-600 transition"
            >
              {t('properties.importExcel')}
            </button>
          </form>
          <button
            onClick={handleExport}
            className="bg-primary text-white p-2 rounded hover:bg-blue-600 transition"
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
              <th classNameclassName="p-2 text-right">{t('properties.balcony_area')}</th>
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
                <td classNameclass="p-2">{p.name}</td>
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
                  {user?.role === 'Super Admin' && (
                    <>
                      <button
                        onClick={() => handleEdit(p)}
                        className="text-primary hover:underline"
                      >
                        {t('properties.edit')}
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="text-red-500 hover:underline ml-2"
                      >
                        {t('properties.delete')}
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
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{t('properties.addProperty')}</h3>
            <form onSubmit={handleAdd}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">{t('properties.unit_number')}</label>
                  <input
                    type="text"
                    name="unit_number"
                    value={addProperty.unit_number}
                    onChange={(e) => handleInputChange(e, false, true)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.name')}</label>
                  <input
                    type="text"
                    name="name"
                    value={addProperty.name}
                    onChange={(e) => handleInputChange(e, false, true)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.telephone')}</label>
                  <input
                    type="text"
                    name="telephone"
                    value={addProperty.telephone}
                    onChange={(e) => handleInputChange(e, false, true)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.secondary_phone')}</label>
                  <input
                    type="text"
                    name="secondary_phone"
                    value={addProperty.secondary_phone}
                    onChange={(e) => handleInputChange(e, false, true)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.email')}</label>
                  <input
                    type="email"
                    name="email"
                    value={addProperty.email}
                    onChange={(e) => handleInputChange(e, false, true)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.area')}</label>
                  <input
                    type="text"
                    name="area"
                    value={addProperty.area}
                    onChange={(e) => handleInputChange(e, false, true)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.building_name')}</label>
                  <input
                    type="text"
                    name="building_name"
                    value={addProperty.building_name}
                    onChange={(e) => handleInputChange(e, false, true)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.status')}</label>
                  <input
                    type="text"
                    name="status"
                    value={addProperty.status}
                    onChange={(e) => handleInputChange(e, false, true)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.actual_area')}</label>
                  <input
                    type="number"
                    name="actual_area"
                    value={addProperty.actual_area}
                    onChange={(e) => handleInputChange(e, false, true)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.balcony_area')}</label>
                  <input
                    type="text"
                    name="balcony_area"
                    value={addProperty.balcony_area}
                    onChange={(e) => handleInputChange(e, false, true)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.parking_number')}</label>
                  <input
                    type="text"
                    name="parking_number"
                    value={addProperty.parking_number}
                    onChange={(e) => handleInputChange(e, false, true)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.floor')}</label>
                  <input
                    type="text"
                    name="floor"
                    value={addProperty.floor}
                    onChange={(e) => handleInputChange(e, false, true)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.rooms_description')}</label>
                  <input
                    type="text"
                    name="rooms_description"
                    value={addProperty.rooms_description}
                    onChange={(e) => handleInputChange(e, false, true)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.rent_price')}</label>
                  <input
                    type="number"
                    name="rent_price"
                    value={addProperty.rent_price}
                    onChange={(e) => handleInputChange(e, false, true)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.sale_price')}</label>
                  <input
                    type="number"
                    name="sale_price"
                    value={addProperty.sale_price}
                    onChange={(e) => handleInputChange(e, false, true)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.payments')}</label>
                  <input
                    type="text"
                    name="payments"
                    value={addProperty.payments}
                    onChange={(e) => handleInputChange(e, false, true)}
                    className="p-2 w-full border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('properties.releasing_date')}</label>
                  <input
                    type="date"
                    name="releasing_date"
                    value={addProperty.releasing_date}
                    onChange={(e) => handleInputChange(e, false, true)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
                >
                  {t('properties.cancel')}
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white p-2 rounded hover:bg-blue-600 transition"
                >
                  {t('properties.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-3">{t('hproperties.editProperty')}</h3>
              <form onSubmit={handleSaveEdit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">{t('properties.unit_number')}</label>
                    <input
                      type="text"
                      name="unit_number"
                      value={editProperty.unit_number}
                      onChange={(e) => handleInputChange(e, true)}
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
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">{t('properties.telephone')}</label>
                    <input
                      type="text"
                      name="telephone"
                      value={editProperty.telephone}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">{t('properties.secondary_phone')}</label>
                    <input
                      type="text"
                      name="secondary_phone"
                      value={editProperty.secondary_phone}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">{t('properties.email')}</label>
                    <input
                      type="email"
                      name="email"
                      value={editProperty.email}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">{t('properties.area')}</label>
                    <input
                      type="text"
                      name="area"
                      value={editProperty.area}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">{t('properties.building_name')}</label>
                    <input
                      type="text"
                      name="building_name"
                      value={editProperty.building_name}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">{t('properties.status')}</label>
                    <input
                      type="text"
                      name="status"
                      value={editProperty.status}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">{t('properties.actual_area')}</label>
                    <input
                      type="number"
                      name="actual_area"
                      value={editProperty.actual_area}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">{t('properties.balcony_area')}</label>
                    <input
                      type="text"
                      name="balcony_area"
                      value={editProperty.balcony_area}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">{t('properties.parking_number')}</label>
                    <input
                      type="text"
                      name="parking_number"
                      value={editProperty.parking_number}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">{t('properties.floor')}</label>
                    <input
                      type="text"
                      name="floor"
                      value={editProperty.floor}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">{t('properties.rooms_description')}</label>
                    <input
                      type="w-full p-2 border rounded"
                    />
                    <input
                      type="text"
                      name="name=rooms_description"
                      value={editProperty.rooms_description}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">{t('properties.rent_price')}</label>
                    <input
                      type="number"
                      name="rent_price"
                      value={editProperty.rent_price}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full p-w2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">{t('properties.sale_price')}</label>
                    <input
                      type="number"
                      name="sale_price"
                      value={editProperty.sale_price}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">{t('properties.payments')}</label>
                    <input
                      type="text"
                      name="payments"
                      value={editProperty.payments}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">{t('properties.releasing_date')}</label>
                    <input
                      type="date"
                      name="releasing_date"
                      value={editProperty.releasing_date}
                      onChange={(e) => handleInputChange(e, true)}
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
                    className="bg-primary text-white p-2 rounded hover:bg-blue-600 transition"
                  >
                    {t('properties.save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className={`text-lg font-semibold ${modal.isError ? 'text-red-500' : 'text-green-600'}`}>
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

export default Properties;