import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CRUDService } from 'src/app/servicios/CRUD.service';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DxSelectBoxModule, DxTabPanelModule, DxDataGridModule } from 'devextreme-angular';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ConfiguracionesService } from 'src/app/servicios/configuraciones.service';

@Component({
  selector: 'app-tipoconsulta',
  standalone: true,
  imports: [CommonModule, SharedModule, DxSelectBoxModule, DxTabPanelModule, DxDataGridModule],
  templateUrl: './tipoconsulta.component.html',
  styleUrls: ['../../../../../scss/estilosestandares.component.scss']
})
export class TipoconsultaComponent implements OnInit {

  formulario !: FormGroup;
  formulario2 !: FormGroup;
  formulari2 !: FormGroup;
  nombreCorreo !: string;
  saltarAlertas: boolean = false;
  nombreBoton: string = "Guardar"
  private Comprobacion: boolean = true


  tipoconsulta : any [] = [
    {id_consulta:'1',  nombre_consulta:"Cita para consulta de primera vez de Medicina General"},
    {id_consulta:'2',  nombre_consulta:"Cita para Consulta de primera vez de Odontología General"},
    {id_consulta:'3',  nombre_consulta:"Cita para Consulta de primera vez de Medicina Interna"},
    {id_consulta:'4',  nombre_consulta:"Cita para Consulta de primera vez de Pediatría"},
    {id_consulta:'5',  nombre_consulta:"Cita para Consulta de primera vez de Ginecología"},
    {id_consulta:'6',  nombre_consulta:"Cita para Consulta de primera vez de Obstéticra"},
    {id_consulta:'7',  nombre_consulta:"Cita para Consulta de primera vez de Cirugía General"},
    {id_consulta:'8',  nombre_consulta:"Procedimiento de Ecografía"},
    {id_consulta:'9',  nombre_consulta:"Procedimiento de Resonancia Magnética Nuclear"},
    {id_consulta:'10',  nombre_consulta:"No aplica"}
  ]
  sexoconsulta : any[] = [
    {id_sexo:'M', tipo_sexo:"MACULINO"},
    {id_sexo:'F', tipo_sexo:"FEMENINO"},
    {id_sexo:'I', tipo_sexo:"SIN IDENTIFICAR"}
  ]

  objeDocumentos: any = {
    vr_descri1: '',
    vr_intervalo1: '',
    vr_color1: '',
    vr_cod_con1: '',
    vr_tipocita1: '',
    vr_cod_his1: '',
    vr_edad_desde1: '',
    vr_edad_hasta1: '',
    vr_frecuencia1: '',
    vr_sexo1: '',
    vr_tipo_con1: '',
    vr_cod_ubi1: '',
    vr_sede1: '',
    vr_espe1: '',
  }
  cambiarBoton: string = "Guardar"

  constructor(private forBuilder: FormBuilder,  private crudService: CRUDService, private toastr: ToastrService, private config: ConfiguracionesService ) { }

  ngOnInit(): void {
    this.formulario = this.forBuilder.group({
      vr_descri1: [this.objeDocumentos.vr_descri1, [Validators.required, Validators.maxLength(100)]],
      vr_intervalo1: [this.objeDocumentos.vr_intervalo1, [Validators.required, Validators.maxLength(2)]],
      vr_color1: [this.objeDocumentos.vr_color1],
      vr_cod_con1: [this.objeDocumentos.vr_cod_con1, Validators.required],
      vr_tipocita1: [this.objeDocumentos.vr_tipocita1, Validators.required],
      vr_cod_his1: [this.objeDocumentos.vr_cod_his1, Validators.required],
      vr_edad_desde1: [this.objeDocumentos.vr_edad_desde1, [Validators.required, Validators.maxLength(2)]],
      vr_edad_hasta1: [this.objeDocumentos.vr_edad_hasta1, [Validators.required, Validators.maxLength(3)]],
      vr_frecuencia1: [this.objeDocumentos.vr_frecuencia1, [Validators.required, Validators.maxLength(5)]],
      vr_sexo1: [this.objeDocumentos.vr_sexo1, Validators.required],
      // * estas son las sedes
      vr_tipo_con1: [this.objeDocumentos.vr_tipo_con1],
      vr_cod_ubi1: [this.objeDocumentos.vr_cod_ubi1],
      vr_sede1: [this.objeDocumentos.vr_sede1],
      // * esta es la especialidad
      vr_espe1: [this.objeDocumentos.vr_espe1],
      //* Estos son los contratos
      vr_cod_contra: [''],
      vr_cant: ['', Validators.maxLength(5)]
    })
    
    this.Sedes()
    this.Especialidades()
    this.Historiarelacionada()
    this.Centrodecosto()
    this.Tipodeconsulta()
    this.Codigoservicio()
    this.CodigoContrato()
    this.tiposdeconsultasel()
    this.saltarAlertas = true;

    this.formulario.controls['vr_cod_ubi1'].disable();
    this.formulario.controls['vr_cant'].disable();
  }
  titulo = 'Tipos de consulta'
  tiposdeconsultaDataSource: Array<any> = []
  tiposdeconsultasel(){
    this.crudService.llamarProcedimiento("sel_ttipocon_web").subscribe(
      res => {
        console.log("COnsulta de la tabla general",res);
        this.tiposdeconsultaDataSource = res;
      },
      err => {
        console.log(err);
      }
    )
  }

