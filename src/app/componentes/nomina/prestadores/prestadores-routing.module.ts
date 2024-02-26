import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [ {
  path: 'prestadores',
  children: [
    {
      path: 'listdetail',
      loadComponent: () => import('./prestadoreslistdetail/prestadoreslistdetail.component'),
    }
  ],
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrestadoresRoutingModule { }
