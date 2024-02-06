import { Component } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DxSelectBoxModule, DxDataGridModule, DxTreeViewComponent } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CRUDService } from 'src/app/servicios/CRUD.service';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionesService } from 'src/app/servicios/configuraciones.service';
import { AsignarCitasService } from './asignarCitas.service';

@Component({
  selector: 'app-asignarcitas',
  standalone: true,
  imports: [CommonModule, SharedModule, DxSelectBoxModule, DxDataGridModule],
  templateUrl: './asignarcitas.component.html',
  styleUrls: ['../../../../../scss/estilosestandares.component.scss']
})
export class AsignarcitasComponent {
  formulario!: FormGroup
  saltarAlertas: boolean = false;
  titulo = 'Asignar Citas'
  objPacientes : any = {
    id_cita1: '',
    idpacien1: '',
    apell11: '',
    apell21: '',
    nom11: '',
    nom21: '',
    telpacien1: '',
    celularwhatsapp1: '',
    cod_contra1: '',
    fechacita1: '',
    fechasolicita1: '',
    tipocon1: '',
    codusua1: '',
    idcausal1: '',
    atendio1: '',
    estado1: '',
    codmed1: '',
    obser1: '',
    fecha_deseada1: '',
    idsede1: '',
    municip1: '',
    edad1: '',
    codmet1: '',
    email1: '',
    idagenda1: '',
  }
  objllenadotabla: any = {
    p_id_pacien: '',
    vr_id_cita: '',
    vr_fechacita: '',
    vr_medico: '',
    vr_estado: '',
    vr_tipo_cita: '',
  }


  mostrarTabla: boolean = false;
  id_paciente : string

  metodoatencion: any []= [
    {id_atencion: "1",  nombre_atencion: "Presencial"},
    {id_atencion: "2",  nombre_atencion: "Telemedica"},
  ]
  fuenteDatos !: any[];

  constructor(
    private forBuilder: FormBuilder, 
    private crudService: CRUDService, 
    private toastr: ToastrService, 
    private config: ConfiguracionesService,
    private asignarCitasService: AsignarCitasService) {

    }

  ngOnInit(): void {
    this.formulario = this.forBuilder.group({
      id_cita1: ["",], //* null si va null guarda si no actualiza 58404 
      idpacien1: ["", [Validators.required, Validators.maxLength(20)]], // * 
      apell11: ["", [Validators.required, Validators.maxLength(20)]], // *
      apell21: ["", [Validators.required, Validators.maxLength(20)]], // *
      nom11: ["", [Validators.required, Validators.maxLength(20)]], // *
      nom21: ["", [Validators.required, Validators.maxLength(20)]], // *
      telpacien1: ["", [Validators.required]], //*
      celularwhatsapp1:["", [Validators.required, Validators.maxLength(10)]],
      cod_contra1: ["", [Validators.required]], //*
      fechacita1: ["", []], //*
      fechasolicita1: ["",], //* Día en que se asigna la cita
      tipocon1: ["", [Validators.required]], //*
      codusua1: ["1"], //* viene del login. por defecto 1
      idcausal1: ["0"], //* codigo interno de causa de cancelacion de citas. fk tcaucan. por defecto 0
      atendio1: ["false"], //* para identificar si el paciente fue atendido con historia clinica. por defecto false
      estado1: ["0"], //* viene de la tabla. estado 0
      codmed1: ["", []], //*
      obser1: ["", []], //*
      fecha_deseada1: ["", [Validators.required]], //*
      idsede1: ["1"], //* viene de la tabla posible 1 o 4
      municip1: ["", [Validators.required]], //* 
      edad1: ["", [Validators.required]], //*
      codmet1: ["", [Validators.required]], //*
      email1: ["", [Validators.maxLength(100)]], //*
      idagenda1: ["274"], //* viene de la tabla 274
    })
    this.Medicos();
    this.CodigoContrato();
    this.tiposdeConsulta();
    this.Consultasplantillas();
    this.ConsultarMunicipios();
    this.cargarDatosEnFormulario();
    this.saltarAlertas = true;
  }

