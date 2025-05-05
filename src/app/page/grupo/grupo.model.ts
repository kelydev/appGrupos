// Basado en la estructura probable de tu API Go
export interface Grupo {
  id: number; // O string si usas UUID
  nombre: string;
  descripcion: string;
  imagenUrl?: string; // Campo opcional para la imagen (si la manejas)
  // Añade otros campos que tu API devuelva o espere
}

// Podríamos necesitar una interfaz más detallada para los endpoints "with-details"
// export interface GrupoWithDetails extends Grupo {
//   investigadores?: Investigador[]; // Ejemplo
// } 

// --- Nuevas Interfaces para la respuesta detallada --- 

export interface GrupoDetail {
  idGrupo: number;
  nombre: string;
  numeroResolucion: string;
  lineaInvestigacion: string;
  tipoInvestigacion: string;
  fechaRegistro: string; // Mantener como string (ISO 8601)
  archivo: string;
  // createdAt y updatedAt pueden omitirse si no se usan en el frontend
}

export interface InvestigadorDetail {
  idInvestigador: number;
  nombre: string;
  apellido: string;
  rol: string; // Ej: 'Coordinador', 'Integrante'
  // createdAt y updatedAt pueden omitirse
}

export interface GrupoInvestigadorDetail {
  grupo: GrupoDetail;
  investigadores: InvestigadorDetail[];
}

export interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface ApiResponse {
  data: GrupoInvestigadorDetail[];
  pagination: Pagination;
}

// Interfaz para la respuesta completa de la API /investigadores
export interface ApiResponseInvestigador {
  // ... 
}

// Nueva interfaz para el resumen de Grupo (asegurar export)
export interface GrupoSummary {
  id: number;
  nombre: string;
  lineaInvestigacion: string;
  tipoInvestigacion: string;
  fechaRegistro: string;
} 