import { useState } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const NewStudentForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    fechaNacimiento: '',
    curso: '',
    direccion: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const studentData = {
        ...formData,
        role: 'estudiante',
        fechaRegistro: new Date().toISOString(),
        estado: 'activo',
        createdBy: 'clehider',
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'usuarios'), studentData);
      onClose();
    } catch (err) {
      setError('Error al registrar estudiante: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Registrar Nuevo Estudiante</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>
        
        {error && <div style={styles.errorMessage}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nombre</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Apellidos</label>
              <input
                type="text"
                value={formData.apellidos}
                onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Teléfono</label>
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Fecha de Nacimiento</label>
              <input
                type="date"
                value={formData.fechaNacimiento}
                onChange={(e) => setFormData({...formData, fechaNacimiento: e.target.value})}
                style={styles.input}
                required
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Curso</label>
              <select
                value={formData.curso}
                onChange={(e) => setFormData({...formData, curso: e.target.value})}
                style={styles.input}
                required
              >
                <option value="">Seleccionar curso</option>
                <option value="pintura">Pintura</option>
                <option value="escultura">Escultura</option>
                <option value="dibujo">Dibujo</option>
                <option value="fotografia">Fotografía</option>
                <option value="artesania">Artesanía</option>
              </select>
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Dirección</label>
              <textarea
                value={formData.direccion}
                onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                style={{...styles.input, minHeight: '60px'}}
                required
              />
            </div>
          </div>
          
          <div style={styles.buttonGroup}>
            <button 
              type="button" 
              onClick={onClose}
              style={styles.cancelButton}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar Estudiante'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  modalTitle: {
    margin: 0,
    color: '#2d3748',
    fontSize: '1.5em',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5em',
    cursor: 'pointer',
    color: '#4a5568',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
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
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    fontSize: '1em',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  submitButton: {
    backgroundColor: '#4299e1',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1em',
  },
  cancelButton: {
    backgroundColor: '#e2e8f0',
    color: '#4a5568',
    padding: '10px 20px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1em',
  },
  errorMessage: {
    backgroundColor: '#fff5f5',
    color: '#c53030',
    padding: '12px',
    borderRadius: '6px',
    marginBottom: '20px',
  },
};

export default NewStudentForm;
