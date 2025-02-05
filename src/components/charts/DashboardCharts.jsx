import { useState } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  AreaChart, Area, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { exportService } from '../../services/exportService';
import AnimatedChart from './AnimatedChart';

const COLORS = ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#ed64a6'];

const DashboardCharts = ({ data }) => {
  const [activeCharts, setActiveCharts] = useState(['line', 'bar', 'pie', 'area', 'radar', 'scatter']);

  const handleExport = (chartData, chartName, format) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${chartName}_${timestamp}`;

    switch (format) {
      case 'csv':
        exportService.toCSV(chartData, filename);
        break;
      case 'excel':
        exportService.toExcel(chartData, filename);
        break;
      case 'pdf':
        const headers = Object.keys(chartData[0]);
        exportService.toPDF(chartData, filename, headers);
        break;
    }
  };

  const ExportOptions = ({ chartData, chartName }) => (
    <div style={styles.exportOptions}>
      {['csv', 'excel', 'pdf'].map((format) => (
        <motion.button
          key={format}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleExport(chartData, chartName, format)}
          style={styles.exportButton}
        >
          {format.toUpperCase()}
        </motion.button>
      ))}
    </div>
  );

  const renderChart = (type) => {
    switch (type) {
      case 'line':
        return (
          <AnimatedChart 
            title="Evolución de Estudiantes"
            exportOptions={
              <ExportOptions 
                chartData={data.estudiantesPorMes}
                chartName="estudiantes_evolucion"
              />
            }
          >
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
                  animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          </AnimatedChart>
        );

      case 'bar':
        return (
          <AnimatedChart 
            title="Distribución por Cursos"
            exportOptions={
              <ExportOptions 
                chartData={data.distribucionCursos}
                chartName="distribucion_cursos"
              />
            }
          >
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
                  animationDuration={2000}
                >
                  {data.distribucionCursos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </AnimatedChart>
        );

      case 'pie':
        return (
          <AnimatedChart 
            title="Distribución Porcentual"
            exportOptions={
              <ExportOptions 
                chartData={data.distribucionCursos}
                chartName="distribucion_porcentual"
              />
            }
          >
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
                  animationDuration={2000}
                >
                  {data.distribucionCursos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </AnimatedChart>
        );

      case 'area':
        return (
          <AnimatedChart 
            title="Tendencia de Asistencia"
            exportOptions={
              <ExportOptions 
                chartData={data.asistencia}
                chartName="tendencia_asistencia"
              />
            }
          >
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
                  animationDuration={2000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </AnimatedChart>
        );

      case 'radar':
        return (
          <AnimatedChart 
            title="Análisis Multidimensional"
            exportOptions={
              <ExportOptions 
                chartData={data.distribucionCursos}
                chartName="analisis_radar"
              />
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.distribucionCursos}>
                <PolarGrid />
                <PolarAngleAxis dataKey="nombre" />
                <PolarRadiusAxis />
                <Radar
                  name="Estudiantes"
                  dataKey="estudiantes"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                  animationDuration={2000}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </AnimatedChart>
        );

      case 'scatter':
        return (
          <AnimatedChart 
            title="Correlación Asistencia-Rendimiento"
            exportOptions={
              <ExportOptions 
                chartData={data.estudiantesPorMes}
                chartName="correlacion_scatter"
              />
            }
          >
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" name="Mes" />
                <YAxis dataKey="cantidad" name="Cantidad" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter
                  name="Estudiantes"
                  data={data.estudiantesPorMes}
                  fill="#8884d8"
                  animationDuration={2000}
                />
                <Legend />
              </ScatterChart>
            </ResponsiveContainer>
          </AnimatedChart>
        );
    }
  };

  return (
    <motion.div 
      style={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div style={styles.chartControls}>
        {['line', 'bar', 'pie', 'area', 'radar', 'scatter'].map((chartType) => (
          <motion.button
            key={chartType}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              ...styles.chartTypeButton,
              backgroundColor: activeCharts.includes(chartType) ? '#4299e1' : '#edf2f7',
              color: activeCharts.includes(chartType) ? 'white' : '#4a5568',
            }}
            onClick={() => {
              setActiveCharts(prev => 
                prev.includes(chartType)
                  ? prev.filter(type => type !== chartType)
                  : [...prev, chartType]
              );
            }}
          >
            {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        <motion.div style={styles.chartsGrid}>
          {activeCharts.map((chartType) => (
            <motion.div
              key={chartType}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {renderChart(chartType)}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

const styles = {
  container: {
    width: '100%',
    padding: '20px 0',
  },
  chartControls: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  chartTypeButton: {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: '500',
    transition: 'all 0.2s ease',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  exportOptions: {
    display: 'flex',
    gap: '5px',
  },
  exportButton: {
    padding: '4px 8px',
    backgroundColor: '#edf2f7',
    color: '#4a5568',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8em',
    fontWeight: '500',
  },
};

export default DashboardCharts;
