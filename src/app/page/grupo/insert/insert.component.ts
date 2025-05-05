import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GrupoService } from '../../../api/grupo.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grupo-insert',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './insert.component.html'
})
export class GrupoInsertComponent implements OnInit {

  grupoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private grupoService: GrupoService,
    private router: Router
  ) {
    this.grupoForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
      // imagen: [null] // Dejamos la imagen fuera por ahora
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.grupoForm.valid) {
      console.log('Formulario válido:', this.grupoForm.value);
      // Nota: Aún no enviamos la imagen
      this.grupoService.createGrupo(this.grupoForm.value).subscribe({
        next: (nuevoGrupo) => {
          console.log('Grupo creado:', nuevoGrupo);
          // this.router.navigate(['/grupos']);
          this.grupoForm.reset();
        },
        error: (error) => {
          console.error('Error al crear grupo:', error);
        }
      });
    } else {
      console.log('Formulario inválido');
      this.grupoForm.markAllAsTouched();
    }
  }

  get nombre() { return this.grupoForm.get('nombre'); }
  get descripcion() { return this.grupoForm.get('descripcion'); }
} 