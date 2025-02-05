import { useState } from 'react';
import { auth } from '../firebase/config';
import NewStudentForm from './forms/NewStudentForm';
import DashboardCharts from './charts/DashboardCharts';
import { useDashboardData } from '../hooks/useDashboardData';

const Dashboard = () => {
  const { data, loading, error, refreshData } = useDashboardData();
  const [showNewStudentForm, setShowNewStudentForm] = useState(false);

  const getActivityIcon = (tipo) => {
    switch (tipo) {
      case 'registro': return '👤';
      case 'curso': return '📚';
      case 'calificacion': return '📝';
      default: return '📌';
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingContent}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h2 style={styles.errorTitle}>Error al cargar el dashboard</h2>
        <p style={styles.errorMessage}>{error}</p>
        <button 
          onClick={refreshData}
          style={styles.retryButton}
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>
            <span style={styles.titleIcon}>📊</span>
            Dashboard
          </h1>
          <div style={styles.userInfo}>
            <span style={styles.welcomeText}>
              Bienvenido, {auth.currentUser?.email}
            </span>
            <span style={styles.date}>
              {new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </header>

      <main style={styles.mainContent}>
        {/* Tarjetas de Estadísticas */}
        <div style={styles.statsGrid}>
          <div style={{...styles.statsCard, backgroundColor: '#4299e1'}}>
            <div style={styles.statsIconContainer}>👥</div>
            <div style={styles.statsInfo}>
              <h3 style={styles.statsTitle}>Estudiantes</h3>
              <p style={styles.statsNumber}>{data.stats.totalEstudiantes}</p>
            </div>
          </div>
          <div style={{...styles.statsCard, backgroundColor: '#48bb78'}}>
            <div style={styles.statsIconContainer}>👨‍🏫</div>
            <div style={styles.statsInfo}>
              <h3 style={styles.statsTitle}>Profesores</h3>
              <p style={styles.statsNumber}>{data.stats.totalProfesores}</p>
            </div>
          </div>
          <div style={{...styles.statsCard, backgroundColor: '#ed8936'}}>
            <div style={styles.statsIconContainer}>📚</div>
            <div style={styles.statsInfo}>
              <h3 style={styles.statsTitle}>Cursos</h3>
              <p style={styles.statsNumber}>{data.stats.totalCursos}</p>
            </div>
          </div>
        </div>

        {/* Gráficas */}
        <section style={styles.chartsSection}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>📈</span>
            Estadísticas
          </h2>
          <DashboardCharts data={data.chartData} />
        </section>

        {/* Accesos Rápidos */}
        <section style={styles.quickAccess}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>⚡</span>
            Accesos Rápidos
          </h2>
          <div style={styles.quickAccessGrid}>
            <button 
              style={styles.quickAccessButton}
              onClick={() => setShowNewStudentForm(true)}
            >
              <span style={styles.buttonIcon}>➕</span>
              <span style={styles.buttonText}>Nuevo Estudiante</span>
            </button>
            <button style={styles.quickAccessButton}>
              <span style={styles.buttonIcon}>📚</span>
              <span style={styles.buttonText}>Crear Curso</span>
            </button>
            <button style={styles.quickAccessButton}>
              <span style={styles.buttonIcon}>📝</span>
              <span style={styles.buttonText}>Calificaciones</span>
            </button>
            <button style={styles.quickAccessButton}>
              <span style={styles.buttonIcon}>📅</span>
              <span style={styles.buttonText}>Horarios</span>
            </button>
          </div>
        </section>

        {/* Actividades Recientes */}
        <section style={styles.recentActivities}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>🔔</span>
            Actividades Recientes
          </h2>
          <div style={styles.activitiesList}>
            {data.actividadesRecientes.map(actividad => (
              <div key={actividad.id} style={styles.activityCard}>
                <span style={styles.activityIcon}>
                  {getActivityIcon(actividad.tipo)}
                </span>
                <div style={styles.activityInfo}>
                  <h4 style={styles.activityTitle}>{actividad.descripcion}</h4>
                  <p style={styles.activityMeta}>
                    {actividad.usuario} - {new Date(actividad.fecha).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Modal de Nuevo Estudiante */}
      {showNewStudentForm && (
        <NewStudentForm 
          onClose={() => setShowNewStudentForm(false)} 
          onSuccess={() => {
            setShowNewStudentForm(false);
            refreshData();
          }}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f7fafc',
  },
  header: {
    backgroundColor: '#1a365d',
    color: 'white',
    padding: '20px 0',
    marginBottom: '30px',
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '2em',
    margin: 0,
  },
  titleIcon: {
    marginRight: '10px',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  welcomeText: {
    fontSize: '1.1em',
    marginBottom: '5px',
  },
  date: {
    fontSize: '0.9em',
    opacity: '0.8',
  },
  mainContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statsCard: {
    padding: '25px',
    borderRadius: '12px',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    transition: 'transform 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },
  statsIconContainer: {
    fontSize: '2.5em',
    marginRight: '20px',
  },
  statsInfo: {
    flex: 1,
  },
  statsTitle: {
    margin: '0 0 5px 0',
    fontSize: '1.1em',
    fontWeight: '500',
  },
  statsNumber: {
    margin: 0,
    fontSize: '2em',
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#2d3748',
    fontSize: '1.5em',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: '10px',
  },
  quickAccessGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '30px',
  },
  quickAccessButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  buttonIcon: {
    fontSize: '2em',
    marginBottom: '10px',
  },
  buttonText: {
    fontSize: '1em',
    color: '#2d3748',
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
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease',
  },
  activityIcon: {
    fontSize: '1.5em',
    marginRight: '15px',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ebf8ff',
    borderRadius: '50%',
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    margin: '0 0 5px 0',
    color: '#2d3748',
    fontSize: '1.1em',
  },
  activityMeta: {
    margin: 0,
    fontSize: '0.9em',
    color: '#718096',
  },
  chartsSection: {
    marginBottom: '30px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f7fafc',
  },
  loadingContent: {
    textAlign: 'center',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #4299e1',
    borderRadius: '50%',
    margin: '0 auto 20px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#2d3748',
    fontSize: '1.2em',
  },
  errorContainer: {
    padding: '40px 20px',
    textAlign: 'center',
    maxWidth: '600px',
    margin: '0 auto',
  },
  errorTitle: {
    color: '#c53030',
    marginBottom: '20px',
  },
  errorMessage: {
    color: '#718096',
    marginBottom: '30px',
  },
  retryButton: {
    backgroundColor: '#4299e1',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1em',
    transition: 'background-color 0.2s ease',
  },
};

export default Dashboard;
