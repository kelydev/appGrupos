import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { InvestigadorService } from '../../../api/investigador.service';
import { CommonModule } from '@angular/common';
import { switchMap, tap } from 'rxjs/operators';
import { Investigador } from '../investigador.model';

@Component({
  selector: 'app-investigador-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './edit.component.html'
})
export class InvestigadorEditComponent implements OnInit {

  investigadorForm: FormGroup;
  investigadorId: string | number | null = null;
  isLoading = true; // Para mostrar un indicador de carga

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private investigadorService: InvestigadorService
  ) {
    // Inicializar formulario vacío
    this.investigadorForm = this.fb.group({
      nombre: ['', Validators.required],
      correo_electronico: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      tap(() => this.isLoading = true), // Iniciar carga
      switchMap(params => {
        const id = params.get('id');
        this.investigadorId = id;
        if (id) {
          return this.investigadorService.getInvestigador(id);
        } else {
          // Redirigir si no hay ID
          this.router.navigate(['/investigadores']);
          throw new Error('ID de investigador no proporcionado'); // Detiene el flujo
        }
      }),
      tap(investigador => {
        // Rellenar el formulario con los datos obtenidos
        this.investigadorForm.patchValue(investigador);
        this.isLoading = false; // Finalizar carga
      })
    ).subscribe({
      error: err => {
        console.error('Error al cargar investigador para editar:', err);
        this.isLoading = false;
        // Podrías redirigir o mostrar un mensaje de error
        this.router.navigate(['/investigadores']);
      }
    });
  }

  onSubmit(): void {
    if (this.investigadorForm.invalid || !this.investigadorId) {
      this.investigadorForm.markAllAsTouched(); // Mostrar errores si es inválido
      return;
    }

    console.log('Formulario válido, actualizando:', this.investigadorForm.value);
    this.investigadorService.updateInvestigador(this.investigadorId, this.investigadorForm.value).subscribe({
      next: (investigadorActualizado) => {
        console.log('Investigador actualizado:', investigadorActualizado);
        // Redirigir a la vista de detalle después de actualizar
        this.router.navigate(['/investigadores', this.investigadorId]);
      },
      error: (error) => {
        console.error('Error al actualizar investigador:', error);
        // Mostrar mensaje de error al usuario
      }
    });
  }

  // Helpers para validación
  get nombre() { return this.investigadorForm.get('nombre'); }
  get correo_electronico() { return this.investigadorForm.get('correo_electronico'); }
} 