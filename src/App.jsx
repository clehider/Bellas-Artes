import { useState, useEffect } from 'react';
import { auth } from './firebase/config';
import { signOut } from 'firebase/auth';
import AuthGuard from './components/AuthGuard';
import Dashboard from './components/Dashboard';

function App() {
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      setError(`Error al cerrar sesión: ${err.message}`);
    }
  };

  return (
    <AuthGuard>
      <div style={styles.container}>
        <nav style={styles.navbar}>
          <div style={styles.navbarBrand}>
            Bellas Artes
          </div>
          <button 
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Cerrar Sesión
          </button>
        </nav>
        
        <main style={styles.main}>
          <Dashboard />
        </main>
      </div>
    </AuthGuard>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f7fafc',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#1a365d',
    color: 'white',
  },
  navbarBrand: {
    fontSize: '1.5em',
    fontWeight: 'bold',
  },
  main: {
    padding: '20px',
  },
  logoutButton: {
    backgroundColor: '#f56565',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    '&:hover': {
      backgroundColor: '#e53e3e',
    },
  },
};

export default App;
