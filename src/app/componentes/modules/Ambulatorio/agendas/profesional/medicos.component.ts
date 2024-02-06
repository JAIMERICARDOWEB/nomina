import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort } from '@angular/material/sort';
import { CRUDService } from '../../../../../servicios/CRUD.service'
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionesService } from 'src/app/servicios/configuraciones.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { DxDataGridModule } from 'devextreme-angular';
import { SharedModule } from 'src/app/theme/shared/shared.module';
// import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-medicos',
  standalone: true,
  imports: [CommonModule, SharedModule, DxDataGridModule],
  templateUrl: './medicos.component.html',
  styleUrls: ['../../../../../scss/estilosestandares.component.scss']
})
export class MedicosComponent implements OnInit {
  nombreBoton: string = "Guardar"
  private Comprobacion: boolean = true;
  nombreSede!: string;
  consultaidenti: string= "tipo"
  confirmarGuardado: boolean = false;
  saltarAlertas: boolean = false;
  mjsConfirmacion!: string;

  objDocumentos: any = {
    codigo1: '',
    id_med1: '',
    nom_med1: '',
    tipo_id_med1: '',
    reg_med1: '',
    lugar_exp_reg1: '',
    dir_med1: '',
    tel_med11: '',
    tel_med21: '',
    est_med1: '',
    cod_espe1: '',
    tipo_trab1: '',
    email_med1: '',
    por_hono1: '',
    clascx1: '',
    multform1: false,
    firma_base641: ''
  };

  nuevoObjDocumentos: any = {
    codigo1: '',
    id_med1: '',
    nom_med1: '',
    tipo_id_med1: '',
    reg_med1: '',
    lugar_exp_reg1: '',
    dir_med1: '',
    tel_med11: '',
    tel_med21: '',
    est_med1: '',
    cod_espe1: '',
    tipo_trab1: '',
    email_med1: '',
    por_hono1: '',
    clascx1: '',
    multform1: false,
    firma_base641: ''
  };

  dataSource!: MatTableDataSource<any>;

  @ViewChild('radioButton1') radioButton1!: ElementRef;
  @ViewChild('radioButton2') radioButton2!: ElementRef;

  events: Array<string> = [];
  fuenteDatos!: any[];
  showFilterRow: boolean = true;
  showHeaderFilter: boolean =  true;
  currentFilter: boolean = true;
  mostrarLista: boolean = true;

  formulario !: FormGroup;
  formBusqueda!: FormGroup;

  constructor( private formBuilder: FormBuilder, private crudService: CRUDService, private toastr: ToastrService, private config: ConfiguracionesService) {  }
  base64textString!: string;


  ngOnInit(): void {
    this.formBusqueda = this.formBuilder.group({
      id_med1: ["", Validators.required],
      tipo_id_med1: ["", Validators.required]
    })
    this.formulario = this.formBuilder.group({
      codigo1: [this.objDocumentos.codigo1],
      id_med1: ["", [Validators.minLength(5), Validators.maxLength(20)]],
      nom_med1: [this.objDocumentos.nom_med1, Validators.required],
      tipo_id_med1: [""],
      reg_med1: [this.objDocumentos.reg_med1, Validators.required],
      lugar_exp_reg1: [this.objDocumentos.lugar_exp_reg1, Validators.required],
      dir_med1: [this.objDocumentos.dir_med1, Validators.required],
      tel_med11: [this.objDocumentos.tel_med11, Validators.required],
      tel_med21: [this.objDocumentos.tel_med21, Validators.required],
      est_med1: [1, Validators.required],
      tipo_trab1: [this.objDocumentos.tipo_trab1, Validators.required],
      email_med1: [this.objDocumentos.email_med1, [Validators.pattern(this.emailPattern)]],
      cod_espe1: [this.objDocumentos.por_hono1, Validators.required],
      por_hono1: [0],
      clascx1: [this.objDocumentos.clascx1, Validators.required],
      multform1: [this.objDocumentos.multform1],
      firma_base641: [this.objDocumentos.firma_base641],
    })
    this.click();
    this.Tipo();
    this.llenarTabla();
    setTimeout(() => {
      // this.saltarAlertas = true;
      this.formulario.controls['est_med1'].setValue("1")
      this.radioButton1.nativeElement.checked = true;
    }, 3000);
  }

