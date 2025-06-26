import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ element }) => {
  const { user } = useContext(AuthContext);
  return user ? element : <Navigate to="/dashboard" />;
};

export default PrivateRoute;