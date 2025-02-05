import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: {
      totalEstudiantes: 0,
      totalProfesores: 0,
      totalCursos: 0,
    },
    chartData: {
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
    },
    actividadesRecientes: []
  });

  const loadData = async () => {
    try {
      setLoading(true);
      // Obtener usuarios
      const usersRef = collection(db, 'usuarios');
      const usersSnapshot = await getDocs(usersRef);
      const estudiantes = usersSnapshot.docs.filter(doc => doc.data().role === 'estudiante');
      const profesores = usersSnapshot.docs.filter(doc => doc.data().role === 'profesor');

      // Obtener actividades recientes
      const actividadesRef = collection(db, 'actividades');
      const actividadesQuery = query(actividadesRef, orderBy('fecha', 'desc'), limit(5));
      const actividadesSnapshot = await getDocs(actividadesQuery);
      const actividades = actividadesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setData(prevData => ({
        ...prevData,
        stats: {
          totalEstudiantes: estudiantes.length,
          totalProfesores: profesores.length,
          totalCursos: 5
        },
        actividadesRecientes: actividades.length > 0 ? actividades : [
          { 
            id: 1, 
            tipo: 'registro', 
            usuario: 'María García', 
            fecha: new Date().toISOString(), 
            descripcion: 'Nuevo registro de estudiante' 
          },
          { 
            id: 2, 
            tipo: 'curso', 
            usuario: 'Prof. Juan López', 
            fecha: new Date().toISOString(), 
            descripcion: 'Curso de Pintura actualizado' 
          },
          { 
            id: 3, 
            tipo: 'calificacion', 
            usuario: 'Prof. Ana Martínez', 
            fecha: new Date().toISOString(), 
            descripcion: 'Calificaciones publicadas' 
          }
        ]
      }));
    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    data,
    loading,
    error,
    refreshData: loadData
  };
};
