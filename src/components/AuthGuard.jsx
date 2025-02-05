import { useEffect, useState } from 'react';
import { auth } from '../firebase/config';
import Login from './Login';

const AuthGuard = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Login onLogin={(user) => setUser(user)} />;
  }

  return children;
};

export default AuthGuard;
