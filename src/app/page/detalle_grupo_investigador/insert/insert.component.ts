import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

// Importar modelos y servicios necesarios
import { DetalleGrupoInvestigadorService } from '../../../api/detalle-grupo-investigador.service';
import { InvestigadorService } from '../../../api/investigador.service';
import { GrupoService } from '../../../api/grupo.service';
import { Investigador } from '../../investigador/investigador.model';
import { Grupo } from '../../grupo/grupo.model';

@Component({
  selector: 'app-detalle-grupo-investigador-insert',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './insert.component.html'
})
export class DetalleGrupoInvestigadorInsertComponent implements OnInit {

  detalleForm: FormGroup;
  investigadores$?: Observable<Investigador[]>;
  grupos$?: Observable<Grupo[]>;

  constructor(
    private fb: FormBuilder,
    private detalleService: DetalleGrupoInvestigadorService,
    private investigadorService: InvestigadorService,
    private grupoService: GrupoService,
    private router: Router
  ) {
    this.detalleForm = this.fb.group({
      investigador_id: ['', Validators.required],
      grupo_id: ['', Validators.required],
      fecha_vinculacion: [this.obtenerFechaActualISO()], // Valor por defecto
      rol: [''] // Campo opcional
    });
  }

  ngOnInit(): void {
    // Cargar listas para los <select>
    this.investigadores$ = this.investigadorService.getInvestigadores();
    this.grupos$ = this.grupoService.getGrupos();
  }

  onSubmit(): void {
    if (this.detalleForm.valid) {
      console.log('Formulario válido:', this.detalleForm.value);
      this.detalleService.createDetalle(this.detalleForm.value).subscribe({
        next: (nuevoDetalle) => {
          console.log('Detalle creado:', nuevoDetalle);
          // Podrías redirigir a la página del grupo o investigador
          // this.router.navigate(['/grupos', this.detalleForm.value.grupo_id]);
          this.detalleForm.reset({
            fecha_vinculacion: this.obtenerFechaActualISO(), // Restablecer fecha por defecto
            rol: ''
          });
        },
        error: (error) => {
          console.error('Error al crear detalle:', error);
        }
      });
    } else {
      console.log('Formulario inválido');
      this.detalleForm.markAllAsTouched();
    }
  }

  // Helper para obtener fecha actual en formato YYYY-MM-DD
  private obtenerFechaActualISO(): string {
    const hoy = new Date();
    return hoy.toISOString().split('T')[0];
  }

  // Getters para validación en template
  get investigador_id() { return this.detalleForm.get('investigador_id'); }
  get grupo_id() { return this.detalleForm.get('grupo_id'); }
  get fecha_vinculacion() { return this.detalleForm.get('fecha_vinculacion'); }
  get rol() { return this.detalleForm.get('rol'); }
} 