  @ViewChild('autofocus') autofocus!: ElementRef;
  ngAfterContentInit(): void {
    setTimeout(() => {
      
      this.autofocus.nativeElement.focus();
      
    }, 1000);
  }

  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  tipo: any
  Tipo(){
    this.crudService.llamarProcedimiento("sel_ttipoid_paciente").
    subscribe(
      res=> {
        this.tipo = res
      },
      err => {
        console.log(err)
      }
    )
  }

  data: any
  click(){
    this.crudService.llamarProcedimiento("sel_especialidad").subscribe(
      res =>{
        this.data = res
      },
      err => {
        console.log(err)
      }
    )
  }

  llenarTabla(){
    this.crudService.llamarProcedimiento("sel_tmedico_all").subscribe(
      res =>{
        console.log("datos para la tabla: ", res);
        
        this.DS = res
      },
      err => {
        console.log(err)
      }
    )
  }
  // codigo1 
	// id_med1 
	// nom_med1 
	// tipo_id_med1 
	// reg_med1 
	// lugar_exp_reg1 
	// dir_med1 
	// tel_med11 
	// tel_med21 
	// est_med1 
	// tipo_trab1 
	// email_med1 
	// cod_espe1 
	// por_hono1 
	// clascx1 
	// firma_base641 
	// multform1 
  DS: any;
  base64String: string = '';
  base64Boolean: boolean = false; 
  titulo = 'Profesionales'

  bus_paciente(){ 
    const identificacionValue: any = this.formBusqueda.value.id_med1
    this.autofocus.nativeElement.blur();
    

    if (identificacionValue == "" || identificacionValue == null || identificacionValue == undefined) {
      this.toastr.warning('Por favor ingrese el numero de identificación que desea consultar', this.titulo, { timeOut: 3000, progressBar: true });
    }
    else{
      this.crudService.llamarProcedimientoPorParametro("sel_tmedico_id_med", {id1: this.formBusqueda.value.id_med1})
      .subscribe(
        res =>{
          console.log(res);
          if (res.length === 0) {
            this.toastr.info('El Profesional consultado no existe en la base de datos',  this.titulo, { timeOut: 3000, progressBar: true });
            this.Comprobacion = true;
            this.nombreBoton = "Guardar";
            this.formulario.reset()
            this.radioButton1.nativeElement.checked = true;
            this.formulario.controls['est_med1'].setValue("1")
          }
          else{
            this.toastr.success('Profesional consultado con exito!',  this.titulo, { timeOut: 3000, progressBar: true });
            this.Comprobacion = false;
            this.nombreBoton = "Actualizar";
            this.saltarAlertas = true;
            res.find(async (obj: any) => {
            this.formBusqueda.controls['tipo_id_med1'].setValue(obj.tipo_id_med1)
            this.formBusqueda.controls['id_med1'].setValue(obj.id_med1)
            // let fileFirma = await this.base64ToImage(obj.firma_base641)
            await this.mostrarfirmaBase64(obj.firma_base641);
            // const fileInput: any = document.getElementById('filePicker');
            // fileInput.files[0] = file;
            this.base64String = obj.firma_base641

            this.nuevoObjDocumentos = {
              
              clascx1: obj.clascx1,
              cod_espe1: obj.cod_espe1,
              codigo1: obj.codigo1,
              dir_med1: obj.dir_med1,
              email_med1: obj.email_med1 || '',
              est_med1: obj.est_med1,
              id_med1: obj.id_med1,
              lugar_exp_reg1: obj.lugar_exp_reg1,
              multform1: obj.multform1,
              nom_espe1: obj.nom_espe1,
              nom_med1: obj.nom_med1,
              por_hono1: obj.por_hono1,
              reg_med1: obj.reg_med1,
              tel_med11: obj.tel_med11,
              tel_med21: obj.tel_med21,
              tipo_id_med1: obj.tipo_id_med1,
              tipo_trab1: obj.tipo_trab1,
              // firma_base641: fileFirma
            }
            console.log("traer por id", this.nuevoObjDocumentos);
            this.formulario.patchValue(this.nuevoObjDocumentos);
            if (this.formulario.value.est_med1 == 1) {
              this.radioButton1.nativeElement.checked = true;
              this.formulario.controls['est_med1'].setValue("1")
            }
            else if(this.formulario.value.est_med1 == 0){
              this.radioButton2.nativeElement.checked = true;
              this.formulario.controls['est_med1'].setValue("0")
            }
            })
          }
        },
        err => {
          this.toastr.error('Estamos teniendo problemas con el servidor :/',  this.titulo, { timeOut: 3000, progressBar: true });
          console.log(err)
        }
      )
    }
  }


