import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DetalleGrupoInvestigadorService } from '../../../api/detalle-grupo-investigador.service';
import { InvestigadorService } from '../../../api/investigador.service';
import { GrupoService } from '../../../api/grupo.service';
import { DetalleGrupoInvestigador } from '../detalle_grupo_investigador.model';
import { InvestigadorSummary } from '../../investigador/investigador.model';
import { GrupoSummary } from '../../grupo/grupo.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatButtonModule} from '@angular/material/button';
import { Observable } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-detalle-grupo-investigador-get-all',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    NgSelectModule
  ],
  templateUrl: './detalle-grupo-investigador-get-all.component.html',
  styleUrls: ['./detalle-grupo-investigador-get-all.component.scss']
})
export class DetalleGrupoInvestigadorGetAllComponent implements OnInit {
  detalles: any[] = [];
  detallesFiltrados: any[] = [];
  investigadores: InvestigadorSummary[] = [];
  grupos: GrupoSummary[] = [];

  // Filtros
  filtroResolucion: string = '';
  filtroInvestigador: string = '';
  filtroGrupo: string = '';
  filtroAnio: string = '';

  // Paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 6;
  totalItems: number = 0;
  totalPaginas: number = 1;

  modalAbierto: boolean = false;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  integrantes: string[] = [];
  allIntegrantes: string[] = [];
  currentIntegrante: string = '';

  fechaSeleccionada: Date | null = null;

  nombreArchivo: string = '';
  archivoSeleccionado: File | null = null;
  nroResolucion: string = '';
  grupoInvestigacion: string = '';
  investigadorCoordinador: string = '';
  lineaInvestigacion: string = '';
  tipoGrupo: string = '';

  lineasInvestigacion: string[] = ['Ciencias Básicas', 'Ingeniería', 'Salud'];
  tiposGrupo: string[] = ['Básico', 'Aplicado', 'Experimental'];

  investigadoresSelect: any[] = [];

  constructor(
    private detalleService: DetalleGrupoInvestigadorService,
    private investigadorService: InvestigadorService,
    private grupoService: GrupoService
  ) {}

  async ngOnInit(): Promise<void> {
    this.cargarDatos();
    // Cargar investigadores para el select y chips
    const resp = await fetch('http://localhost:3000/investigadores/all');
    const data = await resp.json();
    this.investigadoresSelect = data.data.map((inv: any) => ({
      id: inv.idInvestigador,
      nombreCompleto: `${inv.nombre} ${inv.apellido}`
    }));
    this.allIntegrantes = this.investigadoresSelect.map((inv: any) => inv.nombreCompleto);
  }

  cargarDatos(): void {
    this.detalleService.getAllDetalles(this.paginaActual, this.itemsPorPagina).subscribe((resp: any) => {
      this.detalles = resp.data;
      this.totalItems = resp.pagination.totalItems;
      this.totalPaginas = resp.pagination.totalPages;
      this.cargarInvestigadoresYGrupos();
    });
  }

  cargarInvestigadoresYGrupos(): void {
    this.investigadorService.getAllInvestigadores().subscribe((invests) => {
      this.investigadores = invests;
      this.grupoService.getAllGruposSummary().subscribe((grps) => {
        this.grupos = grps;
        this.aplicarFiltros();
      });
    });
  }

  aplicarFiltros(): void {
    let filtrados = this.detalles.map(det => {
      const investigador = this.investigadores.find(i => i.idInvestigador === det.idInvestigador);
      const grupo = this.grupos.find(g => g.id === det.idGrupo);
      return {
        ...det,
        nombreInvestigador: investigador ? `${investigador.nombre} ${investigador.apellido}` : '',
        nombreGrupo: grupo ? grupo.nombre : '',
        anio: det.createdAt ? new Date(det.createdAt).getFullYear() : ''
      };
    });
    if (this.filtroResolucion) {
      filtrados = filtrados.filter(d => d.idGrupoInvestigador.toString().includes(this.filtroResolucion));
    }
    if (this.filtroInvestigador) {
      filtrados = filtrados.filter(d => d.nombreInvestigador.toLowerCase().includes(this.filtroInvestigador.toLowerCase()));
    }
    if (this.filtroGrupo) {
      filtrados = filtrados.filter(d => d.nombreGrupo.toLowerCase().includes(this.filtroGrupo.toLowerCase()));
    }
    if (this.filtroAnio) {
      filtrados = filtrados.filter(d => d.anio.toString().includes(this.filtroAnio));
    }
    this.detallesFiltrados = filtrados;
  }

  buscar(): void {
    this.aplicarFiltros();
    this.paginaActual = 1;
  }

