import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CRUDService } from 'src/app/servicios/CRUD.service';
import { CommonModule } from '@angular/common';
import { DxDataGridModule } from 'devextreme-angular';
import { SharedModule } from 'src/app/theme/shared/shared.module';
// import notify from 'devextreme/ui/notify';
@Component({
  selector: 'app-cancelacion',
  standalone: true,
  imports: [CommonModule, SharedModule, DxDataGridModule],
  templateUrl: './cancelacion.component.html',
  styleUrls: ['../../../../../scss/estilosestandares.component.scss']
})
export class CancelacionComponent implements OnInit {

  saltarAlertas: boolean = false;
  titulo = 'Causa de cancelación'

  objeDocumentos: any = {
    descripcion1: ''
  }

  formulario !: FormGroup;

  constructor(private crudService: CRUDService, private forBuilder: FormBuilder, private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.formulario = this.forBuilder.group({
      descripcion1 : [this.objeDocumentos.descripcion1, Validators.required]
    })
  }

  BotonesOpciones(){
    this.formulario.reset()
  }

  ConfirmarGuardado(){
    if (this.formulario.valid) {
      this.crudService.llamarProcedimientoPorParametro("guardar_tcaucan_web", this.formulario.value)
    .subscribe(
      res => {
        console.log("guardado",res);
        this.toastr.success('Registro Guardado!', this.titulo, { timeOut: 3000, progressBar: true });
        this.formulario.reset();
        this.saltarAlertas = false;
        this.crudService.registrarMovimientosDelUsuario("tcaucan", 1)
      },
      err => {
        console.log(err)
        this.toastr.error('Estamos teniendo problemas con el servidor :/', this.titulo, { timeOut: 3000, progressBar: true });
      }
    )
    }
    else {
      this.toastr.error("Complete los campos que son requeridos", this.titulo, { timeOut: 3000, progressBar: true })
    }
    
  }

  get descripcion1(): any { return this.formulario.get('descripcion1'); }


}