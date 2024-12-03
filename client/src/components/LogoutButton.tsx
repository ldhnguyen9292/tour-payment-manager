import axios from 'axios';
import React from 'react';
import { useDispatch } from 'react-redux';

import { Button } from '@/components/ui/button';
import { logout } from '@/store/auth/authSlice';

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`);
      dispatch(logout());
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <Button variant="ghost" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
