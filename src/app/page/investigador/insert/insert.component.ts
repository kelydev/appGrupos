import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InvestigadorService } from '../../../api/investigador.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-investigador-insert',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './insert.component.html'
})
export class InvestigadorInsertComponent implements OnInit {

  investigadorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private investigadorService: InvestigadorService,
    private router: Router
  ) {
    this.investigadorForm = this.fb.group({
      nombre: ['', Validators.required],
      correo_electronico: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.investigadorForm.valid) {
      console.log('Formulario válido:', this.investigadorForm.value);
      this.investigadorService.createInvestigador(this.investigadorForm.value).subscribe({
        next: (nuevoInvestigador) => {
          console.log('Investigador creado:', nuevoInvestigador);
          this.investigadorForm.reset();
        },
        error: (error) => {
          console.error('Error al crear investigador:', error);
        }
      });
    } else {
      console.log('Formulario inválido');
      this.investigadorForm.markAllAsTouched();
    }
  }

  get nombre() { return this.investigadorForm.get('nombre'); }
  get correo_electronico() { return this.investigadorForm.get('correo_electronico'); }
} 