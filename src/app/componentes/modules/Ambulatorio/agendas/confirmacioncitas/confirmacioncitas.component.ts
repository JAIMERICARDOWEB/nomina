import { SharedModule } from 'src/app/theme/shared/shared.module';
import { DxSelectBoxModule, DxDataGridModule, DxTreeViewComponent } from 'devextreme-angular';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CRUDService } from 'src/app/servicios/CRUD.service';
import { ConfiguracionesService } from 'src/app/servicios/configuraciones.service';
import DataSource from "devextreme/data/data_source";

@Component({
  selector: 'app-confirmacioncitas',
  standalone: true,
  imports: [CommonModule, SharedModule, DxSelectBoxModule, DxDataGridModule],
  templateUrl: './confirmacioncitas.component.html',
  styleUrls: ['../../../../../scss/estilosestandares.component.scss']
})
export class ConfirmacioncitasComponent {
  formulario!: FormGroup
  saltarAlertas: boolean = false;
  titulo = 'Confirmación de citas'
  objPacientes : any = {
    id_paciente:'',
    nombrecompleto:'',
    afiliación: '',
    Nivel: ''
  }

  constructor(private forBuilder: FormBuilder, private crudService: CRUDService, private toastr: ToastrService, private config: ConfiguracionesService){}

  ngOnInit() : void{
    this.formulario = this.forBuilder.group({
      idpacien1 : ["",],
      Nombrepaciente : ["",],
      direccion : ["",],
      email_pacit : ["",],
      afiliacion: [""],
      nivel: [""]
    })
    this.CodigoContrato()
    this.Centrodecosto()
    this.traerDiagnosticos()
    this.Codigoprestador()
  }
  diagnosticos: any = {}
  traerDiagnosticos() {
    this.crudService.llamarProcedimiento("sel_tdiagnosticoweb").subscribe(
      res => {
        this.diagnosticos = new DataSource({
          store: res,
          paginate: true,
          pageSize: 10
      });
      },
      err =>{
        console.log(err);
      }
    );
  }

  contratos: Array<any> = []
  CodigoContrato(){
    this.crudService.llamarProcedimiento("sel_tcontrato_web").subscribe(
      res =>{
        this.contratos = res
        console.log("estos son los contratos", res);
      },
      err =>{
        console.log(err);
      }
    )
  }
  prestador
  Codigoprestador(){
    this.crudService.llamarProcedimiento("sel_prestadores_web").subscribe(
      res =>{
        this.prestador = res
        console.log("estos son los prestador", res);
      },
      err =>{
        console.log(err);
      }
    )
  }

  servicios: any = {}
  traerServicios(cod_tarifa : string){
    this.crudService.llamarProcedimientoPorParametro("sel_codigo_confirma_web", {p_cod_ta: cod_tarifa} ).subscribe(
      res =>{
        this.servicios = new DataSource({
          store: res,
          paginate: true,
          pageSize: 10
      });
      console.log("estos son los servicios", res);
      },
      err =>{
        console.log(err);
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

  Contratoseleccionado(event: any){
    console.log("fdasfasdfasfdasfd",event.value);
    let filtracontrato = this.contratos.filter(contrato => { return contrato.vr_cod_contra == event.value})
    console.log(filtracontrato);
    filtracontrato.find(contra => {
      this.traerServicios(contra.vr_cod_tar)

    })
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
                // cod_pacien1: obj.vr_codpacien,
                Nombrepaciente: `${obj.vr_nom1} ${obj.vr_nom2} ${obj.vr_apell1} ${obj.vr_apell2}`,
                id_pacien1: obj.vr_id_pacien,
                direccion: obj.vr_dir_pacien,
                fecha_nac1: obj.vr_fecha_nac,
                email_pacit: obj.vr_emailpacien || '', // asignar un string vacío si emailpacien es null
                nivel: obj.vr_nivel,
                afiliacion: obj.vr_tipo_afiliado,
                // nom21: obj.vr_nom2,
                // apell11: obj.vr_apell1,
                // apell21: obj.vr_apell2,
                // telpacien1: obj.vr_tel_pacien,
                // municip1: obj.vr_codmunicipio,
                // lugar_exp1: obj.vr_lugar_exp,
                // sexo_pacien1: obj.vr_sexo_pacien,
                // zona1: obj.vr_zona,
                // est_civil1: obj.vr_est_civil,
                // ocupacion1: obj.vr_ocupacion,
                // nom_presp1: obj.vr_nom_presp,
                // tel_presp1: obj.vr_tel_presp,
                // par_presp1: obj.vr_par_presp,
                // codetnia1: obj.vr_codetnia,
                // codnivedu1: obj.vr_codnivedu,
                // coddpto1: obj.vr_coddpto,
                // codentidad1: obj.vr_codentidad,
                // tiposangre1: obj.vr_tiposangre,
                // estado1: obj.vr_estado,
              };
              this.formulario.patchValue(this.objPacientes)
              // this.formulario.patchValue(this.objPacientes)
              // if (this.formulario.value.estado1 == 1) {
              //   this.radioButton1.nativeElement.checked = true;
              //   this.formulario.controls['estado1'].setValue("1")
              // }
              // else if(this.formulario.value.estado1 == 0){
              //   this.radioButton2.nativeElement.checked = true;
              //   this.formulario.controls['estado1'].setValue("0")
              // }
              // console.log("Este es el buscador por identificación", this.objPacientes);
            })
          
          }
        },
        err => {
          this.toastr.error('Estamos teniendo problemas con el servidor :/', this.titulo, { timeOut: 3000, progressBar: true });
          // // this.aparecerAlerta("Estamos teniendo problemas con el servidor :/", 3)
          console.log(err)
        }
      )
    }
  }
  soloLetras(event: KeyboardEvent){
    this.config.soloLetras(event)
  }
  soloNumeros(event: KeyboardEvent, cantMax: number){
    this.config.soloNumeros(event, cantMax)
  }
}
