import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DxLookupModule, DxDataGridModule, DxDropDownBoxModule, DxSelectBoxModule, DxTextAreaModule } from "devextreme-angular";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-cuentas',
  standalone: true,
  imports: [CommonModule, SharedModule, DxLookupModule, DxDataGridModule, DxDropDownBoxModule, DxSelectBoxModule, DxTextAreaModule],
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.scss']
})
export class CuentasComponent implements OnInit {
  

  supabase = createClient(environment.SUPABASE_URL, environment.SUPABASE_KEY, {
    db: { schema: environment.SUPABASE_SCHEMA }
  })

  DS: any;
  formulario: FormGroup;
  existeReg: boolean = false;

  objeto: any = {
    codcta: '',
    descripcion: '',
    ctaaux: false,
    reqcc: false,
    corriente: false,
    afecta: '',
    nat: '',
    porc_base: 0,
    id_clasificacion: '',
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
      codcta: [this.objeto.codcta, [Validators.required, Validators.maxLength(16)]],
      descripcion: [this.objeto.descripcion, [Validators.required, Validators.maxLength(500)]],
      ctaaux: [this.objeto.ctaaux],
      reqcc: [this.objeto.reqcc],
      corriente: [this.objeto.corriente],
      afecta: [this.objeto.afecta, [Validators.required, Validators.maxLength(3)]],
      nat: [this.objeto.nat, [Validators.required, Validators.maxLength(1)]],
      porc_base: [this.objeto.porc_base, [Validators.required, Validators.maxLength(10)]],
      id_clasificacion: [this.objeto.id_clasificacion, [Validators.required, Validators.maxLength(5)]],
      usuario: [this.objeto.usuario, [Validators.required, Validators.maxLength(10)]],
    })
  }


  async getAll() {
    const { data, error } = await this.supabase.rpc("f_busq_cuentas");
    if (error) {
      console.error('Error al consultar los registros. ' + JSON.stringify(error));
      this.toastr.error('Error al consultar los registros.', 'Plan de Cuentas', { timeOut: 5000, progressBar: true });
    } else {
      this.DS = data;
    }
  }



  async existeRegistro() {

    this.existeReg = false;

    const { data, error } = await this.supabase.rpc("f_busq_cuentas_x_cuenta", { vr_codcta: this.formulario.value.codcta })
    if (error) {
      console.log('Error al consultar la cuenta. ' + JSON.stringify(error))
      this.toastr.error('Error al consultar la cuenta. ' + JSON.stringify(error), 'Plan de Cuentas', { timeOut: 5000, progressBar: true });
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

      const { data, error } = await this.supabase.rpc('f_insert_cuentas', 
        {
          vr_codcta: this.formulario.value.codcta,
          vr_descripcion: this.formulario.value.descripcion,
          vr_ctaaux: this.formulario.value.ctaaux,
          vr_reqcc: this.formulario.value.reqcc,
          vr_corriente: this.formulario.value.corriente,
          vr_afecta: this.formulario.value.afecta,
          vr_nat: this.formulario.value.nat,
          vr_porc_base: this.formulario.value.porc_base,
          vr_id_clasificacion: this.formulario.value.id_clasificacion,
          vr_usuario: this.formulario.value.usuario
        }
      );
      if (error) {
        this.toastr.error('Error al insertar el registro. ' + JSON.stringify(error), 'Plan de Cuentas', { timeOut: 5000, progressBar: true });
        console.log("Error al insertar el registro. " + JSON.stringify(error));
        throw error;
      } else {
        this.toastr.success('Registro Guardado!', 'Plan de Cuentas', { timeOut: 3000, progressBar: true });
        this.getAll()
        this.limpiar()
      }

    }

  }



  confirmarDelete() {
    Swal.fire({
      title: 'Eliminar Registro',
      text: "Desea eliminar la cuenta contable seleccionada?",
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
    const { data, error } = await this.supabase.rpc("f_del_cuentas", { vr_codcta: this.formulario.value.codcta })
    if (error) {
      console.log('Error al eliminar el registro. ' + JSON.stringify(error));
      this.toastr.error('Error al eliminar el registro. ' + JSON.stringify(error), 'Plan de Cuentas', { timeOut: 5000, progressBar: true });
      throw error;
    } else {
      this.getAll()
      this.limpiar()
      this.toastr.info('Registro Eliminado!', 'Plan de Cuentas', { timeOut: 3000, progressBar: true });
    }
  }


  limpiar() {
    this.formulario.patchValue({
      codcta: '',
      descripcion: '',
      ctaaux: false,
      reqcc: false,
      corriente: false,
      afecta: '',
      nat: '',
      porc_base: 0,
      id_clasificacion: '',
      usuario: '5'
    })
  }


  onSelectionChanged(event) {

    const selectedRows = event.selectedRowsData;
    if (selectedRows.length > 0) {

      this.formulario.patchValue({
        codcta: selectedRows[0].codcta,
        descripcion: selectedRows[0].descripcion,
        ctaaux: selectedRows[0].ctaaux,
        reqcc: selectedRows[0].reqcc,
        corriente: selectedRows[0].corriente,
        afecta: selectedRows[0].afecta,
        nat: selectedRows[0].nat,
        porc_base: selectedRows[0].porc_base,
        id_clasificacion: selectedRows[0].id_clasificacion,
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

    const { data, error } = await this.supabase.rpc("f_update_cuentas",
      {
        vr_codcta: this.formulario.value.codcta,
        vr_descripcion: this.formulario.value.descripcion,
        vr_ctaaux: this.formulario.value.ctaaux,
        vr_reqcc: this.formulario.value.reqcc,
        vr_corriente: this.formulario.value.corriente,
        vr_afecta: this.formulario.value.afecta,
        vr_nat: this.formulario.value.nat,
        vr_porc_base: this.formulario.value.porc_base,
        vr_id_clasificacion: this.formulario.value.id_clasificacion
      }
    )
    if (error) {
      console.log("Error al actualizar el registro. " + JSON.stringify(error));
      this.toastr.error('Error al actualizar el registro. ' + JSON.stringify(error), 'Plan de Cuentas', { timeOut: 5000, progressBar: true });
      throw error;
    } else {
      this.toastr.success('Registro Actualizado!', 'Plan de Cuentas', { timeOut: 3000, progressBar: true });
      this.getAll()
      this.limpiar()
    }

  }



}