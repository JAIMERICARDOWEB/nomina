import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DxSelectBoxModule, DxDataGridModule, DxTreeViewComponent } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CRUDService } from 'src/app/servicios/CRUD.service';
import Swal from 'sweetalert2';
import { AbstractControl } from '@angular/forms';
import { ConfiguracionesService } from 'src/app/servicios/configuraciones.service';
import { locale, loadMessages } from "devextreme/localization";


@Component({
  selector: 'app-agendas',
  standalone: true,
  imports: [CommonModule, SharedModule, DxSelectBoxModule, DxDataGridModule],
  templateUrl: './agendas.component.html',
  styleUrls: ['../../../../../scss/estilosestandares.component.scss']
})


export class AgendasComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(DxTreeViewComponent, { static: false }) treeView;
  cambiarBoton: boolean
  private Comprobacion: boolean = true
  saltarAlertas: boolean = false;


  objeDocumentos:  any = {
    nom_agen1: '',
    id_med1: '',
    fecha_ini1: '',
    fecha_fin1: '',
    cod_espe1: '',
    idsede1: 0,
    check1: false,
    tiempo1: 0,
    obser1: ''
  }
  objDocumentos : any = {
    vr_idagen: 0,
    vr_nom_agen: '',
    vr_fechaini: '',
    vr_fechafin: '',
    vr_estado: ''
  }
  dataSource !: MatTableDataSource<any>;
  keyword = 'nom_med1';
  public countries: any[] = [];
  public countriesEspecialidad: any[] = [];
  public countriesSedes: any[] = [];
  mostrarLista: boolean = true;
  fuenteDatos !: any[];

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

  titulo = 'Agendas'
  formulario !: FormGroup;
  formularioAgregarDias !: FormGroup;

  tablaSede : any = {
    id1 : "",
    nombre1: ""
  }

  camposform : boolean = true;
  constructor(private forBuilder: FormBuilder, private crudService: CRUDService, private toastr: ToastrService, private config: ConfiguracionesService) { }

  ngOnInit(): void {
    this.formulario = this.forBuilder.group({
      nom_agen1: ["", [Validators.required, Validators.maxLength (20)]],
      id_med1: ["", Validators.required],
      fecha_ini1: ["", [Validators.required, Validators.maxLength (10)]],
      fecha_fin1: ["", [Validators.required, Validators.maxLength (10)]],
      cod_espe1: ["", Validators.required, ],
      idsede1: ["", Validators.required],
      check1: [false],
      tiempo1: ['', Validators.maxLength(5)],
      obser1: ["", Validators.maxLength(225)],
      clascx1 : ["", Validators.required,]
    }, { validator: this.fechaFinValidator });
    
    this.formulario.disable()
    this.formulario.controls["id_med1"].enable();

    this.formularioAgregarDias = this.forBuilder.group({
      vr_dia: ['', Validators.required],
      vr_hora_inicial: ['', Validators.required],
      vr_hora_final: ['', Validators.required],
      vr_sede: ['', Validators.required]
    }, { validator: this.fechaFinValidatorHora })

    this.formularioAgregarDias.disable()
    this.formularioAgregarDias.controls["vr_dia"].enable();

    this.Sedes()
    this.Medicos()
    this.Especialidades()
  }

  selectedSedes: Array<any> = [];
  gridBoxValue: number[] = [3];

  Sedes() {
    this.crudService.llamarProcedimiento("sel_tsedes")
    .subscribe(
      res => {
        this.countriesSedes = res;
        console.log("Sedes: ", res);
      },
      err => {
        console.log(err);
      }
    );
  }
  sedeSeleccionada(event: any) {
    const selectedId = event.value;

    // Verifica si la sede ya existe en el dataSource selectedSedes
    const sedeExists = this.selectedSedes.some(sede => sede.id1 === selectedId);

    if (!sedeExists) {
        const sede = this.countriesSedes.find(sede => sede.id1 === selectedId);
        if (sede) {
            this.selectedSedes.push(sede);
        }
    } else {
        console.log('La sede ya existe en la tabla.');
    }
}

  // sedeSeleccionada(event: any) {

  //   const selectedId = event.value;
  //   console.log("ffsadfasdfasfddfsdfsfd", selectedId);

  //   const sede = this.countriesSedes.filter(sede => {return sede.id1 === selectedId})
  //   sede.find(obj => {
  //     this.selectedSedes.push(obj);
  //   })
  // }

