import { Component, OnInit } from '@angular/core';
import { GrupoService } from '../../../api/grupo.service'; // Ajusta la ruta si es necesario
import { Grupo } from '../grupo.model'; // Ajusta la ruta si es necesario
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-grupo-getall',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './getall.component.html'
})
export class GrupoGetAllComponent implements OnInit {

  grupos$?: Observable<Grupo[]>;

  constructor(private grupoService: GrupoService) { }

  ngOnInit(): void {
    this.grupos$ = this.grupoService.getGrupos(); // Llama al método getGrupos
  }
} 