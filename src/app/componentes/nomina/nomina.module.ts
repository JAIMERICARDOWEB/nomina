import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargosRoutingModule } from './cargos/cargos-routing.module';
import { AreasRoutingModule } from './areas/areas-routing.module';
import { PrestadoresRoutingModule } from './prestadores/prestadores-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CargosRoutingModule,
    AreasRoutingModule,
    PrestadoresRoutingModule
  ]
})
export class NominaModule { }
