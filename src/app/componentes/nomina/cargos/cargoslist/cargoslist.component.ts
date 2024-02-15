import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import {  DxDataGridModule, DxDataGridComponent } from "devextreme-angular";
import { CargosService } from '../services/cargos.service';
import { cargos } from '../interfaces/cargos';


@Component({
  selector: 'app-cargoslist',
  standalone: true,
  imports: [CommonModule, SharedModule,DxDataGridModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cargoslist.component.html',
  styleUrl: './cargoslist.component.scss'
})
export default class CargoslistComponent implements OnInit {

  @ViewChild('grid', { static: false }) grid: DxDataGridComponent;

  public cargosList:cargos[]
  frmCargos: FormGroup;
  newCargo:cargos;
  titulo = 'Cargos'

  async ngOnInit(): Promise<void> {
    this.loadForm();
    this.getAll();
    
  }
  
  constructor(private cagosservice:CargosService
            ,private toastr: ToastrService,
             private formBuilder: FormBuilder){

  }

  loadForm() {
    this.frmCargos = this.formBuilder.group({
      id: new FormControl(null,[Validators.required, Validators.maxLength(5)]),
      descripcion: new FormControl(null, [Validators.required, Validators.maxLength(500)])
      
    })
    
  }

  async getAll() {
    let datos = await this.cagosservice.getAll()
    console.log(datos)
    this.cargosList=datos
  }

  limpiar() {
    this.frmCargos.reset()
    this.getAll()
    document.getElementById('id').focus()
  }

  
  async insert() {
    try{
      let cargo = await this.cagosservice.getOne(this.frmCargos.value.id)
      if(cargo) 
        await this.cagosservice.Update(this.frmCargos.value as cargos)
      else
        await this.cagosservice.Insert(this.frmCargos.value as cargos)

      
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
      await this.cagosservice.Delete(this.frmCargos.value.id)
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

      this.frmCargos.patchValue({
        id: selectedRows[0].id,
        descripcion: selectedRows[0].descripcion,
       
      })

    }
  }


}

