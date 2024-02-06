import { Component, ViewChild } from '@angular/core';
import { CommonModule, formatNumber } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DxLookupModule, DxDataGridModule, DxDropDownBoxModule, DxSelectBoxModule, DxTextAreaModule, DxDataGridComponent, DxDateBoxModule, DxValidatorModule } from "devextreme-angular";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { createClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import Button from "devextreme/ui/button";



@Component({
  selector: 'app-notacontable',
  standalone: true,
  imports: [CommonModule, SharedModule, DxLookupModule, DxDataGridModule, DxDropDownBoxModule, DxSelectBoxModule, DxTextAreaModule, DxDateBoxModule, DxValidatorModule, FormsModule, ReactiveFormsModule],
  templateUrl: './notacontable.component.html',
  styleUrls: ['./notacontable.component.scss']
})
export class NotacontableComponent {

  @ViewChild('grid', { static: false }) grid: DxDataGridComponent;

  supabase = createClient(environment.SUPABASE_URL, environment.SUPABASE_KEY, {
    db: { schema: environment.SUPABASE_SCHEMA }
  })

  titulo = 'Nota Contable'
  DS: any = [{
    id_ase: '',
    cta: '',
    debito: 0,
    credito: 0,
    ccosto: '',
    descripcion: '',
    item_ref: '',
    tipo_ref: '',
    causacion: '',
    id_formapago: '',
    vr_cheque: '',
  }];

  DS_tipodcto: any;
  DS_comprobantes: any;
  DS_cencos: any;
  data: any;
  formulario: FormGroup;
  diferencia: number = 0;
  diferenciaDebito: any = 0;
  diferenciaCredito:any = 0;

  //Select cuentas
  DS_cuentas: any;
  dropDownOptions: object;


  objeto: any = {
    tipodcto: '',
    comprobante: '',
    numdcto: '',
    fecha: '',
    observaciones: '',
    usuario: '5'
  }


  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder
  ) { this.dropDownOptions = { width: 500 }; }


  ngOnInit(): void { 
    this.calcularDiferencia();
    this.selectTipodcto();
    this.selectComprobantes();
    this.selectCuentas();
    this.selectCencos();
    this.enlazarFormulario();
  }

  calcularDiferencia() {

    if (this.DS.length > 0) {
      
      this.diferenciaDebito = 0;
      this.diferenciaCredito = 0;

      const debitos = this.DS.map(item => item.debito);
      const totalDebito = debitos.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

      const creditos = this.DS.map(item => item.credito);
      const totalcredito = creditos.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

      this.diferencia = totalDebito - totalcredito;
      if (this.diferencia < 0) {
        this.diferenciaDebito = Intl.NumberFormat('en-US').format(Math.abs(totalDebito - totalcredito))
      } else {
        this.diferenciaCredito = Intl.NumberFormat('en-US').format(Math.abs(totalDebito - totalcredito))
      }

    }

  }

  enlazarFormulario() {

    this.formulario = this.fb.group({
      tipodcto: [this.objeto.tipodcto, [Validators.required, Validators.maxLength(5)]],
      comprobante: [this.objeto.comprobante, [Validators.required, Validators.maxLength(5)]],
      numdcto: [this.objeto.numdcto, [Validators.maxLength(20)]],
      fecha: [this.objeto.fecha, [Validators.required]],
      observaciones: [this.objeto.observaciones, [Validators.maxLength(800)]],
      usuario: [this.objeto.usuario, [Validators.required, Validators.maxLength(10)]]
    })
    
    this.formulario.get('numdcto')?.disable();

    this.DS = [];
    
  }


  async selectTipodcto() {
    const { data, error } = await this.supabase.rpc("f_busq_tipodcto_desc", { vr_tipomvto: 'Nota Contable' });
    if (error) {
      console.error('Error al consultar los tipos de documentos. ' + JSON.stringify(error));
      this.toastr.error('Error al consultar los tipos de documentos.', this.titulo, { timeOut: 5000, progressBar: true });
    } else {
      this.DS_tipodcto = data;
    }
  }


  async selectComprobantes() {
    const { data, error } = await this.supabase.rpc("f_busq_comprobantes");
    if (error) {
      console.error('Error al consultar los comprobantes contables. ' + JSON.stringify(error));
      this.toastr.error('Error al consultar los comprobantes contables.', this.titulo, { timeOut: 5000, progressBar: true });
    } else {
      this.DS_comprobantes = data;
    }
  }


  async selectCuentas() {
    const { data, error } = await this.supabase.rpc("f_busq_cuentas_desc");
    if (error) {
      console.error('Error al consultar el catálogo de cuentas. ' + JSON.stringify(error));
      this.toastr.error('Error al consultar el catálogo de cuentas.', this.titulo, { timeOut: 5000, progressBar: true });
    } else {
      this.DS_cuentas = data;
    }
  }


  async selectCencos() {
    const { data, error } = await this.supabase.rpc("f_busq_cencos");
    if (error) {
      console.error('Error al consultar los centros de costo. ' + JSON.stringify(error));
      this.toastr.error('Error al consultar los centros de costo.', this.titulo, { timeOut: 5000, progressBar: true });
    } else {
      this.DS_cencos = data;
    }
  }


  async insert() {

    const datos = this.grid.instance.getDataSource().items();
    // console.log(datos.map(item => item.id_ase));

    const { data, error } = await this.supabase.rpc('f_insert_mvtocontable',
      {
        vr_tipodcto: this.formulario.value.tipodcto,
        vr_comprobante: this.formulario.value.comprobante,
        vr_fecha: this.formulario.value.fecha,
        json_data: datos,
        vr_compcierre: false,
        vr_observaciones: this.formulario.value.observaciones,
        vr_usuario: '5'
      }
    );
    if (error) {
      this.toastr.error('Error al insertar el registro. ' + JSON.stringify(error), this.titulo, { timeOut: 5000, progressBar: true });
      console.log("Error al insertar el registro. " + JSON.stringify(error));
      throw error;
    } else {
      this.toastr.success('Registro Guardado!', this.titulo, { timeOut: 3000, progressBar: true });
      // this.getAll()
      // this.limpiar()
      this.formulario.patchValue({ numdcto: data })
      this.toastr.success(this.formulario.value.numdcto, this.titulo, { timeOut: 3000, progressBar: true });
    }

  }


  limpiar() {
    this.formulario.reset()
    this.toastr.info('Limpiando!', this.titulo, { timeOut: 3000, progressBar: true });
  }




  //EVENTOS DEL GRID

  logEvent(eventName, e) {

    switch (eventName) {

      case 'InitNewRow':
        e.data.debito = 0
        e.data.credito = 0
        break;
        
      case 'RowInserted':
        this.calcularDiferencia()
        this.toastr.info('Enviando registro', this.titulo, { timeOut: 5000, progressBar: true });
        break;

      case 'RowRemoved':
        this.calcularDiferencia()
        break;

      case 'RowUpdated':
        this.calcularDiferencia()
        console.log(this.DS)
        break;
    

      default:
        break;
    }
  }


  onRowRemoving(e) {
    // let res:any = confirm ("Desea eliminar el registro: " + e.data.descripcion, "Atención!");
    // e.cancel = new Promise((resolve, reject) => {
    //   res.done((dialogResult) => {
    //     resolve(!dialogResult)
    //   });
    // })
  }

  onToolbarPreparing(e) {
    let toolbarItems = e.toolbarOptions.items;
    // Modifies an existing item
    toolbarItems.forEach(function (item) {
      if (item.name === "addRowButton") {
        //console.log(item);
        item.showText = "always"; // modify toolbar item to always display text
        //console.log(item.options); // modify widget button options
        item.options.text = "Nuevo Registro";
        item.options.type = "default"
        item.options.icon = "plus";
        item.options.elementAttr = { class: "my-class" }; // adds CSS class to button
      }
    });
  }

  onContentReady(e) {
    let form = e.element;
    let btnSave = form.parentElement.parentElement.querySelector("[aria-label='Save']");
    let btnCancel = form.parentElement.parentElement.querySelector("[aria-label='Cancel']");
    btnCancel.parentNode.insertBefore(btnSave, btnCancel);
    let saveButton = Button.getInstance(btnSave);
    let cancelButton = Button.getInstance(btnCancel);
    saveButton.option("icon", "save",);
    saveButton.option("text", "Guardar")
    saveButton.option("type", "danger");

    cancelButton.option("text", "Cancelar")
    cancelButton.option("icon", "undo");
  }


  customizeNumeric(data) {
    return formatNumber(data.value, 'en-US')
  }


}
