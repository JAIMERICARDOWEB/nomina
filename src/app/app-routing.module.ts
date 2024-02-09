import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { GuestComponent } from './theme/layout/guest/guest.component';
import { HistoriasComponent } from './componentes/modules/Parametros/historias/historias.component';
import { RenderizadorPrincipalComponent } from './componentes/modules/Ambulatorio/historiasClinicas/Renderizador/principal/renderizador-principal/renderizador-principal.component';
import { IniciohistoriaComponent } from './componentes/modules/Ambulatorio/historiasClinicas/Inicio/iniciohistoria.component';
import { NavhistoriaComponent } from './componentes/modules/Ambulatorio/historiasClinicas/tabs/nav/navhistoria.component';
import { MenuprincipalComponent } from './componentes/modules/Ambulatorio/historiasClinicas/menuPrincipal/menuprincipal.component';
import { PruebaComponent } from './componentes/modules/Ambulatorio/agendas/citasmedicas/prueba/prueba.component';
import { CitasmedicasComponent } from './componentes/modules/Ambulatorio/agendas/citasmedicas/citasmedicas.component';
import { ShedulerComponent } from './componentes/modules/Ambulatorio/agendas/citasmedicas/sheduler/sheduler.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
      },
      // {
      //   path: 'dashboard',
      //   loadComponent: () => import('./demo/dashboard/dashboard.component'),
      // },
      {
        path: 'inicio',
        component: InicioComponent,
      },
      {
        path: 'nomina',
        loadChildren: () =>
          import('./componentes/nomina/cargos/cargos.module').then(
            (m) => m.CargosModule
          ),
      },
      {
        path: 'basic',
        loadChildren: () =>
          import('./demo/ui-elements/ui-basic/ui-basic.module').then(
            (m) => m.UiBasicModule
          ),
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./demo/pages/form-elements/form-elements.module').then(
            (m) => m.FormElementsModule
          ),
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./demo/pages/tables/tables.module').then(
            (m) => m.TablesModule
          ),
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./demo/pages/core-chart/core-chart.module').then(
            (m) => m.CoreChartModule
          ),
      },
      {
        path: 'sample-page',
        loadComponent: () =>
          import('./demo/extra/sample-page/sample-page.component'),
      },
    ],
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./demo/pages/authentication/authentication.module').then(
            (m) => m.AuthenticationModule
          ),
      },
    ],
  },
  {
    path: 'historiaclinica',
    component: MenuprincipalComponent,
  },
  {
    path: 'prueba',
    component: CitasmedicasComponent,
  },
  {
    path: 'prueba2',
    component: ShedulerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
