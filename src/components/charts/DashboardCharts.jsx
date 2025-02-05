import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardCharts = ({ data }) => {
  return (
    <div style={styles.chartsContainer}>
      {/* Gráfica de Estudiantes por Mes */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>Estudiantes por Mes</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.estudiantesPorMes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="cantidad" 
              stroke="#4299e1" 
              strokeWidth={2}
              name="Total Estudiantes"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica de Distribución por Cursos */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>Distribución por Cursos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.distribucionCursos}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="estudiantes" 
              fill="#48bb78" 
              name="Estudiantes"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfica de Asistencia */}
      <div style={styles.chartCard}>
        <h3 style={styles.chartTitle}>Porcentaje de Asistencia</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.asistencia}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="porcentaje" 
              stroke="#ed8936" 
              strokeWidth={2}
              name="% Asistencia"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const styles = {
  chartsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  chartCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  chartTitle: {
    color: '#2d3748',
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: '1.2em',
    fontWeight: '500',
  },
};

export default DashboardCharts;
