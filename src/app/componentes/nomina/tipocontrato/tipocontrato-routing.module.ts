import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'tipocontrato',
    children: [
      {
        path: 'listdetail',
        loadComponent: () => import('./tipocontratolistdetail/tipocontratolistdetail.component'),
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TipocontratoRoutingModule { }
