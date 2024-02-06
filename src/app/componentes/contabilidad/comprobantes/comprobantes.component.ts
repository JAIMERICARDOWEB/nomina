import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DxLookupModule, DxDataGridModule, DxDropDownBoxModule, DxSelectBoxModule, DxTextAreaModule } from "devextreme-angular";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-comprobantes',
  standalone: true,
  imports: [CommonModule, SharedModule, DxLookupModule, DxDataGridModule, DxDropDownBoxModule, DxSelectBoxModule, DxTextAreaModule],
  templateUrl: './comprobantes.component.html',
  styleUrls: ['./comprobantes.component.scss']
})
export class ComprobantesComponent {


  supabase = createClient(environment.SUPABASE_URL, environment.SUPABASE_KEY, {
    db: { schema: environment.SUPABASE_SCHEMA }
  })

  titulo = 'Comprobantes Contables'
  DS: any;
  formulario: FormGroup;
  existeReg: boolean = false;

  objeto: any = {
    id: '',
    descripcion: '',
    impresion: 'NC',
    cierre: 'N/A',
    usuario: '5'
  }


  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }


  ngOnInit(): void {
    this.enlazarFormulario();
    this.getAll();
  }


  enlazarFormulario() {
    this.formulario = this.fb.group({
      id: [this.objeto.id, [Validators.required, Validators.maxLength(10)]],
      descripcion: [this.objeto.descripcion, [Validators.required, Validators.maxLength(500)]],
      impresion: [this.objeto.impresion, [Validators.required, Validators.maxLength(10)]],
      cierre: [this.objeto.cierre, [Validators.required, Validators.maxLength(50)]],
      usuario: [this.objeto.usuario, [Validators.required, Validators.maxLength(10)]]
    })
  }


  async getAll() {
    const { data, error } = await this.supabase.rpc("f_busq_comprobantes");
    if (error) {
      console.error('Error al consultar los registros. ' + JSON.stringify(error));
      this.toastr.error('Error al consultar los registros.', this.titulo, { timeOut: 5000, progressBar: true });
    } else {
      console.log(data);
      
      this.DS = data;
    }
  }



  async existeRegistro() {

    this.existeReg = false;

    const { data, error } = await this.supabase.rpc("f_busq_comprobantes_x_id", { vr_id: this.formulario.value.id })
    if (error) {
      console.log('Error al consultar el registro. ' + JSON.stringify(error))
      this.toastr.error('Error al consultar el registro. ' + JSON.stringify(error), this.titulo, { timeOut: 5000, progressBar: true });
    } else {
      if (data.length > 0) {
        this.existeReg = true;
      }
    }

    return this.existeReg;

  }



  async insert() {

    if (await this.existeRegistro()) {

      this.confirmarUpdate();

    } else {

      const { data, error } = await this.supabase.rpc('f_insert_comprobantes',
        {
          vr_id: this.formulario.value.id,
          vr_descripcion: this.formulario.value.descripcion,
          vr_impresion: this.formulario.value.impresion,
          vr_cierre: this.formulario.value.cierre,
          vr_usuario: this.formulario.value.usuario
        }
      );
      if (error) {
        this.toastr.error('Error al insertar el registro. ' + JSON.stringify(error), this.titulo, { timeOut: 5000, progressBar: true });
        console.log("Error al insertar el registro. " + JSON.stringify(error));
        throw error;
      } else {
        this.toastr.success('Registro Guardado!', this.titulo, { timeOut: 3000, progressBar: true });
        this.getAll()
        this.limpiar()
      }

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
        // Swal.fire(
        //   'Registro Eliminado!',
        //   'La cuenta contable ha sido eliminada',
        //   'success'
        // )
      }
    })
  }

  async delete() {
    const { data, error } = await this.supabase.rpc("f_del_comprobantes", { vr_id: this.formulario.value.id })
    if (error) {
      console.log('Error al eliminar el registro. ' + JSON.stringify(error));
      this.toastr.error('Error al eliminar el registro. ' + JSON.stringify(error), this.titulo, { timeOut: 5000, progressBar: true });
      throw error;
    } else {
      this.getAll()
      this.limpiar()
      this.toastr.info('Registro Eliminado!', this.titulo, { timeOut: 3000, progressBar: true });
    }
  }


  limpiar() {
    this.formulario.patchValue({
      id: '',
      descripcion: '',
      impresion: 'NC',
      cierre: 'N/A',
      usuario: '5'
    })
  }


  onSelectionChanged(event) {

    const selectedRows = event.selectedRowsData;
    if (selectedRows.length > 0) {

      this.formulario.patchValue({
        id: selectedRows[0].id,
        descripcion: selectedRows[0].descripcion,
        impresion: selectedRows[0].impresion,
        cierre: selectedRows[0].cierre,
        usuario: selectedRows[0].usuario
      })

    }
  }



  confirmarUpdate() {
    Swal.fire({
      title: 'Actualizar Registro',
      text: "Desea actualizar el registro actual?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualizar!',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        this.update()
        // Swal.fire(
        //   'Registro Actualizado!',
        //   'La cuenta contable ha sido actualizada',
        //   'success'
        // )
      }
    })
  }

  async update() {

    const { data, error } = await this.supabase.rpc("f_update_comprobantes",
      {
        vr_id: this.formulario.value.id,
        vr_descripcion: this.formulario.value.descripcion,
        vr_impresion: this.formulario.value.impresion,
        vr_cierre: this.formulario.value.cierre
      }
    )
    if (error) {
      console.log("Error al actualizar el registro. " + JSON.stringify(error));
      this.toastr.error('Error al actualizar el registro. ' + JSON.stringify(error), this.titulo, { timeOut: 5000, progressBar: true });
      throw error;
    } else {
      this.toastr.success('Registro Actualizado!', this.titulo, { timeOut: 3000, progressBar: true });
      this.getAll()
      this.limpiar()
    }

  }


}
