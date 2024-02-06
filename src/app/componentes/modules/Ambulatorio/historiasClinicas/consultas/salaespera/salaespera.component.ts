import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SalaesperaService } from "../../../../../../servicios/salaespera/salaespera.service";
import { CRUDService } from '../../../../../../servicios/CRUD.service';
import { CommonModule } from '@angular/common';
import { DxDateBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

export interface PeriodicElement {
  hora_cita1: string;
  paciente1: string;
  servicio1: string;
  estado1: string;
  vr_codhistoria: string;
}

@Component({
  selector: 'app-salaespera',
  standalone: true,
  imports: [CommonModule, SharedModule, DxSelectBoxModule, DxDateBoxModule, RouterModule],
  templateUrl: './salaespera.component.html',
  styleUrls: ['./salaespera.component.scss']
})
export class SalaesperaComponent implements OnInit {
  displayedColumns: string[] = ['hora_cita1', 'paciente1', 'servicio1', 'estado1', 'vr_codhistoria'];
  clickedRows = new Set<PeriodicElement>();
  datos = [1,2,3,4,5,6,7,8,9,10];
  opcionSeleccionado: string  = '0';
  verSeleccion: string = '';

  searchModeOption = 'contains';

  searchExprOption: any = "nom_med1"

  searchTimeoutOption = 200;

  minSearchLengthOption = 0;

  showDataBeforeSearchOption = true;
 
  contactForm: FormGroup;

  nombreBoton: string = "Consultar";
  titulo: string = "Sala de espera";
  saltarAlertas: boolean = false;
  now: Date = new Date();

  
  constructor( private crudService: CRUDService, private toastr: ToastrService, private salaespera: SalaesperaService){
    this.contactForm = this.createFormGroup();
  }
  createFormGroup(){
    return new FormGroup({
      id: new FormControl("", Validators.required),
      idprofesional: new FormControl("", Validators.required)
    })
  }

  idmed1: any = {}

  traerPacientes(){
    console.log( {fecha1: this.contactForm.value.id, idmed1: this.idmed1.codigo1});
    if (this.contactForm.valid) {
      this.crudService.llamarProcedimientoPorParametro("sel_sala_esperaweb", {fecha1: this.contactForm.value.id, idmed1: this.idmed1.codigo1}).subscribe(
        res => {
          if (res.length === 0) {
            this.toastr.info('No existen pacientes en la fecha consultada', this.titulo, { timeOut: 3000, progressBar: true });
          }
          else{
            console.log(res)
            console.log(this.contactForm.value)
            this.dataSource = res
          }
        },
        err => {
          console.log(err)
        }
      )
    }
  }
  codPaciente(cod: number):void {
    console.log("el codigo del paciente es: ", cod);
  }
  dataSource: any = [];
  public data: any[] = [];


  keyword = 'nom_med1';
  public countries: any[] = [];

  traermedicos(){
    this.crudService.llamarProcedimiento("sel_tmedico").subscribe(
      res => {
        this.countries = res
        // this.countries.map(country => country.nom_med1 = `${country.nom_med1} ${country.idmed1}`);
        console.log(res)
      },
      err => console.log(err)
    )
  }

  onValueChanged(data: any) {
    // console.log(data);
    const selectedObject = this.countries.find(country => country.codigo1 === data.value);
    console.log(selectedObject);
    this.idmed1 = selectedObject
    this.salaespera.historyObjet.vr_medico = selectedObject.codigo1;
  }
  ngOnInit(): void {
    this.traermedicos()
    console.log(this.data)
  }

  datosHistoriaAdicionales(codHistoria: number, codAdmin: number): void {
    this.salaespera.historyObjet.vr_codhis_diseno = codHistoria;
    this.salaespera.historyObjet.vr_admision = codAdmin;
    const JsonConDatosAdicionalesParaHistoriaClinica = JSON.stringify(this.salaespera.historyObjet);
    const JsonEnbase64 = btoa(JsonConDatosAdicionalesParaHistoriaClinica)
    sessionStorage.setItem('Datos', JsonEnbase64)
  }

  get id(): any { return this.contactForm.get('id'); }
  get idprofesional(): any { return this.contactForm.get('idprofesional'); }
}
