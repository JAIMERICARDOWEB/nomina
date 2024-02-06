import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, formatNumber } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DxLookupModule, DxDataGridModule, DxDropDownBoxModule, DxSelectBoxModule, DxTextAreaModule, DxDataGridComponent, DxDateBoxModule, DxValidatorModule } from "devextreme-angular";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { createClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-terceros',
  standalone: true,
  imports: [CommonModule, SharedModule, DxLookupModule, DxDataGridModule, DxDropDownBoxModule, DxSelectBoxModule, DxTextAreaModule, DxDateBoxModule, DxValidatorModule, FormsModule, ReactiveFormsModule],
  templateUrl: './terceros.component.html',
  styleUrls: ['./terceros.component.scss']
})
export class TercerosComponent {

  supabase = createClient(environment.SUPABASE_URL, environment.SUPABASE_KEY, {
    db: { schema: environment.SUPABASE_SCHEMA }
  })

  titulo = 'Mantenimiento de Terceros'
  DS: any;
  DS_ciudades: any;
  existeReg: boolean = false;

  objeto: any = {
    id: '',
    cencos: '',
    usuario: '5'
  }

  formulario: FormGroup;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder
  ){
  }

  ngOnInit(): void {
    this.getAll();
    this.enlazarFormulario();
  }


  enlazarFormulario() {
    this.formulario = this.fb.group({
      id: [this.objeto.id, [Validators.required, Validators.maxLength(5)]],
      cencos: [this.objeto.cencos, [Validators.required, Validators.maxLength(500)]],
      usuario: [this.objeto.usuario, [Validators.maxLength(10)]]
    })
    
  }


  async getAll() {
    const { data, error } = await this.supabase.rpc("f_busq_cencos");
    if (error) {
      console.error('Error al consultar los registros. ' + JSON.stringify(error));
      this.toastr.error('Error al consultar los registros.', this.titulo, { timeOut: 5000, progressBar: true });
    } else {
      this.DS = data;
      document.getElementById('id').focus();
    }
  }


async existeRegistro() {

    this.existeReg = false;

    const { data, error } = await this.supabase.rpc("f_busq_cencos_x_id", { vr_id: this.formulario.value.id })
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

      const { data, error } = await this.supabase.rpc('f_insert_cencos',
        {
          vr_id: this.formulario.value.id,
          vr_cencos: this.formulario.value.cencos,
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
  

  limpiar() {
    this.formulario.reset()
    this.getAll()
    document.getElementById('id').focus()
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
    const { data, error } = await this.supabase.rpc("f_del_cencos", { vr_id: this.formulario.value.id })
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

    const { data, error } = await this.supabase.rpc("f_update_cencos",
      {
        vr_id: this.formulario.value.id,
        vr_cencos: this.formulario.value.cencos
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


  onSelectionChanged(event) {

    const selectedRows = event.selectedRowsData;
    if (selectedRows.length > 0) {

      this.formulario.patchValue({
        id: selectedRows[0].id,
        cencos: selectedRows[0].cencos,
        usuario: selectedRows[0].usuario
      })

    }
  }





}
