import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Importar map
import { environment } from '../../environments/environment'; // Importar environment
import { Investigador, InvestigadorSummary, ApiResponseInvestigador } from '../page/investigador/investigador.model'; // Importar modelo

@Injectable({
  providedIn: 'root'
})
export class InvestigadorService {
  private apiUrl = `${environment.apiUrl}/investigadores/all`; // URL base para investigadores

  constructor(private http: HttpClient) { }

  // GET /investigadores (obtiene todos o la primera página)
  getAllInvestigadores(): Observable<InvestigadorSummary[]> {
    // NOTA: Si necesitas paginación, ajusta esta llamada
    return this.http.get<ApiResponseInvestigador>(this.apiUrl).pipe(
      map(response => response.data) // Extraer solo el array 'data'
    );
  }

  // GET /investigadores
  getInvestigadores(): Observable<Investigador[]> {
    return this.http.get<Investigador[]>(this.apiUrl);
  }

  // GET /investigadores/{id}
  getInvestigador(id: number | string): Observable<Investigador> {
    return this.http.get<Investigador>(`${this.apiUrl}/${id}`);
  }

  // POST /investigadores
  createInvestigador(investigador: Omit<Investigador, 'id'>): Observable<Investigador> {
    // Asume que la API devuelve el investigador creado con su ID
    return this.http.post<Investigador>(this.apiUrl, investigador);
  }

  // PUT /investigadores/{id}
  updateInvestigador(id: number | string, investigador: Partial<Investigador>): Observable<Investigador> {
    // Asume que la API devuelve el investigador actualizado
    // Usamos Partial<> para permitir actualizaciones parciales si la API lo soporta
    return this.http.put<Investigador>(`${this.apiUrl}/${id}`, investigador);
  }

  // DELETE /investigadores/{id}
  deleteInvestigador(id: number | string): Observable<void> {
    // Usualmente DELETE no devuelve contenido, por eso Observable<void>
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // GET /investigadores/{idInvestigador}/grupos
  // Nota: Este endpoint podría pertenecer lógicamente a GrupoService
  // o mantenerse aquí si se ve como una propiedad del investigador.
  // Asumiendo que devuelve una lista de Grupos (necesitaríamos la interfaz Grupo)
  // getGruposByInvestigador(idInvestigador: number | string): Observable<Grupo[]> {
  //   return this.http.get<Grupo[]>(`${this.apiUrl}/${idInvestigador}/grupos`);
  // }
}
