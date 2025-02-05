import { useState, useEffect } from 'react';
import { db, auth } from '../firebase/config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import NewStudentForm from './forms/NewStudentForm';
import DashboardCharts from './charts/DashboardCharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEstudiantes: 0,
    totalProfesores: 0,
    totalCursos: 0,
    actividadesRecientes: []
  });
  
  const [chartData] = useState({
    estudiantesPorMes: [
      { mes: 'Ene', cantidad: 45 },
      { mes: 'Feb', cantidad: 52 },
      { mes: 'Mar', cantidad: 58 },
      { mes: 'Abr', cantidad: 65 },
      { mes: 'May', cantidad: 71 }
    ],
    distribucionCursos: [
      { nombre: 'Pintura', estudiantes: 25 },
      { nombre: 'Escultura', estudiantes: 15 },
      { nombre: 'Dibujo', estudiantes: 30 },
      { nombre: 'Fotografía', estudiantes: 20 },
      { nombre: 'Artesanía', estudiantes: 18 }
    ],
    asistencia: [
      { mes: 'Ene', porcentaje: 85 },
      { mes: 'Feb', porcentaje: 88 },
      { mes: 'Mar', porcentaje: 92 },
      { mes: 'Abr', porcentaje: 90 },
      { mes: 'May', porcentaje: 94 }
    ]
  });

  const [loading, setLoading] = useState(true);
  const [showNewStudentForm, setShowNewStudentForm] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const usersRef = collection(db, 'usuarios');
      const usersSnapshot = await getDocs(usersRef);
      const estudiantes = usersSnapshot.docs.filter(doc => doc.data().role === 'estudiante');
      const profesores = usersSnapshot.docs.filter(doc => doc.data().role === 'profesor');

      const actividades = [
        { id: 1, tipo: 'registro', usuario: 'María García', fecha: '2025-02-05 15:30:00', descripcion: 'Nuevo registro de estudiante' },
        { id: 2, tipo: 'curso', usuario: 'Prof. Juan López', fecha: '2025-02-05 14:45:00', descripcion: 'Curso de Pintura actualizado' },
        { id: 3, tipo: 'calificacion', usuario: 'Prof. Ana Martínez', fecha: '2025-02-05 13:20:00', descripcion: 'Calificaciones publicadas' },
      ];

      setStats({
        totalEstudiantes: estudiantes.length,
        totalProfesores: profesores.length,
        totalCursos: 5,
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

      {/* Gráficas */}
      <div style={styles.chartsSection}>
        <h2 style={styles.sectionTitle}>Estadísticas</h2>
        <DashboardCharts data={chartData} />
      </div>

      {/* Accesos Rápidos */}
      <div style={styles.quickAccess}>
        <h2 style={styles.sectionTitle}>Accesos Rápidos</h2>
        <div style={styles.quickAccessGrid}>
          <button 
            style={styles.quickAccessButton}
            onClick={() => setShowNewStudentForm(true)}
          >
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

      {/* Modal de Nuevo Estudiante */}
      {showNewStudentForm && (
        <NewStudentForm onClose={() => setShowNewStudentForm(false)} />
      )}
    </div>
  );
};

const styles = {
  // ... (estilos anteriores) ...
  chartsSection: {
    marginBottom: '30px',
  },
};

export default Dashboard;
