import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { GrupoService, GrupoFilters } from '../../../api/grupo.service';
import { ApiResponse, GrupoDetail, InvestigadorDetail, GrupoSummary } from '../grupo.model';
import { InvestigadorService } from '../../../api/investigador.service';
import { InvestigadorSummary } from '../../investigador/investigador.model';
import { environment } from '../../../../environments/environment';
import { Observable, of, forkJoin, Subject } from 'rxjs';
import { map, tap, catchError, mapTo, filter, take, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-search-by-investigador',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule
  ],
  templateUrl: './search-by-investigador.component.html',
  styleUrls: ['./search-by-investigador.component.scss']
})
export class SearchByInvestigadorComponent implements OnInit {

  // --- Filtros ---
  docenteInvestigador: string | null = null;
  grupoInvestigacionFilter: string | null = null;
  lineaInvestigacionFilter: string | null = null;
  tipoInvestigacionFilter: string | null = null;
  anioFilter: string | null = null;

  // --- Autocompletado Investigador ---
  investigadorNames$: Observable<string[]> = of([]);
  isLoadingInvestigadores = false;

  // --- Autocompletado Grupo ---
  grupoNames$: Observable<string[]> = of([]);
  isLoadingGrupos = false;

  // --- Autocompletado Línea (NUEVO con ng-select) ---
  lineaNames$: Observable<string[]> = of([]);
  isLoadingLineas = false;

  // --- Autocompletado Tipo (NUEVO con ng-select) ---
  tipoNames$: Observable<string[]> = of([]);
  isLoadingTipos = false;

  // --- Autocompletado Año (NUEVO con ng-select) ---
  anioNames$: Observable<string[]> = of([]);
  isLoadingAnios = false;

  // --- Resultados y Paginación ---
  apiResponse: ApiResponse | null = null;
  isLoading = false;
  searchPerformed = false;

  // --- Estado Paginación ---
  currentPage: number = 1;
  totalPages: number = 0;
  totalItems: number = 0;
  itemsPerPage: number = 6;

  constructor(
    private grupoService: GrupoService,
    private investigadorService: InvestigadorService
  ) { }

  ngOnInit(): void {
    // Configurar los observables de carga para ng-select
    this.loadInvestigadorNamesObservable();
    this.loadGrupoNamesObservable();
    // Cargar datos para los otros dropdowns (Línea, Tipo, Año) en paralelo
    const dropdownDataLoaded$ = this.loadRemainingDropdownData(); 

    // Esperar a que todos los observables de datos para los selects completen
    const initialDataLoaded$ = forkJoin({
      investigadores: this.investigadorNames$.pipe(filter(names => names && names.length > 0), take(1)),
      grupos: this.grupoNames$.pipe(filter(names => names && names.length > 0), take(1)),
      // Esperar a que la carga de Línea, Tipo, Año (que devuelve void) termine
      dropdowns: dropdownDataLoaded$ 
    });

    initialDataLoaded$.subscribe({
      next: () => {
        console.log('Datos iniciales (investigadores, grupos, líneas, tipos, años) cargados, realizando primera búsqueda.');
        this.buscar(1);
      },
      error: (err) => {
        console.error('Error esperando la carga inicial combinada de datos', err);
      }
    });
  }

  // Carga nombres de investigadores
  loadInvestigadorNamesObservable(): void {
    this.isLoadingInvestigadores = true;
    this.investigadorNames$ = this.investigadorService.getAllInvestigadores().pipe(
      map(data => data.map(inv => `${inv?.nombre ?? ''} ${inv?.apellido ?? ''}`.trim()).filter(name => name).sort()),
      tap(names => {
        console.log('Nombres de investigadores cargados para ng-select:', names.length);
        this.isLoadingInvestigadores = false;
      }),
      catchError(err => {
        console.error('Error al cargar investigadores:', err);
        this.isLoadingInvestigadores = false;
        return of([]);
      }),
      startWith([])
    );
  }

  // Carga nombres de grupos
  loadGrupoNamesObservable(): void {
    this.isLoadingGrupos = true;
    this.grupoNames$ = this.grupoService.getAllGruposSummary().pipe(
      map(data => data.map(grp => grp?.nombre ?? '').filter(name => name).sort()),
      tap(names => {
        console.log('Nombres de grupos cargados para ng-select:', names.length);
        this.isLoadingGrupos = false;
      }),
      catchError(err => {
        console.error('Error al cargar nombres de grupos:', err);
        this.isLoadingGrupos = false;
        return of([]);
      }),
      startWith([])
    );
  }

  // Modificado para cargar Líneas, Tipos y Años en sus propios Observables
  loadRemainingDropdownData(): Observable<void> {
    this.isLoadingLineas = true;
    this.isLoadingTipos = true;
    this.isLoadingAnios = true;

    // Usamos un shareReplay(1) si quisiéramos evitar múltiples llamadas, 
    // pero por ahora hacemos la llamada de nuevo para obtener los datos
    const summary$ = this.grupoService.getAllGruposSummary(); 

    this.lineaNames$ = summary$.pipe(
      map(data => data.map(g => g?.lineaInvestigacion ?? '')
                       .filter((linea, index, self) => linea && self.indexOf(linea) === index)
                       .sort()),
      tap(() => this.isLoadingLineas = false),
      catchError(() => { 
        this.isLoadingLineas = false; 
        return of([]); 
      }),
      startWith([])
    );

    this.tipoNames$ = summary$.pipe(
      map(data => data.map(g => g?.tipoInvestigacion ?? '')
                       .filter((tipo, index, self) => tipo && self.indexOf(tipo) === index)
                       .sort()),
      tap(() => this.isLoadingTipos = false),
      catchError(() => { 
        this.isLoadingTipos = false; 
        return of([]); 
      }),
      startWith([])
    );

    this.anioNames$ = summary$.pipe(
       map(data => (data.map(g => g?.fechaRegistro ? g.fechaRegistro.substring(0, 4) : null)
                       .filter((anio, index, self) => anio && self.indexOf(anio) === index) as string[])
                       .sort((a, b) => parseInt(b) - parseInt(a))), // Ordenar descendente
      tap(() => this.isLoadingAnios = false),
      catchError(() => { 
        this.isLoadingAnios = false; 
        return of([]); 
      }),
      startWith([])
    );
    
    // Devolvemos un observable que completa cuando todos los anteriores han emitido al menos una vez
    // (o han fallado), usando forkJoin solo para saber cuándo terminar la carga inicial.
    return forkJoin([ 
        this.lineaNames$.pipe(take(1)), 
        this.tipoNames$.pipe(take(1)), 
        this.anioNames$.pipe(take(1)) 
    ]).pipe(mapTo(undefined)); 
  }

