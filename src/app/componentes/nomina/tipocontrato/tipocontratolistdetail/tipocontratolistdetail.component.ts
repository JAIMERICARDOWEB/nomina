import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DxDataGridComponent, DxDataGridModule } from 'devextreme-angular';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { TipocontratoService } from '../services/tipocontrato.service';
import { ToastrService } from 'ngx-toastr';
import { Tipocontrato } from '../interfaces/tipocontrato';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipocontratolistdetail',
  standalone: true,
  imports: [CommonModule, SharedModule,DxDataGridModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tipocontratolistdetail.component.html',
  styleUrl: './tipocontratolistdetail.component.scss'
})
export default class TipocontratolistdetailComponent implements OnInit {
  @ViewChild('grid', { static: false }) grid: DxDataGridComponent;
  public tipoContratosList:Tipocontrato[]
  frmTipoContratos: FormGroup;
  newTipoContrato:Tipocontrato;
  titulo = 'Areas'

  constructor(private areasService:TipocontratoService
    ,private toastr: ToastrService,
     private formBuilder: FormBuilder){

  }

  async ngOnInit(): Promise<void> {
    this.BuildForm();
    this.getAll();
    
  }

  BuildForm() {
    this.frmTipoContratos = this.formBuilder.group({
      id: new FormControl(null,[Validators.required, Validators.maxLength(5)]),
      descripcion: new FormControl(null, [Validators.required, Validators.maxLength(500)])
    })

  }
  async getAll() {
    this.tipoContratosList = await this.areasService.getAll()
  }

  limpiar() {
    this.frmTipoContratos.reset()
    this.getAll()
    document.getElementById('id').focus()
  }


  async insert() {
    try{
      let area = await this.areasService.getOne(this.frmTipoContratos.value.id)
      if(area) 
        await this.areasService.Update(this.frmTipoContratos.value as Tipocontrato)
      else
        await this.areasService.Insert(this.frmTipoContratos.value as Tipocontrato)

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
      await this.areasService.Delete(this.frmTipoContratos.value.id)
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
      this.frmTipoContratos.patchValue({
      id: selectedRows[0].id,
      descripcion: selectedRows[0].descripcion,
      })
    }
  }
}
