import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import {  DxDataGridModule, DxDataGridComponent, DxDropDownBoxModule, DxSelectBoxModule } from "devextreme-angular";
import { Prestadores } from '../interfaces/prestadores';
import { Cuentas } from '../interfaces/cuentas';
import { Nits } from '../interfaces/nits';
import { PrestadoresService } from '../services/prestadores.service';
import { NitsService } from '../services/nits.service';
import { CuentasService } from '../services/cuentas.service';

@Component({
  selector: 'app-prestadoreslistdetail',
  standalone: true,
  imports: [CommonModule, SharedModule,DxDataGridModule, DxDropDownBoxModule, DxSelectBoxModule, FormsModule, ReactiveFormsModule],
  templateUrl: './prestadoreslistdetail.component.html',
  styleUrl: './prestadoreslistdetail.component.scss'
})
export default class PrestadoreslistdetailComponent implements OnInit {
  @ViewChild('grid', { static: false }) grid: DxDataGridComponent;
  public prestadoresList:Prestadores[]
  public nitsList:Nits[]
  public cuentasList:Cuentas[]
  frmPrestadores: FormGroup;
  newArea:Prestadores;
  titulo = 'Areas'

  constructor(private prestadoresService:PrestadoresService
    ,private nitsService:NitsService
    ,private cuentasService:CuentasService
    ,private toastr: ToastrService,
     private formBuilder: FormBuilder){

  }

  async ngOnInit(): Promise<void> {
    this.BuildForm();
    this.getAll();
    
  }

  BuildForm() {
    this.frmPrestadores = this.formBuilder.group({
      id_ase: new FormControl(null,[Validators.required, Validators.maxLength(100)]),
      entidad: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
      cuenta: new FormControl(null, [Validators.required, Validators.maxLength(100)])
    })

  }

  async getAll() {
    this.prestadoresList = await this.prestadoresService.getAll()
    this.nitsList = await this.nitsService.getAll()
    this.cuentasList = await this.cuentasService.getAll()
  }

  limpiar() {
    this.frmPrestadores.reset()
    this.getAll()
    document.getElementById('id_ase').focus()
  }


  async insert() {
    try{
      let area = await this.prestadoresService.getOne(this.frmPrestadores.value.id_ase)
      if(area) 
        await this.prestadoresService.Update(this.frmPrestadores.value as Prestadores)
      else
        await this.prestadoresService.Insert(this.frmPrestadores.value as Prestadores)

      this.getAll()
      this.limpiar()
    }catch(e){
      this.toastr.error(e, this.titulo, { timeOut: 3000, progressBar: true });
    }

  }

  confirmarDelete() {
    Swal.fire({
      title: 'Eliminar Registro',
      text: "Desea eliminar el registro seleccionado?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.delete()

      }
    })
  }



  async delete() {
    try{
      await this.prestadoresService.Delete(this.frmPrestadores.value.id_ase)
      this.getAll()
      this.limpiar()
      this.toastr.info('Registro Eliminado!', this.titulo, { timeOut: 3000, progressBar: true });
    }catch(e){
      this.toastr.error(e, this.titulo, { timeOut: 3000, progressBar: true });
    }

  }

  onSelectionChanged(event) {
    const selectedRows = event.selectedRowsData;
    if (selectedRows.length > 0) {
      this.frmPrestadores.patchValue({
        id_ase: selectedRows[0].id_ase,
        entidad: selectedRows[0].entidad,
        cuenta: selectedRows[0].cuenta,
      })
    }
  }

  nitSeleccionado(event: any){
    let result=this.nitsList.find(x=> x.id_ase==event.value)
    
    if(result)
      this.frmPrestadores.patchValue({
        entidad: result.nom_ase,
      })
   
  }

}
