import { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell
} from 'recharts';
import ChartFilters from './ChartFilters';

const COLORS = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#ed64a6'];

const DashboardCharts = ({ data }) => {
  const [currentFilters, setCurrentFilters] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    view: 'mensual'
  });

  const handleFilterChange = (filters) => {
    setCurrentFilters(filters);
    // Aquí implementaremos la lógica para actualizar los datos según los filtros
  };

  const exportData = (chartData, chartName) => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      Object.keys(chartData[0]).join(",") + "\n" +
      chartData.map(row => Object.values(row).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${chartName}_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderExportButton = (chartData, chartName) => (
    <button 
      onClick={() => exportData(chartData, chartName)}
      style={styles.exportButton}
    >
      📊 Exportar Datos
    </button>
  );

  return (
    <div style={styles.container}>
      <ChartFilters onFilterChange={handleFilterChange} />
      
      <div style={styles.chartsGrid}>
        {/* Gráfica de Línea: Estudiantes por Mes */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Evolución de Estudiantes</h3>
            {renderExportButton(data.estudiantesPorMes, 'estudiantes_evolucion')}
          </div>
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

        {/* Gráfica de Barras: Distribución por Cursos */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Distribución por Cursos</h3>
            {renderExportButton(data.distribucionCursos, 'distribucion_cursos')}
          </div>
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

        {/* Gráfica de Área: Asistencia */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Tendencia de Asistencia</h3>
            {renderExportButton(data.asistencia, 'asistencia_tendencia')}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data.asistencia}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="porcentaje"
                stroke="#ed8936"
                fill="#fed7aa"
                name="% Asistencia"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfica de Pie: Distribución por Cursos */}
        <div style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Distribución por Cursos (%)</h3>
            {renderExportButton(data.distribucionCursos, 'distribucion_porcentaje')}
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.distribucionCursos}
                dataKey="estudiantes"
                nameKey="nombre"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.distribucionCursos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  chartCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  chartTitle: {
    color: '#2d3748',
    fontSize: '1.2em',
    fontWeight: '500',
    margin: 0,
  },
  exportButton: {
    padding: '6px 12px',
    backgroundColor: '#edf2f7',
    color: '#4a5568',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9em',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    transition: 'all 0.2s ease',
  },
};

export default DashboardCharts;
