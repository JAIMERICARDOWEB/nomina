import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import {  DxDataGridModule, DxDataGridComponent } from "devextreme-angular";
import { Areas } from '../interfaces/areas';
import { AreasService } from '../services/areas.service';

@Component({
  selector: 'app-areaslistdetail',
  standalone: true,
  imports: [CommonModule, SharedModule,DxDataGridModule, FormsModule, ReactiveFormsModule],
  templateUrl: './areaslistdetail.component.html',
  styleUrl: './areaslistdetail.component.scss'
})
export default class AreaslistdetailComponent implements OnInit{
  @ViewChild('grid', { static: false }) grid: DxDataGridComponent;
  public areasList:Areas[]
  frmAreas: FormGroup;
  newArea:Areas;
  titulo = 'Areas'

  constructor(private areasService:AreasService
    ,private toastr: ToastrService,
     private formBuilder: FormBuilder){

  }

  async ngOnInit(): Promise<void> {
    this.BuildForm();
    this.getAll();
    
  }

  BuildForm() {
    this.frmAreas = this.formBuilder.group({
    id: new FormControl(null,[Validators.required, Validators.maxLength(5)]),
    descripcion: new FormControl(null, [Validators.required, Validators.maxLength(500)])
  })

}

  async getAll() {
    this.areasList = await this.areasService.getAll()
  }

  limpiar() {
    this.frmAreas.reset()
    this.getAll()
    document.getElementById('id').focus()
  }


  async insert() {
    try{
      let area = await this.areasService.getOne(this.frmAreas.value.id)
      if(area) 
        await this.areasService.Update(this.frmAreas.value as Areas)
      else
        await this.areasService.Insert(this.frmAreas.value as Areas)

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
      await this.areasService.Delete(this.frmAreas.value.id)
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
      this.frmAreas.patchValue({
      id: selectedRows[0].id,
      descripcion: selectedRows[0].descripcion,
      })
    }
  }

}
