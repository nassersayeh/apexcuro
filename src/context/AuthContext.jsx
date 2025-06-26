import { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const publicRoutes = ['/login', '/demo', '/pricing', '/features', '/signup','/'];
    console.log('useEffect triggered:', { pathname: location.pathname, publicRoutes });
    if (publicRoutes.includes(location.pathname)) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    console.log('Token check:', { token: token ? 'Present' : 'Absent', tokenValue: token });
    if (token) {
      axios
        .get('https://crm.aipilot.ps/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log('User loaded:', response.data.user);
          setUser(response.data.user);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Token verification error:', {
            status: err.response?.status,
            data: err.response?.data,
            message: err.message,
          });
          setError(t('auth.error'));
          localStorage.removeItem('token');
          setUser(null);
          setLoading(false);
          navigate('/login');
        });
    } else {
      setLoading(false);
      navigate('/login');
    }
  }, [navigate, location.pathname, t]);

  const login = async (email, password) => {
    try {
      setError(null);
      console.log('Login attempt:', { email, password });
      const response = await axios.post(
        'https://crm.aipilot.ps/api/auth/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      navigate('/dashboard');
      return { success: true, message: t('login.success') };
    } catch (err) {
      const errorMsg = t(err.response?.data?.error || 'login.error');
      console.error('Login error:', err.response?.data || err.message);
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;