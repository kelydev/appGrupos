import { Component, OnInit, inject } from '@angular/core';
import { InvestigadorService } from '../../../api/investigador.service'; // Importar solo el servicio
import { CommonModule } from '@angular/common'; // Necesario para *ngFor, async pipe, etc.
import { Observable, of } from 'rxjs'; // Importar Observable y of

// *** Interfaz temporal para la vista de lista ***
interface InvestigadorConRol {
  idInvestigador: number;
  nombreCompleto: string;
  rol: string; 
}

@Component({
  selector: 'app-investigador-getall',
  standalone: true,
  imports: [CommonModule], // Añadir CommonModule a imports
  templateUrl: './getall.component.html',
  styleUrls: ['./getall.component.scss'] // Corregido a styleUrls
})
export class InvestigadorGetAllComponent implements OnInit {

  private investigadorService = inject(InvestigadorService);
  
  // Usar la interfaz temporal
  investigadores$: Observable<InvestigadorConRol[]> = of([]); // Inicializar con un array vacío
  
  // Variables para paginación (ejemplo básico)
  currentPage = 1;
  itemsPerPage = 10; // O el número que uses
  totalItems = 0; // Necesitarás obtener esto de la API

  constructor() { }

  ngOnInit(): void {
    this.cargarInvestigadores();
  }

  cargarInvestigadores(): void {
    // TODO: Llamar al servicio real y mapear la respuesta a InvestigadorConRol
    // this.investigadores$ = this.investigadorService.getAllInvestigadores(this.currentPage, this.itemsPerPage).pipe(
    //   map(response => {
    //     this.totalItems = response.pagination.totalItems;
    //     return response.data.map(inv => ({ 
    //        idInvestigador: inv.idInvestigador,
    //        nombreCompleto: `${inv.nombre} ${inv.apellido}`,
    //        rol: 'ROL_DESCONOCIDO' // <-- Necesitas obtener el rol de alguna parte
    //      }));
    //   })
    // );
    console.log('Cargando investigadores...');
    this.investigadores$ = of([
      { idInvestigador: 1, nombreCompleto: 'Rosmery Meliza Ramos Peralta', rol: 'Coordinador/Integrante' },
      { idInvestigador: 2, nombreCompleto: 'Juan Pérez', rol: 'Integrante' },
      { idInvestigador: 3, nombreCompleto: 'Ana García', rol: 'Coordinador' },
    ]);
    this.totalItems = 3; // Ejemplo
  }

  // --- Métodos de Acción ---
  verDetalles(id: number): void {
    console.log('Ver detalles del investigador:', id);
    // Implementar navegación o modal
  }

  editarInvestigador(id: number): void {
    console.log('Editar investigador:', id);
    // Implementar navegación a formulario de edición
  }

  eliminarInvestigador(id: number): void {
    console.log('Eliminar investigador:', id);
    // Implementar confirmación y llamada al servicio de eliminación
  }

  // --- Métodos de Paginación ---
  canGoPrevious(): boolean {
    return this.currentPage > 1;
  }

  previousPage(): void {
    if (this.canGoPrevious()) {
      this.currentPage--;
      this.cargarInvestigadores();
    }
  }

  canGoNext(): boolean {
    // Calcular el número total de páginas
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    return this.currentPage < totalPages;
  }

  nextPage(): void {
    if (this.canGoNext()) {
      this.currentPage++;
      this.cargarInvestigadores();
    }
  }
} 