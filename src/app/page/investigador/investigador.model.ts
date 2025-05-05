// Basado en la estructura probable de tu API Go
export interface Investigador {
  id: number; // O string si usas UUID
  nombre: string;
  correo_electronico: string;
  // Añade otros campos que tu API devuelva o espere
}

// --- Nuevas Interfaces para la respuesta de /investigadores ---

// Representa un investigador en la lista para el dropdown
export interface InvestigadorSummary {
  idInvestigador: number;
  nombre: string;
  apellido: string;
}

// Interfaz para la respuesta completa de la API /investigadores
export interface ApiResponseInvestigador {
  data: InvestigadorSummary[];
  pagination: { // Reutilizamos la interfaz Pagination si es la misma
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
} 