  cargarDatosEnFormulario(){
    let DatosCita = this.asignarCitasService.infoAsignarCitas;
    let DatosCitaFilaMedico = this.asignarCitasService.infoAsignarCitasFila;

    console.log("estos son lo datos de los medicos: ", DatosCitaFilaMedico);
    

    console.log(DatosCita);
    

    var fechaHora = new Date(DatosCita.startDate);

    var startDate = new Date(DatosCita.startDate);
    var formattedDate = startDate.toISOString().split('T')[0];

    console.log(formattedDate);

    console.log("Esta es la fecha y hora: " ,formattedDate);
    

    var year = fechaHora.getFullYear();
    var month = fechaHora.getMonth() + 1; // Los meses en JavaScript se indexan desde 0, por lo que debes sumar 1
    var day = fechaHora.getDate();
    var hours = fechaHora.getHours();
    var minutes = fechaHora.getMinutes();
    var seconds = fechaHora.getSeconds();

    var formattedDateTime = year + "-" + this.padDigits(month, 2) + "-" + this.padDigits(day, 2) + "T" + this.padDigits(hours, 2) + ":" + this.padDigits(minutes, 2) + ":" + this.padDigits(seconds, 2);

    this.formulario.controls['fechacita1'].disable();
    this.formulario.controls['fechacita1'].setValue(formattedDateTime);

    this.formulario.controls['codmed1'].disable();
    this.formulario.controls['codmed1'].setValue(DatosCitaFilaMedico.CodigoMedico);

    // this.formulario.controls['fecha_deseada1'].disable();
    this.formulario.controls['fecha_deseada1'].setValue(formattedDate);

  }

  padDigits(number, digits) {
    return String(number).padStart(digits, "0");
  }

  medicosArray: Array<any>  
  Medicos() {
    this.crudService.llamarProcedimiento("sel_tmedico")
    .subscribe(
      res => {
        console.log("los medicos: ", res);
        this.medicosArray = res
      },
      err => {
        console.log(err);
      }
    )
  }
  contratos: Array<any> = []
  CodigoContrato(){
    this.crudService.llamarProcedimiento("sel_tcontrato_web").subscribe(
      res =>{
        this.contratos = res
        console.log("estos son los contratos", res);
        
      }
    )
  }
  tiposconsulta: Array<any> = []
  tiposdeConsulta(){
    this.crudService.llamarProcedimiento("sel_ttipocon_web").subscribe(
      res => {
        console.log("tipo de consultas",res);
        this.tiposconsulta = res;
      },
      err => {
        console.log(err);
      }
    )
  }
  plantillas: Array<any> = []
  Consultasplantillas(){
    this.crudService.llamarProcedimiento("sel_tplanobscitas_web").subscribe(
      res => {
        console.log("tipo de plantillas",res);
        this.plantillas = res;
      },
      err => {
        console.log(err);
      }
    )
  }
  municipios : Array<any> = []
  ConsultarMunicipios(){
    this.crudService.llamarProcedimiento("sel_tmunicipios").subscribe(
      res => {
        this.municipios = res
        console.log("Estos son los municipios ",res)
      },
      err => console.log(err)
    )
  }
  bus_paciente(){    
    const identificacionValue: string = this.formulario.value.idpacien1.toString()
    if (identificacionValue == "") {
      this.toastr.warning('Por favor ingrese el numero de identificación que desea consultar', this.titulo, { timeOut: 3000, progressBar: true });
    }
    else{
      this.crudService.llamarProcedimientoPorParametro("sel_tpaciente_web", { id1: this.formulario.value.idpacien1}).subscribe(
        res =>{
          console.log("Este es el log del antes de la funcion", res);
          if (res.length === 0) {
            this.toastr.info('El paciente consultado no existe en la base de datos', this.titulo, { timeOut: 3000, progressBar: true });
            this.formulario.reset()
          }
          else{
            res.find((obj: any) => {
              this.toastr.success('Paciente consultado con exito!', this.titulo, { timeOut: 3000, progressBar: true });
              this.saltarAlertas = true;
              this.objPacientes = {
                cod_pacien1: obj.vr_codpacien,
                nom11: obj.vr_nom1,
                nom21: obj.vr_nom2,
                apell11: obj.vr_apell1,
                apell21: obj.vr_apell2,
                id_pacien1: obj.vr_id_pacien,
                fecha_nac1: obj.vr_fecha_nac,
                telpacien1: obj.vr_tel_pacien,
                edad1: this.calcularEdad(obj.vr_fecha_nac),
                municip1: obj.vr_codmunicipio,
                celularwhatsapp1: obj.vr_celularwhatsapp,
                email1: obj.vr_emailpacien || '' // asignar un string vacío si emailpacien es null
              };
              this.formulario.patchValue(this.objPacientes)
              this.id_paciente = this.objPacientes.id_pacien1
              this.MostrarTablaHistorial()
            })
          }
        },
        err => {
          this.toastr.error('Estamos teniendo problemas con el servidor :/', this.titulo, { timeOut: 3000, progressBar: true });
          console.log(err)
        }
      )
    }
  }

