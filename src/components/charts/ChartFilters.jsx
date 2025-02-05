import { useState } from 'react';

const ChartFilters = ({ onFilterChange }) => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [selectedView, setSelectedView] = useState('mensual');

  const handleFilterChange = (newFilters) => {
    const filters = {
      ...dateRange,
      view: selectedView,
      ...newFilters
    };
    setDateRange({
      startDate: filters.startDate,
      endDate: filters.endDate
    });
    setSelectedView(filters.view);
    onFilterChange(filters);
  };

  return (
    <div style={styles.filterContainer}>
      <div style={styles.filterGroup}>
        <label style={styles.label}>Período</label>
        <div style={styles.dateInputs}>
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) => handleFilterChange({ startDate: e.target.value })}
            style={styles.input}
          />
          <span style={styles.dateSeparator}>hasta</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) => handleFilterChange({ endDate: e.target.value })}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.filterGroup}>
        <label style={styles.label}>Vista</label>
        <select
          value={selectedView}
          onChange={(e) => handleFilterChange({ view: e.target.value })}
          style={styles.select}
        >
          <option value="diaria">Diaria</option>
          <option value="semanal">Semanal</option>
          <option value="mensual">Mensual</option>
          <option value="trimestral">Trimestral</option>
          <option value="anual">Anual</option>
        </select>
      </div>

      <div style={styles.filterGroup}>
        <button 
          onClick={() => handleFilterChange({
            startDate: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            view: 'mensual'
          })}
          style={styles.resetButton}
        >
          Resetear Filtros
        </button>
      </div>
    </div>
  );
};

const styles = {
  filterContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '0.9em',
    color: '#4a5568',
    fontWeight: '500',
  },
  dateInputs: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  input: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    fontSize: '0.9em',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    fontSize: '0.9em',
    minWidth: '150px',
  },
  dateSeparator: {
    color: '#718096',
  },
  resetButton: {
    padding: '8px 16px',
    backgroundColor: '#edf2f7',
    color: '#4a5568',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9em',
    transition: 'all 0.2s ease',
  },
};

export default ChartFilters;
