import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { CRUDService } from 'src/app/servicios/CRUD.service';
import { ConfiguracionesService } from 'src/app/servicios/configuraciones.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DxSelectBoxModule, DxDateBoxModule } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-pacientes',
  standalone: true,
  imports: [CommonModule, SharedModule, DxSelectBoxModule, DxDateBoxModule],
  templateUrl: './pacientes.component.html',
  styleUrls: ['../../../../../scss/estilosestandares.component.scss']
})


export class PacientesComponent implements OnInit {

  cambiarBoton: string = "Guardar"
  // validacion: boolean = true;
  titulo = 'Pacientes'

  private Comprobacion: boolean = true
  saltarAlertas: boolean = false;
  nombreSede !: string;

  // todo: alertas de notificaciones
  // * alert successful
  msg: string = ""
  aparecerSuccessful = false;
  ocultarSuccessful = true;
  // * fin
  // todo: alert info
  msgInfo: string = ""
  aparecerInfo = false;
  ocultarInfo = true;
  // todo: fin
  // ! alert Warning
    msgWarning = ""
    aparecerWarning = false;
    ocultarWarning = true;
  // ! fin
  // todo: fin


  mjsConfirmacion !: string;
  saltarAlertaBusqueda: boolean = false;

  objPacientes: any = {
    cod_pacien1: '',
    edad_pacien1: '',
    nom11: '',
    nom21: '',
    apell11: '',
    apell21: '',
    id_pacien1: '',
    tipo_id_pacien1: '',
    lugar_exp1: '',
    fecha_nac1: '',
    sexo_pacien1: '',
    tipo_afiliado1: '',
    dir_pacien1: '',
    tel_pacien1: '',
    celularwhatsapp1: '',
    zona1: '',
    nivel1: '',
    raza1: '',
    tipo_edad_pacien1: '',
    tipo_usua1: '',
    nom_presp1: '',
    tel_presp1: '',
    par_presp1: '',
    est_civil1: '',
    ocupacion1: '',
    codetnia1: '',
    codnivedu1: '',
    codmunicipio: '',
    coddpto1: '',
    codentidad1: '',
    tiposangre1: '',
    estado1: '',
    email1: ''
  };

  @ViewChild('radioButton1') radioButton1!: ElementRef;
  @ViewChild('radioButton2') radioButton2!: ElementRef;

  public ocup: any[] = [];
  public depa: any[] = [];
  public muni: any[] = [];
  public countries: any[] = [];
  municipios: Array<any> = []
  private emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  fuenteDatos !: any[];
  showFilterRow: boolean = true;
  currentFilter: boolean = true;
  mostrarLista: boolean = true;
  codigo1: any
  formulario !: FormGroup;
  formBusqueda!: FormGroup;
  Ocupacione: any;
  minYear: number = 1900;
  constructor(
    private formBuilder: FormBuilder, 
    // private pacienteServices: PacienteService,
    private config: ConfiguracionesService,
    private crudService: CRUDService,
    private toastr: ToastrService,

    ) { 
    }
  pacientes: Array<any> = []
  @ViewChild('autofocus') autofocus!: ElementRef;
  ngAfterContentInit(): void {
    setTimeout(() => {
      this.autofocus.nativeElement.focus();
    }, 1000);
  }
  
