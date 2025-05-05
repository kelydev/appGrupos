import { Component, OnInit } from '@angular/core';
import { InvestigadorService } from '../../../api/investigador.service'; // Corregido: Ruta correcta a la carpeta api
import { Investigador } from '../investigador.model'; // Ajusta la ruta si es necesario
import { CommonModule } from '@angular/common'; // Necesario para *ngFor, async pipe, etc.
import { Observable } from 'rxjs';

@Component({
  selector: 'app-investigador-getall',
  standalone: true,
  imports: [CommonModule], // Importar CommonModule
  templateUrl: './getall.component.html'
})
export class InvestigadorGetAllComponent implements OnInit {

  investigadores$?: Observable<Investigador[]>; // Usaremos el pipe async

  constructor(private investigadorService: InvestigadorService) { }

  ngOnInit(): void {
    this.investigadores$ = this.investigadorService.getInvestigadores();
  }
} 