// Basado en la estructura probable de tu API Go
export interface DetalleGrupoInvestigador {
  id: number; // O string si usas UUID
  investigador_id: number; // Clave foránea a Investigador
  grupo_id: number;      // Clave foránea a Grupo
  fecha_vinculacion?: string; // Campo opcional ejemplo (formato ISO 8601 preferiblemente)
  rol?: string;              // Campo opcional ejemplo
  // Añade otros campos que tu API devuelva o espere
} 