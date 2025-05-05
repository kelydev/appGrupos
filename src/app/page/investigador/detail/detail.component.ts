import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router'; // Importar ActivatedRoute y RouterLink
import { InvestigadorService } from '../../../api/investigador.service';
import { Investigador } from '../investigador.model';
import { CommonModule } from '@angular/common';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-investigador-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink // Añadir RouterLink para enlaces de navegación
  ],
  templateUrl: './detail.component.html'
})
export class InvestigadorDetailComponent implements OnInit {

  investigador$?: Observable<Investigador>;

  constructor(
    private route: ActivatedRoute,
    private investigadorService: InvestigadorService
  ) { }

  ngOnInit(): void {
    this.investigador$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          return this.investigadorService.getInvestigador(id);
        } else {
          // Manejar caso donde el id no existe o es inválido
          // Podrías redirigir o mostrar un error
          return new Observable<Investigador>(); // O retornar EMPTY, o lanzar error
        }
      })
    );
  }
} 