  ngOnInit(): void {
    this.formBusqueda = this.formBuilder.group({
      id_pacien1: ["", [Validators.required, Validators.maxLength(20), Validators.minLength(5)]],
      tipo_id_pacien1: ["", Validators.required]
    })
    this.formulario = this.formBuilder.group({
      nom11: ["", [Validators.required, Validators.maxLength(20)]],
      nom21: ["", Validators.maxLength(20)],
      apell11: ["", [Validators.required, Validators.maxLength(30)]],
      apell21: ["", [Validators.required, Validators.maxLength(30)]],
      id_pacien1: [""],
      tipo_id_pacien1: [""],
      lugar_exp1: [""],
      fecha_nac1: ["", [Validators.required, this.validarFecha]],
      sexo_pacien1: ["", Validators.required],
      tipo_afiliado1: ["", Validators.required],
      dir_pacien1: ["", [Validators.required, Validators.maxLength(50)]],
      tel_pacien1: ["", [Validators.required, Validators.maxLength(30)]],
      celularwhatsapp1: ["", [Validators.required, Validators.maxLength(10)]],
      zona1: ["", Validators.required],
      nivel1: ["", Validators.required],
      raza1: [""],
      est_civil1: ["", Validators.required],
      ocupacion1: ["", Validators.required],
      tipo_edad_pacien1: [""],
      tipo_usua1: [""],
      nom_presp1: ["", [Validators.required, Validators.maxLength(30)]],
      tel_presp1: ["", [Validators.required, Validators.maxLength(20)]],
      par_presp1: ["", Validators.required],
      codetnia1: ["", Validators.required],
      codnivedu1: ["", Validators.required],
      codmunicipio1: ["", Validators.required],
      coddpto1: ["", Validators.required],
      codentidad1: ["", Validators.required],
      tiposangre1: ["", [Validators.required, Validators.maxLength(10)]],
      estado1: [1, Validators.required],
      email1: ["", [Validators.maxLength(100), Validators.pattern(this.emailPattern)]],
      // cod_pacien1: ["", Validators.required],
      edad_pacien1: [""],
    })
    this.RealizarConsultas()
    setTimeout(async () => {
      this.saltarAlertas = true;
      this.radioButton1.nativeElement.checked = await true;
      console.log("this.radioButton1.nativeElement.checked = ", this.radioButton1.nativeElement.checked);
      this.formulario.controls['estado1'].setValue("1")
    }, 2000);
    this.formulario.get('fecha_nac1').markAsTouched();
  }

  cod_pacien1: string = ''
  
  bus_paciente(){    
    const identificacionValue: string = this.formBusqueda.value.id_pacien1.toString()
    this.autofocus.nativeElement.blur();
    if (identificacionValue == "") {
      this.toastr.warning('Por favor ingrese el numero de identificación que desea consultar', this.titulo, { timeOut: 3000, progressBar: true });
    }
    else{
      this.crudService.llamarProcedimientoPorParametro("sel_tpaciente_web", { id1: this.formBusqueda.value.id_pacien1}).subscribe(
        res =>{
          console.log("Este es el log del antes de la funcion", res);
          if (res.length === 0) {
            this.toastr.info('El paciente consultado no existe en la base de datos', this.titulo, { timeOut: 3000, progressBar: true });
            // this.aparecerAlerta("El paciente consultado no existe en la base de datos", 2);
            this.Comprobacion = true;
            this.cambiarBoton = "Guardar";
            this.formulario.reset()
            this.radioButton1.nativeElement.checked = true;
            this.formulario.controls['estado1'].setValue("1")
            this.formBusqueda.controls['tipo_id_pacien1'].setValue("")
          }
          else{
            res.find((obj: any) => {
              this.toastr.success('Paciente consultado con exito!', this.titulo, { timeOut: 3000, progressBar: true });
              this.Comprobacion = false;
              this.cambiarBoton = "Actualizar";
              this.saltarAlertas = true;
              this.cod_pacien1 = obj.vr_codpacien
              this.formBusqueda.controls['tipo_id_pacien1'].setValue(obj.vr_tipo_id_pacien)
              this.objPacientes = {
                cod_pacien1: obj.vr_codpacien,
                nom11: obj.vr_nom1,
                nom21: obj.vr_nom2,
                apell11: obj.vr_apell1,
                apell21: obj.vr_apell2,
                id_pacien1: obj.vr_id_pacien,
                lugar_exp1: obj.vr_lugar_exp,
                fecha_nac1: obj.vr_fecha_nac,
                sexo_pacien1: obj.vr_sexo_pacien,
                tipo_afiliado1: obj.vr_tipo_afiliado,
                dir_pacien1: obj.vr_dir_pacien,
                tel_pacien1: obj.vr_tel_pacien,
                celularwhatsapp1: obj.vr_celularwhatsapp,
                zona1: obj.vr_zona,
                nivel1: obj.vr_nivel,
                est_civil1: obj.vr_est_civil,
                ocupacion1: obj.vr_ocupacion,
                nom_presp1: obj.vr_nom_presp,
                tel_presp1: obj.vr_tel_presp,
                par_presp1: obj.vr_par_presp,
                codetnia1: obj.vr_codetnia,
                codnivedu1: obj.vr_codnivedu,
                codmunicipio1: obj.vr_codmunicipio,
                coddpto1: obj.vr_coddpto,
                codentidad1: obj.vr_codentidad,
                tiposangre1: obj.vr_tiposangre,
                estado1: obj.vr_estado,
                email1: obj.vr_emailpacien || '' // asignar un string vacío si emailpacien es null
              };
              this.formulario.patchValue(this.objPacientes)
              if (this.formulario.value.estado1 == 1) {
                this.radioButton1.nativeElement.checked = true;
                this.formulario.controls['estado1'].setValue("1")
              }
              else if(this.formulario.value.estado1 == 0){
                this.radioButton2.nativeElement.checked = true;
                this.formulario.controls['estado1'].setValue("0")
              }
              console.log("Este es el buscador por identificación", this.objPacientes);
            })
          }
        },
        err => {
          this.toastr.error('Estamos teniendo problemas con el servidor :/', this.titulo, { timeOut: 3000, progressBar: true });
          // this.aparecerAlerta("Estamos teniendo problemas con el servidor :/", 3)
          console.log(err)
        }
      )
    }
  }
  validarFecha(control) {
    const selectedDate = new Date(control.value);
    if (selectedDate.getFullYear() < 1900) {
      return { 'invalidYear': true };
    }
    return null;
  }
  isValidYear(event: any) {
    // Lógica para validar el año y establecer el estado del campo fecha_nac1
    const selectedDate = new Date(event.value);
    if (selectedDate.getFullYear() < 1900) {
      this.formulario.get('fecha_nac1').setErrors({ 'invalidYear': true });
    } else {
      this.formulario.get('fecha_nac1').setErrors(null);
    }
  }
  onDateValueChanged(event: any) {
    this.formulario.get('fecha_nac1').updateValueAndValidity();
  }
  idmed1: any = {}

