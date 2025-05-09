import { Routes, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { InvestigadorGetAllComponent } from './page/investigador/getall/getall.component';
import { GrupoGetAllComponent } from './page/grupo/getall/getall.component';
import { InvestigadorInsertComponent } from './page/investigador/insert/insert.component';
import { GrupoInsertComponent } from './page/grupo/insert/insert.component';
import { DetalleGrupoInvestigadorInsertComponent } from './page/detalle_grupo_investigador/insert/insert.component';
import { InvestigadorDetailComponent } from './page/investigador/detail/detail.component';
import { InvestigadorEditComponent } from './page/investigador/edit/edit.component';
import { SearchByInvestigadorComponent } from './page/grupo/search-by-investigador/search-by-investigador.component';
import { UserLoginComponent } from './page/user/login/user-login.component';
import { HomeComponent } from './page/home/home.component';
import { DetalleGrupoInvestigadorGetAllComponent } from './page/detalle_grupo_investigador/getall/detalle-grupo-investigador-get-all.component';
import { UserService } from './api/user.service';

// Guard de autenticación
export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);
  if (userService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};

export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'login', component: UserLoginComponent },

  // Rutas Investigador
  { path: 'investigadores', component: InvestigadorGetAllComponent, canActivate: [authGuard] },
  { path: 'investigadores/nuevo', component: InvestigadorInsertComponent, canActivate: [authGuard] },
  { path: 'investigadores/:id', component: InvestigadorDetailComponent, canActivate: [authGuard] },
  { path: 'investigadores/:id/editar', component: InvestigadorEditComponent, canActivate: [authGuard] },

  // Rutas Grupo
  { path: 'grupos', component: GrupoGetAllComponent, canActivate: [authGuard] },
  { path: 'grupos/nuevo', component: DetalleGrupoInvestigadorInsertComponent, canActivate: [authGuard] },
  { path: 'gruposInvestigacion', component: SearchByInvestigadorComponent },

  // Rutas Detalle (Asociación)
  { path: 'detalles/nuevo', component: DetalleGrupoInvestigadorInsertComponent, canActivate: [authGuard] },
  { path: 'detalles', component: DetalleGrupoInvestigadorGetAllComponent, canActivate: [authGuard] },

  // Ejemplo de Ruta por defecto y Wildcard (ajusta según necesidad)
  // { path: '**', component: NotFoundComponent } // Ruta para páginas no encontradas

  // --- Rutas Protegidas ---
  // --- (resto de rutas) --
];