  cambiarPagina(delta: number): void {
    const nuevaPagina = this.paginaActual + delta;
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
      this.cargarDatos();
    }
  }

  agregarDetalle(): void {
    window.location.href = '/detalles/nuevo';
  }

  adjuntarArchivo(detalle: any): void {
    alert('Adjuntar archivo a resolución ID: ' + detalle.idGrupoInvestigador);
  }

  editarDetalle(detalle: any): void {
    alert('Editar resolución ID: ' + detalle.idGrupoInvestigador);
  }

  eliminarDetalle(detalle: any): void {
    if (confirm('¿Seguro que deseas eliminar la resolución ID: ' + detalle.idGrupoInvestigador + '?')) {
      alert('Eliminado (aquí iría la lógica real)');
    }
  }

  abrirModal(): void {
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
  }

  addIntegrante(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.integrantes.includes(value) && this.allIntegrantes.includes(value)) {
      this.integrantes.push(value);
    }
    this.currentIntegrante = '';
  }

  removeIntegrante(integrante: string): void {
    const index = this.integrantes.indexOf(integrante);
    if (index >= 0) {
      this.integrantes.splice(index, 1);
    }
  }

  selectedIntegrante(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;
    if (value && !this.integrantes.includes(value) && this.allIntegrantes.includes(value)) {
      this.integrantes.push(value);
    }
    this.currentIntegrante = '';
  }

  get filteredIntegrantes(): string[] {
    const filterValue = this.currentIntegrante.toLowerCase();
    return this.allIntegrantes.filter(integrante =>
      integrante.toLowerCase().includes(filterValue) && !this.integrantes.includes(integrante)
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.nombreArchivo = file.name;
      this.archivoSeleccionado = file;
    }
  }

  async registrarResolucion() {
    // 1. Registrar el grupo
    const grupoFormData = new FormData();
    grupoFormData.append('nombre', this.grupoInvestigacion);
    grupoFormData.append('numeroResolucion', this.nroResolucion);
    grupoFormData.append('lineaInvestigacion', this.lineaInvestigacion);
    grupoFormData.append('tipoInvestigacion', this.tipoGrupo);
    grupoFormData.append('fechaRegistro', this.fechaSeleccionada ? this.fechaSeleccionada.toISOString().split('T')[0] : '');
    if (this.archivoSeleccionado) {
      grupoFormData.append('archivo', this.archivoSeleccionado);
    }
    try {
      const grupoResp: any = await this.grupoService.createGrupoConArchivo(grupoFormData).toPromise();
      const idGrupo = grupoResp.id || grupoResp.idGrupo || grupoResp.grupo?.idGrupo;
      if (!idGrupo) throw new Error('No se pudo obtener el ID del grupo creado');

      // 2. Registrar detalle para el coordinador con rol 'Coordinador'
      const coordinador = this.investigadoresSelect.find(i => i.nombreCompleto === this.investigadorCoordinador);
      if (!coordinador) throw new Error('No se encontró el investigador coordinador');
      const detalleCoordinador = {
        idGrupo: idGrupo,
        idInvestigador: coordinador.id,
        rol: 'Coordinador'
      };
      await this.detalleService.createDetalle(detalleCoordinador).toPromise();

      // 3. Registrar detalle para cada integrante con rol 'Integrante'
      for (const nombre of this.integrantes) {
        const investigador = this.investigadoresSelect.find(i => i.nombreCompleto === nombre);
        if (!investigador) {
          alert(`No se encontró el investigador: ${nombre}`);
          continue;
        }
        const detalle = {
          idGrupo: idGrupo,
          idInvestigador: investigador.id,
          rol: 'Integrante'
        };
        await this.detalleService.createDetalle(detalle).toPromise();
      }

      alert('¡Resolución registrada con éxito!');
      this.cerrarModal();
      this.cargarDatos();
      // Limpiar campos si es necesario
      this.nroResolucion = '';
      this.grupoInvestigacion = '';
      this.investigadorCoordinador = '';
      this.lineaInvestigacion = '';
      this.tipoGrupo = '';
      this.nombreArchivo = '';
      this.archivoSeleccionado = null;
      this.fechaSeleccionada = null;
      this.integrantes = [];
    } catch (err) {
      alert('Error al registrar la resolución');
      console.error(err);
    }
  }

  // Helper para obtener el id del investigador por nombre completo
  obtenerIdInvestigadorPorNombre(nombre: string): number | null {
    const investigador = this.investigadores.find(i => (`${i.nombre} ${i.apellido}`.trim() === nombre.trim()));
    return investigador ? investigador.idInvestigador : null;
  }
}
