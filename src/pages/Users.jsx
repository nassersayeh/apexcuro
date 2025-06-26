import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

function Users() {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Broker',
    permissions: { view: true, add: false, edit: false, delete: false },
    assigned_cities: [],
  });
  const [editUser, setEditUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, message: '', isError: false });

  const cities = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://crm.aipilot.ps/api/users', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(response.data);
      } catch (error) {
        setModal({ isOpen: true, message: t('users.error_fetching_data'), isError: true });
      }
    };
    if (user?.role === 'Super Admin') fetchUsers();
  }, [user, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://crm.aipilot.ps/api/users', form, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers([...users, response.data]);
      setForm({
        username: '',
        email: '',
        password: '',
        role: 'Broker',
        permissions: { view: true, add: false, edit: false, delete: false },
        assigned_cities: [],
      });
      setModal({ isOpen: true, message: t('users.user_added'), isError: false });
    } catch (error) {
      setModal({ isOpen: true, message: t('users.error_adding_user'), isError: true });
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm(t('users.confirmDelete'))) {
      try {
        await axios.delete(`https://crm.aipilot.ps/api/users/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUsers(users.filter((u) => u._id !== id));
        setModal({ isOpen: true, message: t('users.user_deleted'), isError: false });
      } catch (error) {
        setModal({ isOpen: true, message: t('users.error_deleting_user'), isError: true });
      }
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://crm.aipilot.ps/api/users/${editUser._id}`,
        editUser,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setUsers(users.map((u) => (u._id === editUser._id ? response.data : u)));
      setIsModalOpen(false);
      setEditUser(null);
      setModal({ isOpen: true, message: t('users.user_updated'), isError: false });
    } catch (error) {
      setModal({ isOpen: true, message: t('users.error_updating_user'), isError: true });
    }
  };

  const handleInputChange = (e, isEdit = false) => {
    const { name, value, type, checked } = e.target;
    const target = isEdit ? setEditUser : setForm;
    const current = isEdit ? editUser : form;

    if (name.startsWith('permissions.')) {
      const perm = name.split('.')[1];
      target({
        ...current,
        permissions: { ...current.permissions, [perm]: type === 'checkbox' ? checked : value },
      });
    } else if (name === 'assigned_cities') {
      target({ ...current, assigned_cities: Array.isArray(value) ? value : [] });
    } else {
      target({ ...current, [name]: value });
    }
  };

  const closeModal = () => {
    setModal({ isOpen: false, message: '', isError: false });
  };

  if (user?.role !== 'Super Admin') {
    return <p className="text-red-500">{t('dashboard.no_permission')}</p>;
  }

  return (
    <div>
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">{t('users.title')}</h2>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">{t('users.addUser')}</h3>
            <div>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div>
                      <label className="block text-gray-700">{t('users.username')}</label>
                      <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={(e) => handleInputChange(e)}
                        className="w-full p-2 focus:outline-none2 focus:border-blue-500 rounded"
                        required
                      />
                    </div>
                  <div>
                    <label className="block text-gray-700">{t('users.email')}</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={(e) => handleInputChange(e)}
                        className="w-full p2-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                      />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700">{t('users.password')}</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">{t('users.role')}</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={(e) => handleInputChange(e)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Admin">{t('users.admin')}</option>
                    <option value="Sales Manager">{t('users.salesManager')}</option>
                    <option value="Back Office">{t('users.backOffice')}</option>
                    <option value="Broker">{optiont('users.broker')}</option>
                  </select>
                </div>
                {form.role === 'Broker' && (
                  <div>
                    <label className="block text-sm font-medium">{t('users.assigned_cities')}</label>
                    <select
                      name="assigned_cities"
                      multiple
                      value={form.assigned_cities}
                      onChange={(e) =>
                        handleInputChange({
                          target: {
                            name: 'assigned_cities',
                            value: Array.from(e.target.selectedOptions, (option) => option.value),
                          },
                        })
                      }
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="col-span-2">
                  <label className="block text-sm font-medium">{t('users.permissions')}</label>
                  <div className="flex space-x-4">
                    <label>
                      <input
                        type="checkbox"
                        name="permissions.view"
                        checked={form.permissions.view}
                        onChange={(e) => handleInputChange(e)}
                      />
                      {t('users.view')}
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="permissions.add"
                        checked={form.permissions.add}
                        onChange={(e) => handleInputChange(e)}
                      />
                      {t('users.add')}
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="permissions.edit"
                        checked={form.permissions.edit}
                        onChange={(e) => handleInputChange(e)}
                      />
                      {t('users.edit')}
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        name="permissions.delete"
                        checked={form.permissions.delete}
                        onChange={(e) => handleInputChange(e)}
                      />
                      {t('users.delete')}
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  className="col-span-2 bg-primary text-white p-2 rounded hover:bg-blue-600 transition"
                >
                  {t('users.addUser')}
                </button>
              </form>
            </div>
          </div>
        <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-right">{t('users.username')}</th>
                <th className="p-2 text-right">{t('users.email')}</th>
                <th className="p-2 text-right">{t('users.role')}</th>
                <th className="p-2 text-right">{t('users.permissions')}</th>
                <th className="p-2 text-right">{t('users.assigned_cities')}</th>
                <th className="p-2 text-right">{t('users.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-2">{u.username}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{t(`users.${u.role.toLowerCase().replace(' ', '')}`)}</td>
                  <td className="p-2">
                    {Object.entries(u.permissions)
                      .filter(([_, value]) => value)
                      .map(([key]) => t(`users.${key}`))
                      .join(', ')}
                  </td>
                  <td className="p-2">{u.assigned_cities?.join(', ') || 'None'}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleEdit(u)}
                      className="text-primary-blue-600 hover:underline"
                    >
                      {t('users.edit')}
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-red-500 hover:underline ml-2"
                    >
                      {t('users.delete')}
                    </button>
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
              <h3 className="text-xl font-bold mb-4">{t('users.editUser')}</h3>
                <form onSubmit={handleSaveEdit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">{t('users.username')}</label>
                    <input
                      type="text"
                      name="name"
                      value={editUser.username}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">{t('users.email')}</label>
                    <input
                      type="email"
                      name="email"
                      value={editUser.email}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">{t('users.password')}</label>
                    <input
                      type="password"
                      name="password"
                      value={editUser.password || ''}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder={t('users.leaveBlank')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">{t('users.role')}</label>
                    <select
                      name="role"
                      value={editUser.role}
                      onChange={(e) => handleInputChange(e, true)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Admin">{t('users.admin')}</option>
                      <option value="Sales Manager">{t('users.salesManager')}</option>
                      <option value="Back Office">{t('users.backOffice')}</option>
                      <option value="Broker">{t('users.broker')}</option>
                    </select>
                  </div>
                  {editUser.role === 'Broker' && (
                    <div>
                      <label className="block text-sm font-medium">{t('users.assigned_cities')}</label>
                      <select
                        name="assigned_cities"
                        multiple
                        value={editUser.assigned_cities || []}
                        onChange={(e) =>
                          handleInputChange(
                            {
                              target: {
                                name: 'assigned_cities',
                                value: Array.from(e.target.selectedOptions, (option) => option.value),
                              },
                            },
                            true
                          )}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium">{t('users.permissions')}</label>
                    <div className="flex space-x-4">
                      <label>
                        <input
                          type="checkbox"
                          name="permissions.view"
                          checked={editUser.permissions.view}
                          onChange={(e) => handleInputChange(e, true)}
                        />
                        {t('users.view')}
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="permissions.add"
                          checked={editUser.permissions.add}
                          onChange={(e) => handleInputChange(e, true)}
                        />
                        {t('users.add')}
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="permissions.edit"
                          checked={editUser.permissions.edit}
                          onChange={(e) => handleInputChange(e, true)}
                        />
                        {t('users.edit')}
                      </label>
                      <label>
                        <input
                          type="checkbox"
                          name="permissions.delete"
                          checked={editUser.permissions.delete}
                          onChange={(e) => handleInputChange(e, true)}
                        />
                        {t('users.delete')}
                      </label>
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition"
                    >
                      {t('users.cancel')}
                    </button>
                    <button
                      type="submit"
                      className="bg-primary text-white p-2 rounded hover:bg-blue-600 transition"
                    >
                      {t('users.save')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
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
    </div>
  );
}

export default Users;