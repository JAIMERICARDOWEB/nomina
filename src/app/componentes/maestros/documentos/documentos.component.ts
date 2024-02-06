import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DxLookupModule, DxDataGridModule, DxDropDownBoxModule, DxSelectBoxModule, DxTextAreaModule, DxDateBoxModule, DxValidatorModule, DxTextBoxModule } from "devextreme-angular";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionesService } from 'src/app/servicios/configuraciones.service';


@Component({
  selector: 'app-documentos',
  standalone: true,
  imports: [CommonModule, SharedModule, DxLookupModule, DxDataGridModule, DxDropDownBoxModule, DxSelectBoxModule, DxTextAreaModule, DxDateBoxModule, DxValidatorModule, DxTextBoxModule],
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent {

  supabase = createClient(environment.SUPABASE_URL, environment.SUPABASE_KEY, {
    db: { schema: environment.SUPABASE_SCHEMA }
  })

  titulo = 'Definición de Documentos'
  DS: any;
  formulario: FormGroup;
  existeReg: boolean = false;
  now: Date = new Date();


  objeto: any = {
    tipodcto: '',
    descripcion: '',
    id_tipomvto: '',
    afecinv: false,
    afeccxcxp: false,
    afecta_cont: false,
    modoconsec: '',
    consec: '',
    conseci: '',
    consecf: '',
    alerta: 0,
    fecharesol: this.now,
    no_resolucion: 0,
    formaimp: '',
    prefijo: '',
    clave_tec_fe: '',
    definicion: '',
    usuario: '5'    
  }

  rules: any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private config: ConfiguracionesService
  )
  {
  }


  ngOnInit(): void {
    this.enlazarFormulario();
    this.getAll();
  }


  enlazarFormulario() {
    this.formulario = this.fb.group({
      tipodcto: [this.objeto.tipodcto, [Validators.required, Validators.maxLength(5)]],
      descripcion: [this.objeto.descripcion, [Validators.required, Validators.maxLength(500)]],
      id_tipomvto: [this.objeto.id_tipomvto, [Validators.required, Validators.maxLength(30)]],
      afecinv: [this.objeto.afecinv, [Validators.required]],
      afeccxcxp: [this.objeto.afeccxcxp, [Validators.required]],
      afecta_cont: [this.objeto.afecta_cont, [Validators.required]],
      modoconsec: [this.objeto.modoconsec, [Validators.required, Validators.maxLength(10)]],
      consec: [this.objeto.consec, [Validators.required, Validators.maxLength(20)]],
      conseci: [this.objeto.conseci, [Validators.required, Validators.maxLength(20)]],
      consecf: [this.objeto.consecf, [Validators.required, Validators.maxLength(20)]],
      alerta: [this.objeto.alerta, [Validators.maxLength(20)]],
      fecharesol: [this.objeto.fecharesol, [Validators.required]],
      no_resolucion: [this.objeto.no_resolucion, [Validators.required, Validators.maxLength(20)]],
      formaimp: [this.objeto.formaimp, [Validators.maxLength(20)]],
      prefijo: [this.objeto.prefijo, [Validators.maxLength(20)]],
      clave_tec_fe: [this.objeto.clave_tec_fe, [Validators.maxLength(100)]],
      definicion: [this.objeto.definicion, [Validators.maxLength(800)]],      
      usuario: [this.objeto.usuario, [Validators.required, Validators.maxLength(10)]]
    })
  }


  async getAll() {
    const { data, error } = await this.supabase.rpc("f_busq_tipodcto");
    if (error) {
      console.error('Error al consultar los registros. ' + JSON.stringify(error));
      this.toastr.error('Error al consultar los registros.', this.titulo, { timeOut: 5000, progressBar: true });
    } else {
      this.DS = data;
    }
  }


  async existeRegistro() {

    this.existeReg = false;

    const { data, error } = await this.supabase.rpc("f_busq_tipodcto_x_id", { vr_tipodcto: this.formulario.value.tipodcto })
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

      const { data, error } = await this.supabase.rpc('f_insert_tipodcto',
        {
          vr_tipodcto: this.formulario.value.tipodcto,
          vr_descripcion: this.formulario.value.descripcion,
          vr_id_tipomvto: this.formulario.value.id_tipomvto,
          vr_afecinv: this.formulario.value.afecinv,
          vr_afeccxcxp: this.formulario.value.afeccxcxp,
          vr_afecta_cont: this.formulario.value.afecta_cont,
          vr_modoconsec: this.formulario.value.modoconsec,
          vr_consec: this.formulario.value.consec,
          vr_conseci: this.formulario.value.conseci,
          vr_consecf: this.formulario.value.consecf,
          vr_alerta: this.formulario.value.alerta,
          vr_fecharesol: this.formulario.value.fecharesol,
          vr_no_resolucion: this.formulario.value.no_resolucion,
          vr_formaimp: this.formulario.value.formaimp,
          vr_prefijo: this.formulario.value.prefijo,
          vr_clave_tec_fe: this.formulario.value.clave_tec_fe,
          vr_definicion: this.formulario.value.definicion,
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
    const { data, error } = await this.supabase.rpc("f_del_tipodcto", { vr_tipodcto: this.formulario.value.tipodcto })
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
      tipodcto: '',
      descripcion: '',
      id_tipomvto: '',
      afecinv: false,
      afeccxcxp: false,
      afecta_cont: false,
      modoconsec: '',
      consec: 0,
      conseci: 0,
      consecf: 0,
      alerta: 0,
      fecharesol: this.now,
      no_resolucion: 0,
      formaimp: '',
      prefijo: '',
      clave_tec_fe: '',
      definicion: '',
      usuario: '5'
    })
  }


  onSelectionChanged(event) {

    const selectedRows = event.selectedRowsData;
    if (selectedRows.length > 0) {

      this.formulario.patchValue({
        tipodcto: selectedRows[0].tipodcto,
        descripcion: selectedRows[0].descripcion,
        id_tipomvto: selectedRows[0].id_tipomvto,
        afecinv: selectedRows[0].afecinv,
        afeccxcxp: selectedRows[0].afeccxcxp,
        afecta_cont: selectedRows[0].afecta_cont,
        modoconsec: selectedRows[0].modoconsec,
        consec: selectedRows[0].consec,
        conseci: selectedRows[0].conseci,
        consecf: selectedRows[0].consecf,
        alerta: selectedRows[0].alerta,
        fecharesol: selectedRows[0].fecharesol,
        no_resolucion: selectedRows[0].no_resolucion,
        formaimp: selectedRows[0].formaimp,
        prefijo: selectedRows[0].prefijo,
        clave_tec_fe: selectedRows[0].clave_tec_fe,
        definicion: selectedRows[0].definicion,
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

    const { data, error } = await this.supabase.rpc("f_update_tipodcto",
      {
        vr_tipodcto: this.formulario.value.tipodcto,
        vr_descripcion: this.formulario.value.descripcion,
        vr_id_tipomvto: this.formulario.value.id_tipomvto,
        vr_afecinv: this.formulario.value.afecinv,
        vr_afeccxcxp: this.formulario.value.afeccxcxp,
        vr_afecta_cont: this.formulario.value.afecta_cont,
        vr_modoconsec: this.formulario.value.modoconsec,
        vr_consec: this.formulario.value.consec,
        vr_conseci: this.formulario.value.conseci,
        vr_consecf: this.formulario.value.consecf,
        vr_alerta: this.formulario.value.alerta,
        vr_fecharesol: this.formulario.value.fecharesol,
        vr_no_resolucion: this.formulario.value.no_resolucion,
        vr_formaimp: this.formulario.value.formaimp,
        vr_prefijo: this.formulario.value.prefijo,
        vr_clave_tec_fe: this.formulario.value.clave_tec_fe,
        vr_definicion: this.formulario.value.definicion
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


  soloNumeros(event: KeyboardEvent, cantMax: number){
    this.config.soloNumeros(event, cantMax)
  }

  


}
