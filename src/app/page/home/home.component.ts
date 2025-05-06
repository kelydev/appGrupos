import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Para routerLink
import { CommonModule } from '@angular/common'; // Para directivas comunes

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

} 