  sede: Array<any>
  Sedes() {
    this.crudService.llamarProcedimiento("sel_tsedes").subscribe(
      res => {
        this.sede = res
        console.log("Estas son las sedes", res);
        
      },
      err => {
        console.log(err)
      }
    )
  }
  hchistoria: any
  Historiarelacionada() {
    this.crudService.llamarProcedimiento("sel_t_historia_disenoweb").subscribe(
      res => {
        this.hchistoria = res
        console.log("Estas son las historias", res);
        
      },
      err => {
        console.log(err)
      }
    )
  }
  centrocosto: any
  Centrodecosto() {
    this.crudService.llamarProcedimiento("sel_thubicacaiongral_web").subscribe(
      res => {
        this.centrocosto = res
        console.log("Estos son los centros de costo",res);
        
      },
      err => {
        console.log(err)
      }
    )
  }
  data: any
  Especialidades() {
    this.crudService.llamarProcedimiento("sel_especialidad").subscribe(
      res => {
        this.data = res
        console.log("Estas son especialidades ", res);
        
      },
      err => {
        console.log(err)
      }
    )
  }
  consulta: any
  Tipodeconsulta() {
    this.crudService.llamarProcedimiento("sel_ttipocongralweb").subscribe(
      res => {
        this.consulta = res
      },
      err => {
        console.log(err)
      }
    )
  }
  cservicio: any
  Codigoservicio() {
    this.crudService.llamarProcedimiento("sel_codigotipoconsultaweb").subscribe(
      res => {
        this.cservicio = res
        console.log("estos son los codigos de servicio", res);
      },
      err => {
        console.log(err)
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
  llenartabla : any
  consultaTabla() {
    this.crudService.llamarProcedimiento("sel_ttipocon_sede_web").subscribe(
      res => {
        console.log("este es el llenado de la tabla", res);
      },
      err => {
        console.log(err);
      }
    )
  }

  onSelectAll($event: any) {
    console.log('$event is  segundo', $event);
  }
  // Validaciones rango de edades
  validarRangoEdades() {
    const desde = this.formulario.get('vr_edad_desde1')?.value;
    const hasta = this.formulario.get('vr_edad_hasta1')?.value;
  
    if (desde !== null && hasta !== null && desde >= hasta) {
      this.formulario.get('vr_edad_hasta1')?.setErrors({ 'invalidRange': true });
    } else {
      this.formulario.get('vr_edad_hasta1')?.setErrors(null);
    }
  }

  RealizarComprobacion(): void {
    if (this.Comprobacion == true) {
      this.ConfirmarGuardado();
    }
    else if (this.Comprobacion == false) {
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
  }
  dataTableSedesCentroCosto: Array<any> = []

  idsede = "";
  sedeCentroCostoSeleccionada(event: any, indice: number) {

    if (indice == 1) {
      const selectedId = event.value;
      console.log(selectedId);
      let nombreSede: Array<any> = this.sede.filter(sede => { return sede.id1 === selectedId} )
      nombreSede.find(obj => {
        this.idsede = obj.nombre1
      })
      this.formulario.controls['vr_cod_ubi1'].enable();
      this.formulario.controls['vr_cod_ubi1'].setValue("");
      console.log(this.idsede);
    }
    else if(indice == 2){
      let sedesCentroCosto = {vr_sede1: "", vr_cod_ubi1: ""}
      sedesCentroCosto.vr_sede1 = this.idsede;
      const selectedId = event.value;
      console.log(selectedId);
      let nombreCentroCosto: Array<any> = this.centrocosto.filter(centroCosto => { return centroCosto.vr_cod_ubi === selectedId} )
      nombreCentroCosto.find(obj => {
        sedesCentroCosto.vr_cod_ubi1 = obj.vr_nom_ubi
      })
      
      if (sedesCentroCosto.vr_cod_ubi1 == "" || null || undefined || sedesCentroCosto.vr_sede1 == "" || null || undefined) {
        
      }else{
        let Existendatos = this.dataTableSedesCentroCosto.filter(data => { return data.vr_sede1 === sedesCentroCosto.vr_sede1 &&  data.vr_cod_ubi1 === sedesCentroCosto.vr_cod_ubi1})
        console.log(Existendatos);        
        if (Existendatos.length === 0 || Existendatos == null || undefined) {
          this.dataTableSedesCentroCosto.push(sedesCentroCosto)
          console.log(this.dataTableSedesCentroCosto);    
        }
        else{
          this.toastr.error('¡El registro ya existe en la tabla.!',  this.titulo, { timeOut: 3000, progressBar: true });
        }
      }
      this.formulario.controls['vr_cod_ubi1'].setValue("");
      this.formulario.controls['vr_sede1'].setValue("");
      this.formulario.controls['vr_cod_ubi1'].disable();
    }
  }

  Especialidadseleccionada: Array<any> = []
  Especialidaseleccionada(event: any) {
    const selectedId = event.value;

    // Verifica si la sede ya existe en el dataSource selectedSedes
    const sedeExists = this.Especialidadseleccionada.some(sede => sede.cod_espe1 === selectedId);

    if (!sedeExists) {
        const sede = this.data.find(sede => sede.cod_espe1 === selectedId);
        if (sede) {
            this.Especialidadseleccionada.push(sede);
            this.formulario.controls['vr_espe1'].setValue("");
        }
    } else {
        console.log('La especialidad ya existe en la tabla.');
        this.toastr.error('¡La especialidad ya existe en la tabla.!',  this.titulo, { timeOut: 3000, progressBar: true });
    }
}
  ContratoCantDataSource: Array<any> = []
  idContrato = "";
  agregarContratoCantidad($event: any, indice: number){
    if (indice == 1 && $event != null) {
      this.idContrato = $event.value;
      console.log(this.idContrato);
      this.formulario.controls['vr_cant'].enable();
    }
    else if(indice == 2 && $event == null){
      let ContratoCant = {
        vr_cod_contra: this.idContrato,
        vr_nom_contra: "",
        vr_cant: this.formulario.value.vr_cant
      }
      let arrContrato: Array<any> = this.contratos.filter(contrato => { return contrato.vr_cod_contra == this.idContrato })
      let existenDatos: Array<any> = this.ContratoCantDataSource.filter(contrato => { return contrato.vr_cod_contra == this.idContrato })
      if (existenDatos.length === 0 || null || undefined) {
        arrContrato.find(obj => {
          ContratoCant.vr_nom_contra = obj.vr_nom_contra;
        })
        console.log(ContratoCant);
        if (this.formulario.value.vr_cant == '' || null || undefined || this.formulario.value.vr_cod_contra == '' || null || undefined) {
          
        }else{
          if (/^\d+$/.test(this.formulario.value.vr_cant)) {
            this.ContratoCantDataSource.push(ContratoCant)
            this.formulario.controls['vr_cant'].setValue("");
            this.formulario.controls['vr_cod_contra'].setValue("");
            this.formulario.controls['vr_cant'].disable();
          }
          else{
            console.log("Solo puede contener números");
            this.toastr.error('¡Solo números en "cantidad por día"!',  this.titulo, { timeOut: 3000, progressBar: true });
          }
        }

      }else{
        console.log("no puede elegir el mismo contrato");
        this.toastr.error('¡no puede elegir el mismo contrato!',  this.titulo, { timeOut: 3000, progressBar: true });
      }
    }
  }

  soloNumeros(event: KeyboardEvent, cantMax: number){
    this.config.soloNumeros(event, cantMax)
  }

  async ConfirmarGuardado() {
    if (this.formulario.valid) {
      let form = this.formulario.value
      let objprimerosdatos = {
        vr_descri1: form.vr_descri1,
        vr_intervalo1: form.vr_intervalo1.toString(),
        vr_color1: form.vr_color1,
        vr_cod_con1: form.vr_cod_con1,
        vr_tipocita1: form.vr_tipocita1,
        vr_cod_his1: form.vr_cod_his1.toString(),
        vr_edad_desde1: form.vr_edad_desde1.toString(),
        vr_edad_hasta1: form.vr_edad_hasta1.toString(),
        vr_frecuencia1: form.vr_frecuencia1.toString(),
        vr_sexo1: form.vr_sexo1
      }
      if (this.formulario.value.vr_color1 == '' || undefined || null) {
        this.formulario.controls['vr_color1'].setValue("#000000");
      }
      console.log('res guarda documento1', objprimerosdatos);
      await this.crudService.llamarProcedimientoPorParametro("guardar_ttipocon_web", objprimerosdatos).
      subscribe(
        async res=>{
          console.log('res guarda documento2', objprimerosdatos);
          console.log('res', res);
         
          await this.dataTableSedesCentroCosto.forEach(async obj => { 
            
            let objtabla = {
              vr_idtipocon: "",
              vr_idsede: "",
              vr_cod_ubi: "",
            }
            this.crudService.registrarMovimientosDelUsuario("ttipocon", 1)
            let idSede: Array<any> = await this.sede.filter(sede => { return sede.nombre1 === obj.vr_sede1 })
            idSede.find(objSede => {
              objtabla.vr_idsede = objSede.id1.toString()
            })
            let idCentroCosto: Array<any> = await this.centrocosto.filter(centrocos => { return centrocos.vr_nom_ubi === obj.vr_cod_ubi1 })
            idCentroCosto.find(objCentroCosto => {
              objtabla.vr_cod_ubi = objCentroCosto.vr_cod_ubi.toString()
            })
            objtabla.vr_idtipocon = await res.toString();

            console.log("dfsafasfsafd",objtabla);
            
            this.crudService.llamarProcedimientoPorParametro("guardar_ttipocon_sedesweb", objtabla).
            subscribe(
              res => {
                console.log("segunda respuesta RES",res);
                this.crudService.registrarMovimientosDelUsuario("ttipocon_sedes", 1)
              },
              err => {
                console.log(err);
              }
            )
          })
          await this.Especialidadseleccionada.forEach(async obj => {
            let objtabla = {
              vr_tipo_con : "",
              vr_cod_espe : ""
            }
            let idEspecialidad: Array<any> = await this.data.filter(especialidad => { return especialidad.nom_espe1 === obj.nom_espe1 })
            idEspecialidad.find(objEspecialidad => {
              objtabla.vr_cod_espe = objEspecialidad.cod_espe1.toString()
            })
            objtabla.vr_tipo_con = await res.toString();
            console.log("objespecialidades", objtabla);
            
            this.crudService.llamarProcedimientoPorParametro("guardar_ttipocon_espe_web", objtabla).
            subscribe(
              res => {
                this.crudService.registrarMovimientosDelUsuario("ttipocon_espe", 1)
                console.log("Respueta de las especialidades", res);
              },
              err => {
                console.log(err);
              }
            )
          })
          await this.ContratoCantDataSource.forEach(async obj => {
            let ContratoCant = {
              vr_tipo_con: "",
              vr_cod_contra : obj.vr_cod_contra,
              vr_cant: obj.vr_cant
            }
            ContratoCant.vr_tipo_con = await res.toString();
            
            this.crudService.llamarProcedimientoPorParametro("guardar_ttipocon_limit_web", ContratoCant).subscribe(
              res => {
                this.crudService.registrarMovimientosDelUsuario("ttipocon_limit", 1)

                console.log("Los contratos han sido guardados: ", res);
              },
              err => {
                console.log(err);
              }
            )

          })
          this.Comprobacion = true;
          this.cambiarBoton = "Guardar"
          this.toastr.success('¡Registro guardado éxitosamente!',  this.titulo, { timeOut: 3000, progressBar: true });
          this.formulario.reset()
          this.tiposdeconsultasel()
          this.dataTableSedesCentroCosto = []
          this.Especialidadseleccionada = [];
          this.ContratoCantDataSource = [];
        },
        err => {
          console.log(err);
          this.toastr.error('Estamos teniendo problemas con el servidor :/',  this.titulo, { timeOut: 3000, progressBar: true });
        }
      )
    }
  }
  vr_tipo_con: any = ""
  async ConfirmarActualizado() {
    if (this.formulario.valid) {
      let form = this.formulario.value
      let objprimerosdatos = {
        vr_tipo_con: await this.vr_tipo_con,
        vr_descri1: form.vr_descri1,
        vr_intervalo1: form.vr_intervalo1.toString(),
        vr_color1: form.vr_color1,
        vr_cod_con1: form.vr_cod_con1,
        vr_tipocita1: form.vr_tipocita1,
        vr_cod_his1: form.vr_cod_his1.toString(),
        vr_edad_desde1: form.vr_edad_desde1.toString(),
        vr_edad_hasta1: form.vr_edad_hasta1.toString(),
        vr_frecuencia1: form.vr_frecuencia1.toString(),
        vr_sexo1: form.vr_sexo1
      }
      console.log('res actualizado: ', objprimerosdatos);
      this.crudService.llamarProcedimientoPorParametro("update_ttipocon_web", objprimerosdatos ).subscribe(
        res => {
          console.log("se ha actualizado correctamente: ", res);

          this.tiposdeconsultasel();

          this.formulario.reset();
          this.formulario.controls['vr_color1'].setValue("#000000")
          this.Comprobacion =  true;
          this.saltarAlertas = false;
          this.cambiarBoton = "Guardar"
          this.dataTableSedesCentroCosto = [];
          this.Especialidadseleccionada = [];
          this.ContratoCantDataSource = [];
          this.toastr.success('Resgistro actualizado con exito!',  this.titulo, { timeOut: 3000, progressBar: true });
          this.formulario.reset()
        },
        err => {
          console.log(err);
          this.toastr.error('Estamos teniendo problemas con el servidor :/',  this.titulo, { timeOut: 3000, progressBar: true });
        }
      )
    }
  }

  onSelectionChangedddd(event) {
    const selectedRows = event.selectedRowsData;
    // console.log(selectedRows[0]);
    this.cambiarBoton = "Actualizar";
    this.Comprobacion = false;
    this.vr_tipo_con = selectedRows[0].vr_tipo_con.toString();
    this.saltarAlertas = true;
    this.formulario.patchValue({
      vr_descri1: selectedRows[0].vr_descri,
      vr_intervalo1: selectedRows[0].vr_intervalo,
      vr_color1: selectedRows[0].vr_color,
      vr_cod_con1: selectedRows[0].vr_cod_con,
      vr_tipocita1: selectedRows[0].vr_codigocita,
      vr_cod_his1: selectedRows[0].vr_cod_hi,
      vr_edad_desde1: selectedRows[0].vr_edad_desde,
      vr_edad_hasta1: selectedRows[0].vr_edad_hasta,
      vr_frecuencia1: selectedRows[0].vr_frecuencia,
      vr_sexo1: selectedRows[0].vr_sexo,
    })
    this.dataTableSedesCentroCosto = [];
    this.crudService.llamarProcedimientoPorParametro("sel_ttipocon_sedes_web", {p_idtipocon: selectedRows[0].vr_tipo_con}).subscribe(
      (res: Array<any>) => {
        // console.log("sedesactualizar", res);
        res.forEach(async sedeCentroCosDataRes => {
          let newObjSede = {
            vr_sede1: "", 
            vr_cod_ubi1: ""
          }

          let nombreSede = await this.sede.filter(sedeData => { return sedeData.id1 === sedeCentroCosDataRes.vr_sede1})
          
          
          let nombreCentroCosto = await this.centrocosto.filter(centroCostoData => { return centroCostoData.vr_cod_ubi.toString() === sedeCentroCosDataRes.vr_cod_ubi1.toString()})

          nombreSede.find(obj => {  
            newObjSede.vr_sede1 = obj.nombre1
          })
          nombreCentroCosto.find(obj => { 
            newObjSede.vr_cod_ubi1 = obj.vr_nom_ubi
          })
          
          this.dataTableSedesCentroCosto.push(newObjSede)
        })
        
      }
    )
    this.crudService.llamarProcedimientoPorParametro("sel_ttipocon_espe_web", {p_idtipocon: selectedRows[0].vr_tipo_con}).subscribe(
      (res: Array<any>) => {
        // console.log("sedesactualizar", res);
        res.forEach(async especialidadesRes => {
          let newObjEspecialidad = {
            cod_espe1: await especialidadesRes.vr_cod_espe, 
            nom_espe1: ""
          }

          let nombreEspecialidad = await this.data.filter(especialidadData => { return especialidadData.cod_espe1 === especialidadesRes.vr_cod_espe})
          
          nombreEspecialidad.find(obj => {  
            newObjEspecialidad.nom_espe1 = obj.nom_espe1
          })
          
          this.Especialidadseleccionada.push(newObjEspecialidad)
        })
        
      }
    )
    this.crudService.llamarProcedimientoPorParametro("sel_ttipocon_limit_web", {p_idtipocon: selectedRows[0].vr_tipo_con}).subscribe(
      (res: Array<any>) => {
        // console.log("sedesactualizar", res);
        res.forEach(async contratosRes => {
          let newObjContrato = {
            vr_cod_contra: await contratosRes.vr_cod_contra, 
            vr_nom_contra: "", 
            vr_cant: await contratosRes.vr_cant
          }

          let nombreContrato = await this.contratos.filter(contratoData => { return contratoData.vr_cod_contra === contratosRes.vr_cod_contra})
          
          nombreContrato.find(obj => {  
            newObjContrato.vr_nom_contra = obj.vr_nom_contra
          })
          
          this.ContratoCantDataSource.push(newObjContrato)
        })
        
      }
    )
  }
  
  BotonesOpciones(Boton: number){
    if (Boton == 1) {
      this.RealizarComprobacion()
    }
    else if(Boton == 2){
      this.formulario.reset();

      this.Comprobacion =  true;
      this.cambiarBoton = "Guardar"
      this.dataTableSedesCentroCosto = [];
      this.Especialidadseleccionada = [];
      this.ContratoCantDataSource = [];
      // this.radioButton1.nativeElement.checked = true;
      // this.formulario.controls['estado1'].setValue("1")
    }
    else if(Boton == 3){
      // this.aparecerAlerta("Redireccionando...", 2)
    }
  } 

  get vr_descri1(): any { return this.formulario.get('vr_descri1'); }
  get vr_intervalo1(): any { return this.formulario.get('vr_intervalo1'); }
  get vr_color1(): any { return this.formulario.get('vr_color1'); }
  get vr_cod_con1(): any { return this.formulario.get('vr_cod_con1'); }
  get vr_tipocita1(): any { return this.formulario.get('vr_tipocita1'); }
  get vr_cod_his1(): any { return this.formulario.get('vr_cod_his1'); }
  get vr_edad_desde1(): any { return this.formulario.get('vr_edad_desde1'); }
  get vr_edad_hasta1(): any { return this.formulario.get('vr_edad_hasta1'); }
  get vr_frecuencia1(): any { return this.formulario.get('vr_frecuencia1'); }
  get vr_sexo1(): any { return this.formulario.get('vr_sexo1'); }
  get vr_tipo_con1(): any { return this.formulario2.get('vr_tipo_con1'); }
  get vr_cod_ubi1(): any { return this.formulario2.get('vr_cod_ubi1'); }
  get vr_sede1(): any { return this.formulario2.get('vr_sede1'); }
  get vr_espe1(): any { return this.formulari2.get('vr_espe1'); }

  get sedesSeleccionadaVacia(): boolean {
    return this.dataTableSedesCentroCosto.length === 0;
  }
  get especialidadSeleccionadaVacia(): boolean {
    return this.Especialidadseleccionada.length === 0;
  }
  get ContratosSeleccionadosVacio(): boolean {
    return this.ContratoCantDataSource.length === 0;
  }

}