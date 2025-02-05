import { useState, useEffect } from 'react'
import { db } from './firebase/config'
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from 'firebase/firestore'

function App() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersRef = collection(db, 'usuarios');
      const q = query(usersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const usersData = [];
      querySnapshot.forEach(doc => {
        usersData.push({ id: doc.id, ...doc.data() });
      });
      
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    try {
      const newUser = {
        nombre: `Usuario ${users.length + 1}`,
        email: `usuario${users.length + 1}@ejemplo.com`,
        role: "estudiante",
        createdAt: new Date().toISOString()
      };

      const usersRef = collection(db, 'usuarios');
      await addDoc(usersRef, newUser);
      await loadUsers();
    } catch (err) {
      setError(`Error creando usuario: ${err.message}`);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    try {
      await deleteDoc(doc(db, 'usuarios', userId));
      await loadUsers();
    } catch (err) {
      setError(`Error eliminando usuario: ${err.message}`);
    }
  };

  const updateUser = async (userId, updatedData) => {
    try {
      await updateDoc(doc(db, 'usuarios', userId), updatedData);
      await loadUsers();
      setEditingUser(null);
    } catch (err) {
      setError(`Error actualizando usuario: ${err.message}`);
    }
  };

  if (loading) {
    return <div style={styles.loadingContainer}>Cargando...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Instituto - Panel de Control</h1>
      
      <div style={styles.header}>
        <div style={styles.statusBar}>
          <p style={styles.statusItem}>
            <strong>Fecha:</strong> {new Date().toLocaleString()}
          </p>
          <p style={styles.statusItem}>
            <strong>Usuario:</strong> clehider
          </p>
        </div>

        <button 
          onClick={createUser} 
          style={styles.createButton}
        >
          Crear Nuevo Usuario
        </button>
      </div>

      {error && (
        <div style={styles.error}>Error: {error}</div>
      )}

      <h2 style={styles.subtitle}>Usuarios ({users.length})</h2>
      
      <div style={styles.userList}>
        {users.map(user => (
          <div key={user.id} style={styles.userCard}>
            {editingUser?.id === user.id ? (
              <div style={styles.editForm}>
                <input
                  style={styles.input}
                  value={editingUser.nombre}
                  onChange={e => setEditingUser({...editingUser, nombre: e.target.value})}
                  placeholder="Nombre"
                />
                <input
                  style={styles.input}
                  value={editingUser.email}
                  onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                  placeholder="Email"
                />
                <select
                  style={styles.input}
                  value={editingUser.role}
                  onChange={e => setEditingUser({...editingUser, role: e.target.value})}
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="profesor">Profesor</option>
                  <option value="admin">Administrador</option>
                </select>
                <div style={styles.buttonGroup}>
                  <button
                    onClick={() => updateUser(user.id, editingUser)}
                    style={{...styles.button, ...styles.saveButton}}
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingUser(null)}
                    style={{...styles.button, ...styles.cancelButton}}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h3 style={styles.userName}>{user.nombre}</h3>
                <p style={styles.userInfo}>
                  <strong>Email:</strong> {user.email}
                </p>
                <p style={styles.userInfo}>
                  <strong>Rol:</strong> {user.role}
                </p>
                <div style={styles.buttonGroup}>
                  <button
                    onClick={() => setEditingUser(user)}
                    style={{...styles.button, ...styles.editButton}}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    style={{...styles.button, ...styles.deleteButton}}
                  >
                    Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: 'system-ui, sans-serif'
  },
  title: {
    textAlign: 'center',
    color: '#1a365d',
    marginBottom: '20px'
  },
  header: {
    marginBottom: '20px'
  },
  statusBar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  statusItem: {
    margin: '0'
  },
  createButton: {
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    width: '100%'
  },
  subtitle: {
    color: '#2d3748',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '10px'
  },
  userList: {
    display: 'grid',
    gap: '20px',
    padding: '20px 0'
  },
  userCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  userName: {
    margin: '0 0 10px 0',
    color: '#2d3748'
  },
  userInfo: {
    margin: '5px 0',
    color: '#4a5568'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px'
  },
  button: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    flex: 1
  },
  editButton: {
    backgroundColor: '#4299e1',
    color: 'white'
  },
  deleteButton: {
    backgroundColor: '#f56565',
    color: 'white'
  },
  saveButton: {
    backgroundColor: '#48bb78',
    color: 'white'
  },
  cancelButton: {
    backgroundColor: '#a0aec0',
    color: 'white'
  },
  editForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  input: {
    padding: '8px',
    border: '1px solid #e2e8f0',
    borderRadius: '4px',
    fontSize: '16px'
  },
  error: {
    backgroundColor: '#fff5f5',
    color: '#c53030',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '20px',
    color: '#4299e1'
  }
};

export default App;