  consultas: any = {
    tipo: [],
    depa: [],
    muni: [],
    codet:[],
    esco: [],
    countries: [],
    ocup: []
  }
  // limpiar () {
  //   this.formBusqueda.reset()
  //   this.formulario.reset()
  // }


  RealizarConsultas(): void{
    // this.crudService.llamarProcedimiento("sel_tpaciente_web").subscribe(
    //   res => {
    //     this.consultas.tipo = res
    //     console.log(res)
    //   },
    //   err => console.log(err)
    // )
    this.crudService.llamarProcedimiento("sel_ttipoid_paciente").subscribe(
      res => {
        this.consultas.tipo = res
        console.log(res)
      },
      err => console.log(err)
    )
    this.crudService.llamarProcedimiento("sel_departamento").subscribe(
      res => {
        this.depa = res
        console.log("Estos son los departamentos", res)
      },
      err => console.log(err)
    )
    this.crudService.llamarProcedimiento("sel_tmunicipios").subscribe(
      res => {
        this.municipios = res
        console.log(res)
      },
      err => console.log(err)
    )
    this.crudService.llamarProcedimiento("sel_tetnia").subscribe(
      res => {
        this.consultas.codet = res
        console.log(res)
      },
      err => console.log(err)
    )
    this.crudService.llamarProcedimiento("sel_tescolaridad").subscribe(
      res => {
        this.consultas.esco = res
        console.log(res)
      },
      err => console.log(err)
    )
    this.crudService.llamarProcedimiento("sel_tentidad_all_web").subscribe(
      res => {
        this.countries = res
        console.log("Estas son las entidades",res)
      },
      err => console.log(err)
    )
    this.crudService.llamarProcedimiento("sel_tocupaciones").subscribe(
      res => {
        this.ocup = res
        console.log(res)
      },
      err => console.log(err)
    )
  }

