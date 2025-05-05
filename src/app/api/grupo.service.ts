import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs'; // Importar 'of' para devolver Observable vacío
import { map } from 'rxjs/operators'; // Importar map
import { environment } from '../../environments/environment';
import { Grupo, GrupoDetail, InvestigadorDetail, GrupoInvestigadorDetail, Pagination, ApiResponse, GrupoSummary } from '../page/grupo/grupo.model'; // Importar modelo Grupo
// import { DetalleGrupoInvestigador } from '../page/detalle_grupo_investigador/detalle_grupo_investigador.model'; // Necesario para getDetallesByGrupo

// Interfaz para los filtros actualizada
export interface GrupoFilters {
  investigador?: string;
  grupo?: string; // Añadir filtro por nombre de grupo si la API lo soporta
  tipoInvestigacion?: string;
  lineaInvestigacion?: string;
  año?: string;
  page?: number; // Añadir página
}

@Injectable({
  providedIn: 'root'
})
export class GrupoService {
  private apiUrl = `${environment.apiUrl}/grupos`; 
  
  constructor(private http: HttpClient) { }

  // GET /grupos
  getGrupos(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(this.apiUrl);
  }

  // GET /grupos/{id}
  getGrupo(id: number | string): Observable<Grupo> {
    return this.http.get<Grupo>(`${this.apiUrl}/${id}`);
  }

  // GET /grupos/{id}/details - Asume que devuelve un Grupo (quizás más detallado)
  getGrupoDetails(id: number | string): Observable<Grupo> { // Ajusta el tipo de retorno si es diferente
    return this.http.get<Grupo>(`${this.apiUrl}/${id}/details`);
  }

  // GET /grupos/with-details - Asume que devuelve un array de Grupos (quizás más detallados)
  getAllGruposWithDetails(): Observable<Grupo[]> { // Ajusta el tipo de retorno si es diferente
    return this.http.get<Grupo[]>(`${this.apiUrl}/with-details`);
  }

  // GET /grupos/{grupoID}/detalles - Devuelve los detalles asociados a un grupo
  // getDetallesByGrupo(grupoID: number | string): Observable<DetalleGrupoInvestigador[]> {
  //   return this.http.get<DetalleGrupoInvestigador[]>(`${this.apiUrl}/${grupoID}/detalles`);
  // }

  // Método para obtener un resumen de todos los grupos (nombre y ID)
  getAllGruposSummary(): Observable<GrupoSummary[]> {
    const params = new HttpParams().set('limit', '100');
    // Forzar el tipo de respuesta esperado para este endpoint específico
    return this.http.get<{ data: GrupoDetail[], pagination: Pagination }>(this.apiUrl, { params }).pipe(
      map(response => response.data.map(grupoDetail => ({
        id: grupoDetail.idGrupo,
        nombre: grupoDetail.nombre,
        lineaInvestigacion: grupoDetail.lineaInvestigacion,
        tipoInvestigacion: grupoDetail.tipoInvestigacion,
        fechaRegistro: grupoDetail.fechaRegistro
      })))
    );
  }

  // GET /grupos con filtros opcionales y paginación
  // Devuelve el ApiResponse completo
  getGruposFiltered(filters: GrupoFilters): Observable<ApiResponse> {
    let params = new HttpParams();

    // Añadir parámetros solo si tienen valor
    if (filters.investigador && filters.investigador.trim() !== '') {
      params = params.set('investigador', filters.investigador.trim());
    }
    if (filters.grupo && filters.grupo.trim() !== '') {
      // Asegúrate que la API soporte este filtro con la key 'grupo'
      params = params.set('grupo', filters.grupo.trim()); 
    }
    if (filters.tipoInvestigacion && filters.tipoInvestigacion.trim() !== '') {
      params = params.set('tipoInvestigacion', filters.tipoInvestigacion.trim());
    }
    if (filters.lineaInvestigacion && filters.lineaInvestigacion.trim() !== '') {
      params = params.set('lineaInvestigacion', filters.lineaInvestigacion.trim());
    }
    if (filters.año && filters.año.trim() !== '') {
      params = params.set('año', filters.año.trim());
    }
    // Añadir siempre el parámetro page (o default a 1 si no viene)
    params = params.set('page', (filters.page ?? 1).toString());

    // Nota: No es necesario chequear si hay filtros, la API debería manejarlo.
    // La API devuelve GrupoDetail[], así que el tipo genérico es ApiResponse
    return this.http.get<ApiResponse>(this.apiUrl, { params });
      // Ya no usamos map aquí, devolvemos toda la respuesta
  }

  // POST /grupos
  // TODO: Manejar FormData si la API espera subida de archivos multipart/form-data
  createGrupo(grupo: Omit<Grupo, 'id' | 'imagenUrl'>): Observable<Grupo> {
    return this.http.post<Grupo>(this.apiUrl, grupo);
  }

  // POST /grupos/with-details
  // TODO: Implementar según la estructura de datos esperada
  createGrupoWithDetails(data: any): Observable<Grupo> {
    return this.http.post<Grupo>(`${this.apiUrl}/with-details`, data);
  }


  // PUT /grupos/{id}
  // TODO: Manejar FormData si la API espera subida de archivos multipart/form-data
  updateGrupo(id: number | string, grupo: Partial<Grupo>): Observable<Grupo> {
    return this.http.put<Grupo>(`${this.apiUrl}/${id}`, grupo);
  }

  // DELETE /grupos/{id}
  deleteGrupo(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