  RealizarComprobacion(): void {
    if (this.Comprobacion == false) {
      console.log("listo para actualizar");
      
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
          this.ConfirmarActualizado();
        }
      })
      
    }
    else {
      this.ConfirmarGuardado();
      console.log("quiere guardar");
      
      // console.log(this.formulario.value);
    }
  }


  async ConfirmarGuardado(){
    console.log("1",this.formulario.valid, "2",this.formBusqueda.valid);

    if (this.formulario.valid && this.formBusqueda.valid) {
      this.nuevoObjDocumentos = await this.formulario.value
      this.nuevoObjDocumentos.tipo_id_med1 = await this.formBusqueda.value.tipo_id_med1
      this.nuevoObjDocumentos.id_med1 = await this.formBusqueda.value.id_med1
      this.nuevoObjDocumentos.firma_base641 = await this.base64textString
      
      let objGuardar: any = {}
      objGuardar = this.nuevoObjDocumentos
      await delete objGuardar.codigo1
      // delete this.nuevoObjDocumentos.codigo1
      console.log("Este guardado del formulario", objGuardar);
      if (objGuardar.firma_base641 == undefined || null) {
        objGuardar.firma_base641 = '';
      }
      objGuardar.por_hono1 = 0;
      this.crudService.llamarProcedimientoPorParametro("guardar_tmedico", objGuardar).subscribe(
        res => {
          this.DS = []
          this.llenarTabla();
          console.log("Respuesta del guardado", res);
          this.formulario.reset();
          this.formBusqueda.reset()
          this.saltarAlertas = false;
          this.mostrarfirmaBase64("")
          this.toastr.success('¡Registro guardado éxitosamente!',  this.titulo, { timeOut: 3000, progressBar: true });
          this.crudService.registrarMovimientosDelUsuario("tmedico", 1)
        },
        err => {
          console.log(err)
          this.toastr.error(err,  this.titulo, { timeOut: 3000, progressBar: true });
        }
      )
    }
    else {
      this.toastr.info('Complete los campos que son requeridos',  this.titulo, { timeOut: 3000, progressBar: true });

      this.saltarAlertas = true;
    }
    
  }
  async ConfirmarActualizado(){
    console.log("Este es el actualizado", this.nuevoObjDocumentos);
    if (this.formulario.valid && this.formBusqueda.valid) {
      this.nuevoObjDocumentos = this.formulario.value
      this.nuevoObjDocumentos.tipo_id_med1 = this.formBusqueda.value.tipo_id_med1
      this.nuevoObjDocumentos.id_med1 = this.formBusqueda.value.id_med1

      if (this.base64Boolean) {
        this.nuevoObjDocumentos.firma_base641 = await this.base64textString
        this.base64Boolean = false;
      }
      else{
        this.nuevoObjDocumentos.firma_base641 = await this.base64String
      }

      delete this.nuevoObjDocumentos.nom_espe1
      if (this.nuevoObjDocumentos.firma_base641 == undefined || null) {
        this.nuevoObjDocumentos.firma_base641 = '';
      }
      this.nuevoObjDocumentos.por_hono1 = 0;
      this.crudService.llamarProcedimientoPorParametro('update_tmedico', this.nuevoObjDocumentos).subscribe(
        res => {
          this.DS = []
          this.llenarTabla();
          console.log(res);
          console.log("Valores del formulario", this.nuevoObjDocumentos);
          this.toastr.success('Profesional actualizado con exito!',  this.titulo, { timeOut: 3000, progressBar: true });

          this.Comprobacion = true;
          this.nombreBoton = "Guardar"
          this.formulario.reset();
          this.formBusqueda.reset();
          this.saltarAlertas = false;
          this.radioButton1.nativeElement.checked = true;
          this.formulario.controls['est_med1'].setValue("1");
          this.mostrarfirmaBase64("")

          this.crudService.registrarMovimientosDelUsuario("tmedico", 2)
        },
        err => {
          console.log(err);
          this.toastr.error('Error al actualizar los datos',  this.titulo, { timeOut: 3000, progressBar: true });
        }
      )
    }
    else {
      this.toastr.info('Complete los campos que son requeridos',  this.titulo, { timeOut: 3000, progressBar: true });

      this.saltarAlertas = true;
    }
  }

  base64ToImage(base64Data: string) {
    const contentType = 'image/png'; // puedes cambiar esto según el tipo de imagen que estés convirtiendo
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const byteArrays = [];
  
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
  
    const blob = new Blob(byteArrays, {type: contentType});
    const file = new File([blob], 'image.png', {type: 'image/png'});
  
    // const fileList = new DataTransfer().files;
    // fileList.add(file);
    const fileList = new FileList();
    fileList[0] = file;
    return fileList;
  }
  BotonesOpciones(Boton: number){
    if (Boton == 1) {
      console.log("llega aqui");
      
      this.RealizarComprobacion()
    }
    else if(Boton == 2){
      this.formulario.reset();
      this.formBusqueda.reset();
      this.Comprobacion =  true;
      this.nombreBoton = "Guardar"
      this.radioButton1.nativeElement.checked = true;
      this.formulario.controls['est_med1'].setValue("1")
      this.mostrarfirmaBase64("")
    }
    else if(Boton == 3){
      this.toastr.show('Redireccionando...',  this.titulo, { timeOut: 3000, progressBar: true });
    }
  }

  soloNumeros(event: KeyboardEvent, cantMax: number){
    this.config.soloNumeros(event, cantMax)
  }
  soloLetras(event: KeyboardEvent){
    this.config.soloLetras(event)
  }
  soloLetrasEspacio(event: KeyboardEvent){
    this.config.soloLetrasEspacio(event)
  }
  ocultarMostrarboolean: boolean = true;

  ocultar_mostrar_container_firmas(value: number){
    const bototnMostrarOcultarFirmas: any = document.getElementById("conFirmasMostrarOcultar")
    if (value == 0) {
      if (this.ocultarMostrarboolean) {
        bototnMostrarOcultarFirmas.classList.remove("icon-eye-off")
        bototnMostrarOcultarFirmas.classList.add("icon-eye")
        this.ocultarMostrarboolean = false;
      }else{
        bototnMostrarOcultarFirmas.classList.remove("icon-eye")
        bototnMostrarOcultarFirmas.classList.add("icon-eye-off")
        this.ocultarMostrarboolean = true;
      }
    }else if(value == 1){
      if (this.ocultarMostrarboolean) {
        bototnMostrarOcultarFirmas.classList.remove("icon-eye-off")
        bototnMostrarOcultarFirmas.classList.add("icon-eye")
        this.ocultarMostrarboolean = false;
      }
    }else if(value == 2){
      console.log("y llega aca");
      
      if (this.ocultarMostrarboolean == false) {
        bototnMostrarOcultarFirmas.classList.remove("icon-eye")
        bototnMostrarOcultarFirmas.classList.add("icon-eye-off")
        this.ocultarMostrarboolean = true;
      }
    }
  }

  mostrarfirmaBase64(firma: any){
    var imgElement: any = document.getElementById("img_firma");
    var base64Image = firma;

    this.base64textString = base64Image;
    this.nuevoObjDocumentos.firma_base641 = base64Image;
    this.base64Boolean = true;

    var image = new Image();
    image.onload = function() {
      // Obtener el ancho y la altura del contenedor
      var containerWidth = imgElement.parentNode.offsetWidth;
      var containerHeight = imgElement.parentNode.offsetHeight;

      // Obtener el aspect ratio de la imagen
      var aspectRatio = image.width / image.height;

      // Calcular el nuevo ancho y alto de la imagen
      var newWidth = containerWidth;
      var newHeight = newWidth / aspectRatio;

      // Verificar si la altura supera el contenedor
      if (newHeight > containerHeight) {
        newHeight = containerHeight;
        newWidth = newHeight * aspectRatio;
      }

      // Establecer el tamaño redimensionado en el elemento <img>
      imgElement.style.height = newHeight + "px";
      imgElement.style.width = newWidth + "px";
    };

    // Verificar si base64Image está vacío
    if (base64Image == "" || base64Image == null || base64Image == undefined) {
      imgElement.src = ""; // Eliminar la imagen anterior
      this.ocultar_mostrar_container_firmas(2);
      console.log("La firma viene vacia :v");
      
    } else {
      image.src = "data:image/png;base64," + base64Image;
      imgElement.src = image.src;
      this.ocultar_mostrar_container_firmas(1);
    }
  }

  async onSelectionChanged(event) {

    const selectedRows = event.selectedRowsData;
    if (selectedRows.length > 0) {
      this.Comprobacion = false;
      this.nombreBoton = "Actualizar";
      this.saltarAlertas = true;

      console.log(selectedRows[0]);

      await this.mostrarfirmaBase64(selectedRows[0].firma_base641);


      // this.formulario.patchValue(selectedRows[0])
      this.formBusqueda.patchValue({
        id_med1: selectedRows[0].id_med1, 
        tipo_id_med1: selectedRows[0].tipo_id_med1,
      })
      this.formulario.patchValue({
        codigo1: selectedRows[0].codigo1,
        id_med1: selectedRows[0].id_med1,
        nom_med1: selectedRows[0].nom_med1,
        tipo_id_med1: selectedRows[0].tipo_id_med1,
        reg_med1: selectedRows[0].reg_med1,
        lugar_exp_reg1: selectedRows[0].lugar_exp_reg1,
        dir_med1: selectedRows[0].dir_med1,
        tel_med11: selectedRows[0].tel_med11,
        tel_med21: selectedRows[0].tel_med21,
        est_med1: selectedRows[0].est_med1,
        tipo_trab1: selectedRows[0].tipo_trab1,
        email_med1: selectedRows[0].email_med1,
        cod_espe1: selectedRows[0].cod_espe1,
        por_hono1: selectedRows[0].por_hono1,
        clascx1: selectedRows[0].clascx1,
        multform1: selectedRows[0].multform1,
        // firma_base641: [this.objDocumentos.firma_base641],
      })
      
    }
  }

  handleFileSelect(evt:any){
    var files = evt.target.files;
    var file = files[0];

  if (files && file) {
      var reader = new FileReader();
      reader.onload =this._handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
  }
}
  async _handleReaderLoaded(readerEvt:any) {
   var binaryString = readerEvt.target.result;
      this.base64textString= btoa(binaryString)
      console.log("esta es la firma",this.base64textString);
      this.nuevoObjDocumentos.firma_base641 = this.base64textString;
      this.base64Boolean = true;
      await this.mostrarfirmaBase64(this.base64textString);
      console.log(this.formulario.value);
  }

  get id_med1(): any { return this.formBusqueda.get('id_med1'); }
  get nom_med1(): any { return this.formulario.get('nom_med1'); }
  get tipo_id_med1(): any { return this.formBusqueda.get('tipo_id_med1'); }
  get reg_med1(): any { return this.formulario.get('reg_med1'); }
  get lugar_exp_reg1(): any { return this.formulario.get('lugar_exp_reg1'); }
  get dir_med1(): any { return this.formulario.get('dir_med1'); }
  get tel_med11(): any { return this.formulario.get('tel_med11'); }
  get tel_med21(): any { return this.formulario.get('tel_med21'); }
  get est_med1(): any { return this.formulario.get('est_med1'); }
  get tipo_trab1(): any { return this.formulario.get('tipo_trab1'); }
  get email_med1(): any { return this.formulario.get('email_med1'); }
  get cod_espe1(): any { return this.formulario.get('cod_espe1'); }
  // get por_hono1(): any { return this.formulario.get('por_hono1'); }
  get clascx1(): any { return this.formulario.get('clascx1'); }
  get multform1(): any { return this.formulario.get('multform1'); }
  get nom_espe1(): any { return this.formulario.get('nom_espe1'); }
}