  comprobacion(){
    if (this.Comprobacion == true) {
      this.ConfirmarGuardado();
    }
    else{
      this.confirmarUpdate();
    }
  }
  onValueChangedDepartamentos(item: any) {
    console.log("select::", item.value);
    this.muni = this.municipios.filter((element) => {        
      return element.coddepartamento == item.value
    })
  }
  
  async ConfirmarGuardado() {
    console.log(this.formulario.valid, this.formBusqueda.valid);
    
    if (this.formulario.valid && this.formBusqueda.valid) {
      this.objPacientes = await this.formulario.value
      this.objPacientes.tipo_id_pacien1 = await this.formBusqueda.value.tipo_id_pacien1
      this.objPacientes.id_pacien1 = await this.formBusqueda.value.id_pacien1

      let objGuardar: any = {}
      objGuardar = this.objPacientes
      await delete objGuardar.cod_pacien1
      console.log("ESTE ES EL FORMULARIO", objGuardar);
      this.crudService.llamarProcedimientoPorParametro("guardar_tpaciente_web", objGuardar).subscribe(
        res => {
          if (res.yaexiste) {
            this.toastr.warning('El paciente ya existe en la base de datos', this.titulo, { timeOut: 3000, progressBar: true });
            // this.aparecerAlerta("El paciente ya existe en la base de datos", 2)
            this.radioButton1.nativeElement.checked = true;
            this.formulario.controls['estado1'].setValue("1")
            // this.bus_paciente()
          }
          else{
            console.log("Esta es la respuesta final del guardado ",res);
            this.formulario.reset();
            this.formBusqueda.reset()
            this.toastr.success('Registro Guardado!', this.titulo, { timeOut: 3000, progressBar: true });
            this.Comprobacion =  true;
            this.saltarAlertas = false;
            this.cambiarBoton = "Guardar"
            this.radioButton1.nativeElement.checked = true;
            this.formulario.controls['estado1'].setValue("1")

            this.crudService.registrarMovimientosDelUsuario("tpaciente", 1)
          }
          
        },
        err => {
          this.toastr.error('Error al insertar el registro. ' + JSON.stringify(err), this.titulo, { timeOut: 5000, progressBar: true });
          console.log(err)
        }
      )
    }
    else {
      this.aparecerAlerta("Complete los campos que son requeridos", 2)
      this.saltarAlertas = true;
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
        this.actualizarPaciente()
      }
    })
  }
  actualizarPaciente(){
    console.log(this.formulario.valid, this.formBusqueda.valid);
    if (this.formulario.valid && this.formBusqueda.valid) {
      this.objPacientes = this.formulario.value
      this.objPacientes.tipo_id_pacien1 = this.formBusqueda.value.tipo_id_pacien1
      this.objPacientes.id_pacien1 = this.formBusqueda.value.id_pacien1
      this.objPacientes.codpacien1 = this.cod_pacien1
      this.objPacientes.codentidad1 = this.objPacientes.codentidad1;
      this.objPacientes.codetnia1 = this.objPacientes.codetnia1;
      this.objPacientes.codnivedu1 = this.objPacientes.codnivedu1;
      this.objPacientes.estado1 = this.objPacientes.estado1;
      this.objPacientes.nivel1 = this.objPacientes.nivel1;
      this.objPacientes.tipo_afiliado1 = this.objPacientes.tipo_afiliado1;
      delete this.objPacientes.tipo_usua1
      delete this.objPacientes.edad_pacien1
      delete this.objPacientes.raza1
      delete this.objPacientes.tipo_edad_pacien1
      console.log("ESTE ES EL FORMULARIO DE ACTUALIZAR", this.objPacientes);
      this.crudService.llamarProcedimientoPorParametro("update_tpaciente", this.objPacientes).subscribe(
        res => {
          console.log("Esta es la respuesta final del guardado ",res);
          this.toastr.success('Registro Actualizado!', this.titulo, { timeOut: 3000, progressBar: true });
          this.formulario.reset();
          this.formBusqueda.reset()
          this.Comprobacion =  true;
          this.cambiarBoton = "Guardar"
          this.radioButton1.nativeElement.checked = true;
          this.formulario.controls['estado1'].setValue("1")

          this.crudService.registrarMovimientosDelUsuario("tpaciente", 2)
        },
        err => {
          console.log(err)
        }
      )
    }
    else {
      this.saltarAlertas = true;
    }
  }
  soloNumeros(event: KeyboardEvent, cantMax: number){
    this.config.soloNumeros(event, cantMax)
  }
  soloLetras(event: KeyboardEvent){
    this.config.soloLetras(event)
  }

  BotonesOpciones(Boton: number){
    if (Boton == 1) {
      this.comprobacion()
    }
    else if(Boton == 2){
      this.formulario.reset();
      this.formBusqueda.reset();
      this.Comprobacion =  true;
      this.cambiarBoton = "Guardar"
      this.radioButton1.nativeElement.checked = true;
      this.formulario.controls['estado1'].setValue("1")
    }
    else if(Boton == 3){
      this.aparecerAlerta("Redireccionando...", 2)
    }
  } 

  aparecerAlerta(msg: string, numAlert: number): void {
    if (numAlert == 1) {
      this.msg = msg;
      this.aparecerSuccessful = true;
      this.ocultarSuccessful = false;
      setTimeout(() => {
        this.aparecerSuccessful = false;
        this.ocultarSuccessful = true;
      }, 3500);
    }
    else if (numAlert == 2) {
      this.msgInfo = msg;
      this.aparecerInfo = true;
      this.ocultarInfo = false;
      setTimeout(() => {
        this.aparecerInfo = false;
        this.ocultarInfo = true;
      }, 3500);
    }
    else if (numAlert == 3) {
      this.msgWarning = msg;
      this.aparecerWarning = true;
      this.ocultarWarning = false;
      setTimeout(() => {
        this.aparecerWarning = false;
        this.ocultarWarning = true;
      }, 3500);
    }
  }

  get nom11(): any { return this.formulario.get('nom11'); }
  get nom21(): any { return this.formulario.get('nom21'); }
  get apell11(): any { return this.formulario.get('apell11'); }
  get apell21(): any { return this.formulario.get('apell21'); }
  get id_pacien1(): any { return this.formBusqueda.get('id_pacien1'); }
  get tipo_id_pacien1(): any { return this.formBusqueda.get('tipo_id_pacien1'); }
  get lugar_exp1(): any { return this.formulario.get('lugar_exp1'); }
  get fecha_nac1(): any { return this.formulario.get('fecha_nac1'); }
  get sexo_pacien1(): any { return this.formulario.get('sexo_pacien1'); }
  get tipo_afiliado1(): any { return this.formulario.get('tipo_afiliado1'); }
  get dir_pacien1(): any { return this.formulario.get('dir_pacien1'); }
  get tel_pacien1(): any { return this.formulario.get('tel_pacien1'); }
  get celularwhatsapp1(): any { return this.formulario.get('celularwhatsapp1'); }
  get zona1(): any { return this.formulario.get('zona1'); }
  get nivel1(): any { return this.formulario.get('nivel1'); }
  // get raza1(): any { return this.formulario.get('raza1'); }
  get est_civil1(): any { return this.formulario.get('est_civil1'); }
  get tipo_usua1(): any { return this.formulario.get('tipo_usua1'); }
  get nom_presp1(): any { return this.formulario.get('nom_presp1'); }
  get tel_presp1(): any { return this.formulario.get('tel_presp1'); }
  get par_presp1(): any { return this.formulario.get('par_presp1'); }
  get ocupacion1(): any { return this.formulario.get('ocupacion1'); }
  get codmunicipio1(): any { return this.formulario.get('codmunicipio1'); }
  get codetnia1(): any { return this.formulario.get('codetnia1'); }
  get codnivedu1(): any { return this.formulario.get('codnivedu1'); }
  get codmunicipio(): any { return this.formulario.get('codmunicipio'); }
  get coddpto1(): any { return this.formulario.get('coddpto1'); }
  get codentidad1(): any { return this.formulario.get('codentidad1'); }
  get tiposangre1(): any { return this.formulario.get('tiposangre1'); }
  get estado1(): any { return this.formulario.get('estado1'); }
  get email1(): any { return this.formulario.get('email1'); }
}