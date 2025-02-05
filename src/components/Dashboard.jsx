import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEstudiantes: 0,
    totalProfesores: 0,
    totalCursos: 0,
    actividadesRecientes: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Obtener usuarios
      const usersRef = collection(db, 'usuarios');
      const usersSnapshot = await getDocs(usersRef);
      const estudiantes = usersSnapshot.docs.filter(doc => doc.data().role === 'estudiante');
      const profesores = usersSnapshot.docs.filter(doc => doc.data().role === 'profesor');

      // Obtener actividades recientes (simulado por ahora)
      const actividades = [
        { id: 1, tipo: 'registro', usuario: 'María García', fecha: '2025-02-05 15:30:00', descripcion: 'Nuevo registro de estudiante' },
        { id: 2, tipo: 'curso', usuario: 'Prof. Juan López', fecha: '2025-02-05 14:45:00', descripcion: 'Curso de Pintura actualizado' },
        { id: 3, tipo: 'calificacion', usuario: 'Prof. Ana Martínez', fecha: '2025-02-05 13:20:00', descripcion: 'Calificaciones publicadas' },
      ];

      setStats({
        totalEstudiantes: estudiantes.length,
        totalProfesores: profesores.length,
        totalCursos: 5, // Simulado por ahora
        actividadesRecientes: actividades
      });
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (tipo) => {
    switch (tipo) {
      case 'registro': return '👤';
      case 'curso': return '📚';
      case 'calificacion': return '📝';
      default: return '📌';
    }
  };

  if (loading) {
    return <div style={styles.loading}>Cargando dashboard...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Encabezado */}
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <div style={styles.userInfo}>
          <span>Bienvenido, {auth.currentUser?.email}</span>
          <span style={styles.date}>{new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div style={styles.statsGrid}>
        <div style={{...styles.statsCard, backgroundColor: '#4299e1'}}>
          <h3>Estudiantes</h3>
          <p style={styles.statsNumber}>{stats.totalEstudiantes}</p>
          <span style={styles.statsIcon}>👥</span>
        </div>
        <div style={{...styles.statsCard, backgroundColor: '#48bb78'}}>
          <h3>Profesores</h3>
          <p style={styles.statsNumber}>{stats.totalProfesores}</p>
          <span style={styles.statsIcon}>👨‍🏫</span>
        </div>
        <div style={{...styles.statsCard, backgroundColor: '#ed8936'}}>
          <h3>Cursos</h3>
          <p style={styles.statsNumber}>{stats.totalCursos}</p>
          <span style={styles.statsIcon}>📚</span>
        </div>
      </div>

      {/* Accesos Rápidos */}
      <div style={styles.quickAccess}>
        <h2 style={styles.sectionTitle}>Accesos Rápidos</h2>
        <div style={styles.quickAccessGrid}>
          <button style={styles.quickAccessButton}>
            <span style={styles.buttonIcon}>➕</span>
            Nuevo Estudiante
          </button>
          <button style={styles.quickAccessButton}>
            <span style={styles.buttonIcon}>📚</span>
            Crear Curso
          </button>
          <button style={styles.quickAccessButton}>
            <span style={styles.buttonIcon}>📝</span>
            Calificaciones
          </button>
          <button style={styles.quickAccessButton}>
            <span style={styles.buttonIcon}>📅</span>
            Horarios
          </button>
        </div>
      </div>

      {/* Actividades Recientes */}
      <div style={styles.recentActivities}>
        <h2 style={styles.sectionTitle}>Actividades Recientes</h2>
        <div style={styles.activitiesList}>
          {stats.actividadesRecientes.map(actividad => (
            <div key={actividad.id} style={styles.activityCard}>
              <span style={styles.activityIcon}>{getActivityIcon(actividad.tipo)}</span>
              <div style={styles.activityInfo}>
                <h4 style={styles.activityTitle}>{actividad.descripcion}</h4>
                <p style={styles.activityMeta}>
                  {actividad.usuario} - {actividad.fecha}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '2em',
    color: '#2d3748',
    margin: 0,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    color: '#4a5568',
  },
  date: {
    fontSize: '0.9em',
    color: '#718096',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statsCard: {
    padding: '20px',
    borderRadius: '10px',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
  },
  statsNumber: {
    fontSize: '2.5em',
    margin: '10px 0',
    fontWeight: 'bold',
  },
  statsIcon: {
    position: 'absolute',
    right: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '3em',
    opacity: '0.3',
  },
  quickAccess: {
    marginBottom: '30px',
  },
  sectionTitle: {
    color: '#2d3748',
    marginBottom: '20px',
  },
  quickAccessGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  quickAccessButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '1em',
    '&:hover': {
      backgroundColor: '#f7fafc',
      transform: 'translateY(-2px)',
    },
  },
  buttonIcon: {
    marginRight: '10px',
    fontSize: '1.2em',
  },
  recentActivities: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  activitiesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  activityCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#f7fafc',
    borderRadius: '8px',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'translateX(5px)',
    },
  },
  activityIcon: {
    fontSize: '1.5em',
    marginRight: '15px',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    margin: '0 0 5px 0',
    color: '#2d3748',
  },
  activityMeta: {
    margin: 0,
    fontSize: '0.9em',
    color: '#718096',
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontSize: '1.2em',
    color: '#4299e1',
  },
};

export default Dashboard;
