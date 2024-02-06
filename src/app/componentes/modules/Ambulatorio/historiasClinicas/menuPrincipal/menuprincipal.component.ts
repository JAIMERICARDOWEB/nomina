import { Component, HostListener, OnInit } from '@angular/core';
import { CRUDService } from 'src/app/servicios/CRUD.service';
import { informacionPersonal } from 'src/app/servicios/salaespera/interface/informacionPaciente';
import { SalaesperaService } from 'src/app/servicios/salaespera/salaespera.service';

@Component({
  selector: 'app-menuprincipal',
  templateUrl: './menuprincipal.component.html',
  styleUrls: ['./menuprincipal.component.css']
})
export class MenuprincipalComponent implements OnInit {
  @HostListener('window:unload', ['$event'])
  unloadHandler(event:any) {
      this.PostCall();
  }
  
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event:any) {
      return false;
  }
  
  PostCall() {
      console.log('PostCall');
  }
  
  menuBars: boolean = true;
  menuBarsIzquierdo: boolean = false;
  admision: number = 0;
  fechaActual: Date = new Date();
  
  informacionPersonal: informacionPersonal = {
      vr_cod_pacien: 0,
      vr_id_pacien: "",
      vr_tipo_id_pacien: "",
      vr_nom1: "",
      vr_nom2: "",
      vr_apell1: "",
      vr_apell2: "",
      vr_fecha_nac: "",
      vr_emailpacien: "",
      vr_edad: "",
      vr_sexo_pacien: "",
      vr_est_civil: "",
      vr_dir_pacien: "",
      vr_tiposangre: "",
      vr_nombreocupacion: "",
      vr_nom_muni: "",
      vr_zona: "",
      vr_tel_pacien: "",
      vr_nom_ase: "",
      vr_tadmision_nom_acom: "",
      vr_tadmision_tel_acom: "",
      vr_cod_contra: 0,
      vr_tipopagador: 0,
      vr_nom_presp: "",
      vr_tel_presp: "",
      vr_par_presp: "",
      vr_tipoafiliado: "",
      vr_nivel: 0,
      vr_foto: "",
      vr_anos: 0,
      vr_meses: 0,
      vr_dias: 0,
      vr_horas: 0,
      vr_fechaserver: "",
      vr_nombredepart: ""
    }
  

  constructor(private salaEspera: SalaesperaService, private crudService: CRUDService){
    
  }
  infoUser: any = {}

  async ngOnInit(): Promise<void> {
    await this.decodeFicar()
    this.ConsultaInformacionPaciente();
  }

  decodeFicar(){
    let base64DatosHistoria: any = sessionStorage.getItem("Datos")
    // console.log(base64);
    let decode = atob(base64DatosHistoria)
    // console.log(decode);
    // console.log(JSON.parse(decode));
    this.infoUser = JSON.parse(decode)
    console.log(this.infoUser);
  }

  ConsultaInformacionPaciente(): void{
    this.crudService.llamarProcedimientoPorParametro("sel_tpacientehistoriaweb", {admision1: this.infoUser.vr_admision}).subscribe(
      res => {
        console.log(res);
        this.admision = this.infoUser.vr_admision;
        res.find((obj: informacionPersonal) => {
          this.informacionPersonal = obj;  
          let fechaNacStr: string = obj.vr_fecha_nac;
          obj.vr_fecha_nac = new Date(fechaNacStr).toLocaleDateString();
          switch (obj.vr_sexo_pacien) {
            case "F":
              obj.vr_sexo_pacien = "FEMENINO"
              break;
            case "M":
              obj.vr_sexo_pacien = "MASCULINO"
              break;
            default:
              break;
          }
        })   
      },
      err => {
        console.log(err);
        
      }
    )
    // this.salaEspera.consultaInformacionPaciente()
  }

  DesplegarInformacion(): void {
    if (this.menuBarsIzquierdo == true) {
      this.menuBarsIzquierdo = false
    }
    else if (this.menuBarsIzquierdo == false) {
      this.menuBarsIzquierdo = true
    }
    let titulo: any = document.querySelector(".titulo");
    let linea: any = document.querySelector(".lineabr");
    let InformacionPersonal: any = document.querySelector(".Informacion-Personal");

    titulo.classList.toggle("tituloCentrado");
    linea.classList.toggle("lineaActive");
    InformacionPersonal.classList.toggle("Informacion-Personal-Desplegado");

    this.salaEspera.MenuLateralIzquierdo();
  } 

  animateBars(): void {
    if (this.menuBars == true) {
      this.menuBars = false
    }
    else if (this.menuBars == false) {
      this.menuBars = true
    }
    this.salaEspera.MenuLateralDerecho();
  }
}