  calcularEdad(fechaNacimiento: string) {
    var fechaActual = new Date();
    var fechaNac = new Date(fechaNacimiento);
  
    var edad = fechaActual.getFullYear() - fechaNac.getFullYear();
    var mes = fechaActual.getMonth() - fechaNac.getMonth();
  
    if (mes < 0 || (mes === 0 && fechaActual.getDate() < fechaNac.getDate())) {
      edad--;
    }
  
    return edad;
  }

  MostrarTablaHistorial(){
    this.mostrarTabla = true;
    this.llenarTabla(this.id_paciente);
  }
  Historialtabla : any
  llenarTabla(idpacien1 : string){
    this.crudService.llamarProcedimientoPorParametro("sel_thistorialpaciente_web", { p_id_pacien: idpacien1})
    .subscribe(
      res => {
        console.log("esta es la tabla 1", res);
        res.find((obj: any) => {
          this.objllenadotabla = obj;
          this.objllenadotabla.vr_fechacita = new Date(this.objllenadotabla.vr_fechacita).toLocaleDateString();
          // this.objllenadotabla.vr_fechaini = new Date(this.objllenadotabla.vr_fechaini).toLocaleDateString();
          this.fuenteDatos = res;
        })
        console.log("esta es la tabla 2", res);
        this.Historialtabla = res
      },
      err => {
        console.log(err);
      }
    )
  }

  Guardarformulario(){
    if (this.formulario.valid) {
      this.formulario.controls['fechacita1'].enable();
      this.formulario.controls['codmed1'].enable();
      // this.formulario.controls['fecha_deseada1'].enable();
      let formobj  = this.formulario.value
      formobj.codmet1.toString();
      console.log("Guardado exitoso formulario", formobj);
      this.crudService.llamarProcedimientoPorParametro("guardar_tcitaasig_web", formobj).
      subscribe(
        res => {
          console.log(res);
          this.asignarCitasService.SeAsignoCita.next(true);
          console.log("Guardado exitoso", res);
          this.toastr.success('Citas asignada con exito!', this.titulo, { timeOut: 3000, progressBar: true });
          this.formulario.reset()
          this.formulario.controls['fechacita1'].disable();
          this.formulario.controls['codmed1'].disable();
          // this.formulario.controls['fecha_deseada1'].disable();
        }, 
        err => {
          console.log(err);
        }
      )
    }
    else {
      console.log('Formulario invalido');
    }
    

    // console.log(this.formulario.value);
    
  }
  onValueChanged(event: any) {
   this.formulario.controls['obser1'].setValue(event.value)
  }
  soloNumeros(event: KeyboardEvent, cantMax: number){
    this.config.soloNumeros(event, cantMax)
  }
  soloLetras(event: KeyboardEvent){
    this.config.soloLetras(event)
  }


  // get nom_agen1(): any { return this.formulario.get('nom_agen1'); }

  get idpacien1(): any { return this.formulario.get('idpacien1'); }
  get apell11(): any { return this.formulario.get('apell11'); }
  get apell21(): any { return this.formulario.get('apell21'); }
  get nom11(): any { return this.formulario.get('nom11'); }
  get nom21(): any { return this.formulario.get('nom21'); }
  get telpacien1(): any { return this.formulario.get('telpacien1'); }
  get celularwhatsapp1(): any { return this.formulario.get('celularwhatsapp1'); }
  get cod_contra1(): any { return this.formulario.get('cod_contra1'); }
  get fechacita1(): any { return this.formulario.get('fechacita1'); }
  get fechasolicita1(): any { return this.formulario.get('fechasolicita1'); }
  get tipocon1(): any { return this.formulario.get('tipocon1'); }
  get codusua1(): any { return this.formulario.get('codusua1'); }
  get idcausal1(): any { return this.formulario.get('idcausal1'); }
  get atendio1(): any { return this.formulario.get('atendio1'); }
  get codmed1(): any { return this.formulario.get('codmed1'); }
  get obser1(): any { return this.formulario.get('obser1'); }
  get fecha_deseada1(): any { return this.formulario.get('fecha_deseada1'); }
  get idsede1(): any { return this.formulario.get('idsede1'); }
  get municip1(): any { return this.formulario.get('municip1'); }
  get edad1(): any { return this.formulario.get('edad1'); }
  get codmet1(): any { return this.formulario.get('codmet1'); }
  get email1(): any { return this.formulario.get('email1'); }
  get idagenda1(): any { return this.formulario.get('idagenda1'); }
}
