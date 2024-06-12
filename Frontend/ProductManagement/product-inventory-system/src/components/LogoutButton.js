import React from 'react';
import { useAuth } from './AuthContext';
import { useHistory } from 'react-router';

const LogoutButton = () => {
  const { logout } = useAuth();
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
