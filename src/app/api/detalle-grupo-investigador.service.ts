import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DetalleGrupoInvestigador } from '../page/detalle_grupo_investigador/detalle_grupo_investigador.model';

@Injectable({
  providedIn: 'root'
})
export class DetalleGrupoInvestigadorService {
  private apiUrl = `${environment.apiUrl}/detalles`; // URL base para detalles
  private apiUrlGrupos = `${environment.apiUrl}/grupos`; // URL base para grupos (para endpoint específico)

  constructor(private http: HttpClient) { }

  // GET /detalles/{id}
  getDetalle(id: number | string): Observable<DetalleGrupoInvestigador> {
    return this.http.get<DetalleGrupoInvestigador>(`${this.apiUrl}/${id}`);
  }

  // GET /grupos/{grupoID}/detalles
  getDetallesByGrupo(grupoID: number | string): Observable<DetalleGrupoInvestigador[]> {
    return this.http.get<DetalleGrupoInvestigador[]>(`${this.apiUrlGrupos}/${grupoID}/detalles`);
  }

  // POST /detalles
  createDetalle(detalle: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, detalle);
  }

  // PUT /detalles/{id}
  updateDetalle(id: number | string, detalle: Partial<DetalleGrupoInvestigador>): Observable<DetalleGrupoInvestigador> {
    return this.http.put<DetalleGrupoInvestigador>(`${this.apiUrl}/${id}`, detalle);
  }

  // DELETE /detalles/{id}
  deleteDetalle(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // GET /detalles (con paginación)
  getAllDetalles(page: number = 1, limit: number = 6): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  // POST /detalles con archivo (FormData)
  createDetalleConArchivo(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData);
  }
}
