import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DxSelectBoxModule, DxTabPanelModule, DxDataGridModule } from 'devextreme-angular';

import { SharedModule } from 'src/app/theme/shared/shared.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CRUDService } from 'src/app/servicios/CRUD.service';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionesService } from 'src/app/servicios/configuraciones.service';

@Component({
  selector: 'app-sedes',
  standalone: true,
  imports: [CommonModule, SharedModule, DxDataGridModule, DxSelectBoxModule],
  templateUrl: './sedes.component.html',
  styleUrls: ['../../../../scss/estilosestandares.component.scss']
})
export class SedesComponent {

  formulario : FormGroup

  constructor(private forBuilder: FormBuilder,  private crudService: CRUDService, private toastr: ToastrService, private config: ConfiguracionesService){}

  ngOnInit(): void {
    this.formulario = this.forBuilder.group({
      nombre1: [],
      direccion1: [],
      telefonos1: [],
      vr_cod_ubi1: [],
      cod_presta1: [],
      email1: [],
      nombresede1: []
    })
    this.Centrodecosto()
  }

  centrocosto: any
  Centrodecosto() {
    this.crudService.llamarProcedimiento("sel_thubicacaiongral_web").subscribe(
      res => {
        this.centrocosto = res
        console.log("Estos son los centros de costo",res);
        
      },
      err => {
        console.log(err)
      }
    )
  }
}