  // Handler para Investigador
  onInvestigadorSelectChange(): void {
      console.log('Cambio en Docente Investigador (ng-select):', this.docenteInvestigador);
      this.buscar(1);
  }

  // Handler para Grupo
  onGrupoSelectChange(): void {
    console.log('Cambio en Grupo Investigacion (ng-select):', this.grupoInvestigacionFilter);
    this.buscar(1);
  }

  // NUEVO: Handler para Línea
  onLineaSelectChange(): void {
    console.log('Cambio en Línea Investigación (ng-select):', this.lineaInvestigacionFilter);
    this.buscar(1);
  }

  // NUEVO: Handler para Tipo
  onTipoSelectChange(): void {
    console.log('Cambio en Tipo Investigación (ng-select):', this.tipoInvestigacionFilter);
    this.buscar(1);
  }

  // NUEVO: Handler para Año
  onAnioSelectChange(): void {
    console.log('Cambio en Año (ng-select):', this.anioFilter);
    this.buscar(1);
  }

  buscar(page: number = 1): void {
    this.isLoading = true;
    this.searchPerformed = true;
    this.apiResponse = null;

    const filters: GrupoFilters = {
      investigador: this.docenteInvestigador ?? '',
      grupo: this.grupoInvestigacionFilter ?? '',
      lineaInvestigacion: this.lineaInvestigacionFilter ?? '',
      tipoInvestigacion: this.tipoInvestigacionFilter ?? '',
      año: this.anioFilter ?? '',
      page: page
    };

    console.log('Buscando grupos con filtros:', filters);

    this.grupoService.getGruposFiltered(filters).subscribe({
      next: (response) => {
        this.apiResponse = response;
        if (response && response.pagination) {
          this.currentPage = response.pagination.currentPage;
          this.totalPages = response.pagination.totalPages;
          this.totalItems = response.pagination.totalItems;
          this.itemsPerPage = response.pagination.limit;
        } else {
          this.currentPage = 1;
          this.totalPages = 0;
          this.totalItems = 0;
        }
        console.log('Respuesta recibida:', response);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al buscar grupos:', err);
        this.isLoading = false;
        this.currentPage = 1;
        this.totalPages = 0;
        this.totalItems = 0;
      }
    });
  }

  limpiarFiltros(): void {
    this.docenteInvestigador = null;
    this.grupoInvestigacionFilter = null;
    this.lineaInvestigacionFilter = null;
    this.tipoInvestigacionFilter = null;
    this.anioFilter = null;
    this.apiResponse = null;
    this.currentPage = 1;
    this.totalPages = 0;
    this.totalItems = 0;
    this.searchPerformed = false;
    console.log('Filtros limpiados');
    this.buscar(1);
  }

  verTodo(): void {
    this.limpiarFiltros();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.buscar(page);
    }
  }

  previousPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  get canGoPrevious(): boolean {
    return this.currentPage > 1;
  }

  get canGoNext(): boolean {
    return !!this.apiResponse && this.currentPage < this.totalPages;
  }

  get paginationPages(): (number | string)[] {
    if (!this.apiResponse || this.totalPages <= 1) return [];

    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;
    const halfPages = Math.floor(maxPagesToShow / 2);

    if (this.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, this.currentPage - halfPages);
      let endPage = Math.min(this.totalPages, this.currentPage + halfPages);

      if (this.currentPage - 1 <= halfPages) {
        endPage = maxPagesToShow;
        startPage = 1;
      }
      else if (this.totalPages - this.currentPage <= halfPages) {
          startPage = this.totalPages - maxPagesToShow + 1;
          endPage = this.totalPages;
      }

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < this.totalPages) {
        if (endPage < this.totalPages - 1) {
          pages.push('...');
        }
        pages.push(this.totalPages);
      }
    }
    return pages;
  }

  get itemsRange(): string {
    if (!this.apiResponse || this.totalItems === 0) return '';
    const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
    const endItem = Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    return `Mostrando registros del ${startItem} al ${endItem} de un total de ${this.totalItems} registro(s)`;
  }

  getCoordinador(investigadores: InvestigadorDetail[] | undefined | null): InvestigadorDetail | undefined {
    if (!investigadores) {
      return undefined;
    }
    return investigadores.find(inv => inv && inv.rol === 'Coordinador');
  }

  getIntegrantes(investigadores: InvestigadorDetail[] | undefined | null): InvestigadorDetail[] {
    if (!investigadores) {
      return [];
    }
    return investigadores.filter(inv => inv && inv.rol === 'Integrante');
  }

  getResolucionUrl(nombreArchivo: string | undefined | null): string {
    if (!nombreArchivo) return '#';
    return `${environment.apiUrl}/uploads/${nombreArchivo}`;
  }
}