// id1
// "57"
// nombre1
// "CAUCASIA"


  agregarDiaSeleccionado() {

  }
  
  campoHabilitado: boolean = false;

  async onCheckboxClick() {
     let checktiempovalue: boolean = await this.formulario.value.check1
    console.log(checktiempovalue);
    if (!checktiempovalue) {
      this.formulario.controls['tiempo1'].setValue(''); // Limpiar el campo si se deshabilita
      this.formulario.get("tiempo1").enable();
    }
    else {
      this.formulario.controls['tiempo1'].setValue(''); // Limpiar el campo si se deshabilita
      this.formulario.get("tiempo1").disable();
    }
  }

  getData(): Array<any> {
    // console.log(this.sede);
    return this.countriesSedes
  }
  Medicos() {
    this.crudService.llamarProcedimiento("sel_tmedico")
    .subscribe(
      res => {
        console.log("los medicos: ", res);
        this.countries = res
      },
      err => {
        console.log(err);
      }
    )
  }

  Especialidades() {
    this.crudService.llamarProcedimiento("sel_especialidad")
    .subscribe(
      res => {
        this.countriesEspecialidad = res
        console.log("Especialidades: ", res);
      },
      err => {
        console.log(err);
      }
    )
  }
  DS: any;
  llenarTabla(idmedicos : string){
    this.crudService.llamarProcedimientoPorParametro("sel_tagendamedicoweb", { idmedico1: idmedicos})
    .subscribe(
      res => {
        console.log("esta es la tabla 1", res);
        res.find((obj: any) => {
          this.objDocumentos = obj;
          this.objDocumentos.vr_fechafin = new Date(this.objDocumentos.vr_fechafin).toLocaleDateString();
          this.objDocumentos.vr_fechaini = new Date(this.objDocumentos.vr_fechaini).toLocaleDateString();
          this.fuenteDatos = res;
        })
        this.DS = new MatTableDataSource([this.objDocumentos]);
        this.DS.sort = this.sort;
        this.DS.paginator = this.paginator;
        console.log("esta es la tabla 2", res);
        this.DS = res
      },
      err => {
        console.log(err);
      }
    )
  }
  selectedItems !: Array<any>;

  fechaFinValidator (control: AbstractControl) {
    const fechaInicio = control.get('fecha_ini1').value;
    const fechaFin = control.get('fecha_fin1').value;
    if (fechaInicio && fechaFin) {
      const fechaInicioObj = new Date(fechaInicio);
      const fechaFinObj = new Date(fechaFin);
      if (fechaFinObj < fechaInicioObj) {
        return { fechaFinAnterior: true };
      }
    }
    return null;
  }

  fechaFinValidatorHora(control: AbstractControl) {
    const horaInicio = control.get('vr_hora_inicial').value;
    const horaFin = control.get('vr_hora_final').value;
  
    if (horaInicio && horaFin) {
      // Dividir la hora y los minutos de la cadena en formato "HH:mm"
      const [horaInicioStr, minutosInicioStr] = horaInicio.split(':');
      const [horaFinStr, minutosFinStr] = horaFin.split(':');
  
      // Convertir las cadenas de hora y minutos a números enteros
      const horaInicioInt = parseInt(horaInicioStr, 10);
      const minutosInicioInt = parseInt(minutosInicioStr, 10);
      const horaFinInt = parseInt(horaFinStr, 10);
      const minutosFinInt = parseInt(minutosFinStr, 10);
  
      // Crear objetos Date con la fecha actual y las horas y minutos proporcionados
      const fechaActual = new Date();
      const fechaInicioObj = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth(),
        fechaActual.getDate(),
        horaInicioInt,
        minutosInicioInt
      );
  
      const fechaFinObj = new Date(
        fechaActual.getFullYear(),
        fechaActual.getMonth(),
        fechaActual.getDate(),
        horaFinInt,
        minutosFinInt
      );
  
      if (fechaFinObj < fechaInicioObj) {
        return { fechaFinAnteriorHora: true };
      }
    }
    return null;
  }
  

  Traeragenda(codigo1: number) {
    console.log(codigo1);
    this.crudService.llamarProcedimientoPorParametro("sel_tagendamedicoweb", { idmedico1: codigo1})
    .subscribe(
      res => {
        res.find((obj: any) => {
          this.objDocumentos = obj;
          this.objDocumentos.vr_fechafin = new Date(this.objDocumentos.vr_fechafin).toLocaleDateString();
          this.objDocumentos.vr_fechaini = new Date(this.objDocumentos.vr_fechaini).toLocaleDateString();
          this.fuenteDatos = res;
        })
        this.dataSource = new MatTableDataSource([this.objDocumentos]);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        console.log();
        
      },
      err => {
        console.log(err);
      }
    )
  }
  comprobacion(){
    if (this.Comprobacion == true) {
      this.guardarForm();
    }
    else{
      this.Actualizarform();
    }
  }
  guardarForm() {
    console.log(this.formulario.value);
    let objMod: any = this.formulario.value
    if (objMod.clascx1 == "Activa") {
        objMod.clascx1 = 0;
    } else{
        objMod.clascx1 = 1;
    }
    if (objMod.tiempo1 == undefined || null || false || "" ) {
      objMod.tiempo1 = "0"
    }
    if (this.formulario.valid) {
      this.crudService.llamarProcedimientoPorParametro("guardar_tagendaweb", objMod)
      .subscribe(
        async res => {
          console.log("Respuesta del guardado", res);
          this.formulario.reset();
          this.saltarAlertas = false;
          this.toastr.success('¡Registro guardado éxitosamente!',  this.titulo, { timeOut: 3000, progressBar: true });
          this.crudService.registrarMovimientosDelUsuario("tagenda", 1)

          // ? luego de guardar la agenda se empiezan a guardar las sedes de la tabla
          await this.selectedSedes.forEach(async (sede: {id1: string, nombre1: string}) => {
            await this.crudService.llamarProcedimientoPorParametro("guardar_tagendasedesweb", {id_agenda: res, id_sede: sede.id1}).subscribe(
              res => {
                console.log(`Agenda${sede.nombre1}con id:${res} guardada con exitó`);
                this.crudService.registrarMovimientosDelUsuario("tagendasedes", 1)
              },
              err => {
                this.toastr.error(`La Agenda${sede.nombre1}con id:${sede.id1} no se guardo correctamente`,  this.titulo, { timeOut: 3000, progressBar: true });
                console.log(err);
                
              }
            )
          })
          this.selectedSedes = [];          
          // this.llenarTabla()
        },
        err =>{
          console.log(err);
        }
      )
    } 
  }
  seleccion(id_med1: string) {
    this.crudService.llamarProcedimientoPorParametro("sel_tconfig_correo_id", { id_med1: Number})
    .subscribe(
      res => {
        res.find((object: Object) => {
          this.formulario.patchValue(object)
          this.Comprobacion = false
          console.log(res);
          console.log(object);

        })
      },
      err => {
        console.log(err)
      }
    )
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
          this.Actualizarform();
        }
      })
      
    }
    else {
      this.guardarForm();
      console.log("quiere guardar");
    }
  }
  Actualizarform() {
    if (this.formulario.valid) {
      this.crudService.llamarProcedimientoPorParametro("update_tagendaweb", this.formulario.value)
      .subscribe(
        res => {
          console.log(res);
          this.DS = []
          console.log(this.formulario.value.codigo1);
          this.toastr.success('Agenda actualizada con exito!',  this.titulo, { timeOut: 3000, progressBar: true });
          this.crudService.registrarMovimientosDelUsuario("tagenda", 2)
        },
        err => {
          console.log(err);
        }
      )
    }
    else {
      this.toastr.info('Complete los campos que son requeridos',  this.titulo, { timeOut: 3000, progressBar: true });
      this.saltarAlertas = true;
    }
  }
  eliminarAgdSed() {
    // this.agendaService.eliminarSedAgen(this.formulario2.valid)
    //   .subscribe(
    //     res => {
    //       console.log(res);
    //     },
    //     err => {
    //       console.log(err);
    //     }
    //   )
  }
   convertirFecha(fecha) {
    var partes = fecha.split('/');
    var dia = partes[0];
    var mes = partes[1];
    var año = partes[2];
    if (dia.length === 1) {
      dia = '0' + dia;
    }
    if (mes.length === 1) {
      mes = '0' + mes;
    }
    var fechaConvertida = año + '-' + mes + '-' + dia;
    return fechaConvertida;
  }

  desplegarTablaDias: boolean = false;
  
  onSelectionChanged(event){
    const selectedRows: Array<any> = event.selectedRowsData;
    
    this.formulario.disable()
    this.formulario.get("id_med1").enable();
    
    if (selectedRows.length !== 0 || null || undefined) {
      this.desplegarTablaDias = true; // ? se muestra el form y la tabla de los dias 
      this.seleccionarDia({value: 0}, 1, event.selectedRowsData) // ? aqui se carga la data de los dias
    }
    
    if (selectedRows.length > 0) {
      this.Comprobacion = false;
      this.saltarAlertas = true;
      console.log(selectedRows[0]);
      this.formulario.patchValue({
        nom_agen1: selectedRows[0].vr_nom_agen,
        id_med1: selectedRows[0].vr_id_med,
        fecha_ini1: this.convertirFecha(selectedRows[0].vr_fechaini),
        fecha_fin1: this.convertirFecha(selectedRows[0].vr_fechafin),
        cod_espe1: selectedRows[0].vr_cod_espe,
        idsede1: selectedRows[0].vr_idsede,
        check1: selectedRows[0].vr_checktiempo,
        tiempo1: selectedRows[0].vr_tiempo,
        obser1: selectedRows[0].vr_observacion,
        clascx1: selectedRows[0].vr_estado
      })
      this.cambiarBoton = true
      this.crudService.llamarProcedimientoPorParametro("sel_sedes_by_codagenda", {p_codagenda: selectedRows[0].vr_id_agen}).subscribe(
        res => {
          console.log('respuesta',res );
          this.selectedSedes = res
        },
        err => {
          console.log(err);
          
        }
      )
    }
  }

  onValueChanged(event: any){
    this.llenarTabla(event.value)
    console.log(event.value);
    const result: any = this.countries.filter(medico => { return medico.idmed1 === event.value})
    console.log(result);
    result.find(obj => {
      this.formulario.controls["cod_espe1"].setValue(obj.cod_espe1)
    })

    console.log("disable",this.camposform);
    this.formulario.enable()
    this.formulario.get("tiempo1").disable();
    // ? cunsulta para la tabla
  }

  soloNumeros(event: KeyboardEvent, cantMax: number){
    this.config.soloNumeros(event, cantMax)
  }

  BotonesOpciones(Boton: number){
    if (Boton == 1) {
      console.log("llega aqui");
      this.comprobacion()
    }
    else if(Boton == 2){
      this.formulario.reset();
      this.selectedSedes = [];
      this.cambiarBoton = false;
      this.formulario.disable();
      this.formulario.get("id_med1").enable();
      this.desplegarTablaDias = false;
      // this.formBusqueda.reset();
      // this.Comprobacion =  true;
      // this.cambiarBoton = "Guardar"
      // this.radioButton1.nativeElement.checked = true;
    }
    else if(Boton == 3){
    }
  } 

  // ? Agragegar dias medicos agenda 
  
  countriesDias: Array<any> = [
    { 
      id_dia: "1",
      nom_dia: "LUNES"
    },
    { 
      id_dia: "2",
      nom_dia: "MARTES"
    },
    { 
      id_dia: "3",
      nom_dia: "MIÉRCOLES"
    },
    { 
      id_dia: "4",
      nom_dia: "JUEVES"
    },
    { 
      id_dia: "5",
      nom_dia: "VIERNES"
    },
    { 
      id_dia: "6",
      nom_dia: "SÁBADO"
    },
    { 
      id_dia: "7",
      nom_dia: "DOMINGO"
    },
  ];

  DiasSeleccionados: Array<any> = []

  diaIdSeleccionado: string = '';
  idAgenda: Array<any> = [];

  habilitarDehabilitarBotonForm2: boolean = true;

  async seleccionarDia(event: any, indice: number, idAgenda: Array<any>){
    switch (indice) {
      case 1:
        this.idAgenda = idAgenda
        console.log(this.idAgenda);
        // this.formularioAgregarDias.controls["vr_dia"].enable();
    
        break;
      case 2: 
        if (this.formularioAgregarDias.value.vr_hora_inicial == "" || null || undefined || this.formularioAgregarDias.value.vr_hora_final == "" || null || undefined) {
          this.toastr.warning("Por favor ingrese el rango de horas.", this.titulo, { timeOut: 3000, progressBar: true });
        }
        else{
          let objTabla = { 
            vr_dia: "",
            vr_hora_inicial: this.formularioAgregarDias.value.vr_hora_inicial,
            vr_hora_final: this.formularioAgregarDias.value.vr_hora_final,
            vr_sede: ""
          }
          const diaSelecTabla: Array<{id_dia: string, nom_dia: string}> = await this.countriesDias.filter(dia => { return dia.id_dia === this.formularioAgregarDias.value.vr_dia});
          
          await diaSelecTabla.find(dia => {
            objTabla.vr_dia = dia.nom_dia;
          })
          const SedeSelecTabla: Array<{id1: string, nombre1: string}> = await this.selectedSedes.filter(sede => { return sede.id1 === this.formularioAgregarDias.value.vr_sede});
          await SedeSelecTabla.find(sede => {
            objTabla.vr_sede = sede.nombre1;
          })
          console.log(this.formularioAgregarDias.value ,objTabla);
          if (objTabla.vr_sede !== "" && objTabla.vr_sede !== null && objTabla.vr_sede !== undefined) {
              const diaExists = this.DiasSeleccionados.some(dia => dia.vr_dia === objTabla.vr_dia);
              const horarioConflicto = this.DiasSeleccionados.some(dia => {
                const horaInicial = dia.vr_hora_inicial;
                const horaFinal = dia.vr_hora_final;
                return (objTabla.vr_hora_inicial >= horaInicial && objTabla.vr_hora_inicial <= horaFinal) ||
                        (objTabla.vr_hora_final >= horaInicial && objTabla.vr_hora_final <= horaFinal);
              });
          
              if (diaExists && horarioConflicto) {
                this.toastr.error("El horario se cruza con otro día existente.", this.titulo, { timeOut: 3000, progressBar: true });
              } else {
                this.habilitarDehabilitarBotonForm2 = false;
                this.DiasSeleccionados.push(objTabla);
              }
          }
          this.formularioAgregarDias.controls['vr_sede'].setValue('');
          this.formularioAgregarDias.controls['vr_dia'].setValue('');
        }
        
        break;
      case 3:
        this.DiasSeleccionados.forEach(async (obj: { 
          vr_dia: string,
          vr_hora_inicial: string,
          vr_hora_final: string,
          vr_sede: string
        }) => {
          let objSave = {
            in_id_agen: await this.idAgenda[0].vr_id_agen,
            in_dia: "",
            in_hora_ini: await this.convertirHoraATimeStamp(obj.vr_hora_inicial),
            in_hora_fin: await this.convertirHoraATimeStamp(obj.vr_hora_final),
            in_sede: ""
          }
          const diaSelecObj: Array<{id_dia: string, nom_dia: string}> = await this.countriesDias.filter((dia: {id_dia: string, nom_dia: string}) => { return dia.nom_dia === obj.vr_dia});
        
          await diaSelecObj.find(dia => {
            objSave.in_dia = dia.id_dia;
          })
          const SedeSelecObj: Array<{id1: string, nombre1: string}> = await this.selectedSedes.filter((sede: {id1: string, nombre1: string}) => { return sede.nombre1 === obj.vr_sede});
          await SedeSelecObj.find(sede => {
            objSave.in_sede = sede.id1.toString();
          })

          console.log(objSave);
          this.crudService.llamarProcedimientoPorParametro("guardar_tdispon_web", objSave).subscribe(
            res => {
              console.log("Los dias han sido guardados con exito: ", res);
              this.toastr.success('¡Registro guardado éxitosamente!',  this.titulo, { timeOut: 3000, progressBar: true });
            },
            err => {
              console.error("Error al guardar los datos: ", err);
              
            }
          )
        })
        break;
      default:
        break;
    }
  }

  habilitarFormularioDias(){
    this.formularioAgregarDias.enable();
  }

  convertirHoraATimeStamp(formatoHora: string){
    // Paso 1: Obtén la fecha actual
    var fechaActual = new Date();

    // Paso 2: Obtén la hora y los minutos de la cadena de texto
    var horaMinutos = formatoHora;
    var [hora, minutos]: any = horaMinutos.split(':');

    // Paso 3: Establece la hora y los minutos en la fecha actual
    fechaActual.setHours(hora);
    fechaActual.setMinutes(minutos);
    fechaActual.setSeconds(0);

    // Paso 4: Formatea la fecha en el formato deseado
    var fechaFormateada = fechaActual.toISOString().substring(0, 10) + ' ' + fechaActual.toTimeString().substring(0, 8);

    return fechaFormateada;
  }
  
  seleccionarSede(){

  }
  
  // ? fin 

  get nom_agen1(): any { return this.formulario.get('nom_agen1'); }
  get id_med1(): any { return this.formulario.get('id_med1'); }
  get fecha_ini1(): any { return this.formulario.get('fecha_ini1'); }
  get fecha_fin1(): any { return this.formulario.get('fecha_fin1'); }
  get cod_espe1(): any { return this.formulario.get('cod_espe1'); }
  get idsede1(): any { return this.formulario.get('idsede1'); }
  get check1(): any { return this.formulario.get('check1'); }
  get tiempo1(): any { return this.formulario.get('tiempo1'); }
  get obser1(): any { return this.formulario.get('obser1'); }
  get clascx1(): any { return this.formulario.get('clascx1'); } 
}
