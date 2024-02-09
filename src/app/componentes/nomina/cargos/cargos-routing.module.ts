import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'cargos',
    children: [
      {
        path: 'list',
        loadComponent: () => import('./cargoslist/cargoslist.component'),
      },
      {
        path: 'detalle',
        loadComponent: () => import('./cargosdetail/cargosdetail.component'),
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CargosRoutingModule { }
