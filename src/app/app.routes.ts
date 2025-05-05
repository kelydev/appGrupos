import { Routes } from '@angular/router';
import { InvestigadorGetAllComponent } from './page/investigador/getall/getall.component';
import { GrupoGetAllComponent } from './page/grupo/getall/getall.component';
import { InvestigadorInsertComponent } from './page/investigador/insert/insert.component';
import { GrupoInsertComponent } from './page/grupo/insert/insert.component';
import { DetalleGrupoInvestigadorInsertComponent } from './page/detalle_grupo_investigador/insert/insert.component';
import { InvestigadorDetailComponent } from './page/investigador/detail/detail.component';
import { InvestigadorEditComponent } from './page/investigador/edit/edit.component';
import { SearchByInvestigadorComponent } from './page/grupo/search-by-investigador/search-by-investigador.component';

export const routes: Routes = [
  { path: '', redirectTo: '/grupos', pathMatch: 'full' },

  // Rutas Investigador
  { path: 'investigadores', component: InvestigadorGetAllComponent },
  { path: 'investigadores/nuevo', component: InvestigadorInsertComponent },
  { path: 'investigadores/:id', component: InvestigadorDetailComponent },
  { path: 'investigadores/:id/editar', component: InvestigadorEditComponent },

  // Rutas Grupo
  { path: 'grupos', component: GrupoGetAllComponent },
  { path: 'grupos/nuevo', component: GrupoInsertComponent },
  { path: 'grupos/buscar-por-investigador', component: SearchByInvestigadorComponent },

  // Rutas Detalle (Asociación)
  { path: 'detalles/nuevo', component: DetalleGrupoInvestigadorInsertComponent },

  // Ejemplo de Ruta por defecto y Wildcard (ajusta según necesidad)
  // { path: '**', component: NotFoundComponent } // Ruta para páginas no encontradas

  // --- Rutas Protegidas ---
  // --- (resto de rutas) --
];