import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargosRoutingModule } from './cargos/cargos-routing.module';
import { AreasRoutingModule } from './areas/areas-routing.module';
import { PrestadoresRoutingModule } from './prestadores/prestadores-routing.module';
import  { TipocontratoRoutingModule} from './tipocontrato/tipocontrato-routing.module'


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CargosRoutingModule,
    AreasRoutingModule,
    PrestadoresRoutingModule,
    TipocontratoRoutingModule
  ]
})
export class NominaModule { }
