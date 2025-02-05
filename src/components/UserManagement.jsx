import { useState } from 'react';
import Papa from 'papaparse';

export const UserManagement = ({ 
  users,
  filteredUsers,
  itemsPerPage = 6,
  onImport,
  onExport,
  isLoading
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [importError, setImportError] = useState(null);

  // Paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Exportar a CSV
  const handleExport = () => {
    const csv = Papa.unparse(users.map(user => ({
      nombre: user.nombre,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    })));
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `usuarios_${new Date().toISOString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Importar desde CSV
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          try {
            const validUsers = results.data
              .filter(row => row.nombre && row.email) // Validación básica
              .map(row => ({
                nombre: row.nombre,
                email: row.email,
                role: row.role || 'estudiante',
                createdAt: row.createdAt || new Date().toISOString()
              }));
            onImport(validUsers);
            setImportError(null);
          } catch (error) {
            setImportError('Error en el formato del archivo CSV');
          }
        },
        header: true,
        error: (error) => {
          setImportError(`Error al procesar el archivo: ${error.message}`);
        }
      });
    }
  };

  return (
    <div className="user-management">
      <div className="user-actions">
        <button 
          onClick={handleExport} 
          className="button primary"
          disabled={isLoading || users.length === 0}
        >
          Exportar a CSV
        </button>
        <label className="button secondary import-button">
          Importar CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleImport}
            style={{ display: 'none' }}
            disabled={isLoading}
          />
        </label>
      </div>

      {importError && (
        <div className="error-message">
          {importError}
        </div>
      )}

      {/* Paginación */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="button secondary"
        >
          Anterior
        </button>
        <span className="page-info">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="button secondary"
        >
          Siguiente
        </button>
      </div>

      <div className="page-size">
        <span>Mostrando {Math.min(itemsPerPage, filteredUsers.length)} de {filteredUsers.length} usuarios</span>
      </div>
    </div>
  );
};

export default UserManagement;
