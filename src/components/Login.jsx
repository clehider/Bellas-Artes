import { useState } from 'react';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Register from './Register';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCredential.user);
    } catch (err) {
      setError('Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  if (showRegister) {
    return <Register onRegister={(user) => {
      onLogin(user);
      setShowRegister(false);
    }} onBack={() => setShowRegister(false)} />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.loginContainer}>
        <div style={styles.leftPanel}>
          <div style={styles.logoContainer}>
            <h1 style={styles.logoText}>Bellas Artes</h1>
            <p style={styles.subtitle}>Panel de Administración</p>
          </div>
        </div>
        <div style={styles.rightPanel}>
          <div style={styles.loginBox}>
            <h2 style={styles.welcome}>¡Bienvenido!</h2>
            <p style={styles.loginText}>Inicia sesión en tu cuenta</p>
            {error && <div style={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  placeholder="ejemplo@bellasartes.com"
                  required
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div style={styles.forgotPassword}>
                <a href="#" style={styles.link}>¿Olvidaste tu contraseña?</a>
              </div>
              <button 
                type="submit" 
                style={loading ? {...styles.button, ...styles.buttonLoading} : styles.button}
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>
            <button 
              onClick={() => setShowRegister(true)}
              style={styles.registerButton}
            >
              ¿No tienes cuenta? Regístrate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  loginContainer: {
    display: 'flex',
    backgroundColor: '#ffffff',
    borderRadius: '15px',
    overflow: 'hidden',
    width: '100%',
    maxWidth: '1000px',
    minHeight: '600px',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
  },
  leftPanel: {
    flex: '1',
    backgroundColor: '#1a365d',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
  },
  logoContainer: {
    position: 'relative',
    zIndex: 1,
  },
  logoText: {
    fontSize: '2.5em',
    fontWeight: 'bold',
    margin: '0',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.2em',
    opacity: '0.9',
    margin: '0',
  },
  rightPanel: {
    flex: '1',
    padding: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBox: {
    width: '100%',
    maxWidth: '400px',
  },
  welcome: {
    fontSize: '2em',
    color: '#1a365d',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  loginText: {
    color: '#4a5568',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#4a5568',
    fontSize: '0.9em',
    fontWeight: '500',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    fontSize: '1em',
    transition: 'border-color 0.2s',
    outline: 'none',
    '&:focus': {
      borderColor: '#4299e1',
    },
  },
  button: {
    backgroundColor: '#4299e1',
    color: 'white',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: '500',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#3182ce',
    },
  },
  buttonLoading: {
    backgroundColor: '#90cdf4',
    cursor: 'not-allowed',
  },
  registerButton: {
    backgroundColor: 'transparent',
    color: '#4299e1',
    border: 'none',
    padding: '12px',
    cursor: 'pointer',
    fontSize: '0.9em',
    marginTop: '20px',
    width: '100%',
    textAlign: 'center',
  },
  error: {
    backgroundColor: '#fff5f5',
    color: '#c53030',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    fontSize: '0.9em',
  },
  forgotPassword: {
    textAlign: 'right',
    marginBottom: '10px',
  },
  link: {
    color: '#4299e1',
    textDecoration: 'none',
    fontSize: '0.9em',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
};

export default Login;
