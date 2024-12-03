import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes
} from 'react-router-dom';

import { Toaster } from './components/ui/toaster';
import { Dashboard, Login, Register } from './pages';
import { RootState } from './store';
import { setAuth } from './store/auth/authSlice';

axios.defaults.withCredentials = true;

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/auth/status`
        );
        dispatch(setAuth({ isAuthenticated: true, user: response.data }));
      } catch {
        // If the user is not authenticated, do nothing
      }
    };

    checkAuthStatus();
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? '/dashboard' : '/login'} />
            }
          />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
