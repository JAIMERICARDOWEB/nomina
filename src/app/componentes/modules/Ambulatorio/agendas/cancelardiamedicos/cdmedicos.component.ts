import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { CdmedicosService } from '../../../../../services/citas/cdmedicos/cdmedicos.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CRUDService } from 'src/app/servicios/CRUD.service';
import { CommonModule } from '@angular/common';
import { DxDataGridModule } from 'devextreme-angular';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cdmedicos',
  standalone: true,
  imports: [CommonModule, SharedModule, DxDataGridModule],
  templateUrl: './cdmedicos.component.html',
  styleUrls: ['../../../../../scss/estilosestandares.component.scss']
})

export class CdmedicosComponent implements OnInit {

  saltarAlertas: boolean = false;
  formulario !: FormGroup;
  events: Array<string> = [];
  mostrarLista: boolean = true;
  titulo = 'Cancelar días médicos'

  Comprobacion: boolean = true
  nombreBoton: string = "Guardar"
  nombreCdmedico !: string

  objeDocumentos: any = {
    id_med1: '',
    fecha1: ''
  }

  dataSource !: MatTableDataSource<any>;
  @ViewChild(MatSort, { static: true }) sort !: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator !: MatPaginator;

  private Validar: boolean = true

  constructor(private forBuilder: FormBuilder, private crudService: CRUDService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.formulario = this.forBuilder.group({
      id_med1: [this.objeDocumentos.id_med1, Validators.required],
      fecha1: [this.objeDocumentos.fecha1, Validators.required]
    })
    this.Agendas();
    this.tabla();
    this.saltarAlertas = true
  }
  // RealizarComprobacionModal() {
  //   if (this.Comprobacion == true) {
  //     if (this.formulario.valid) {
  //       this.nombreCdmedico = this.formulario.value.fecha1;
  //       this.DesplegarModal("Desea Cancelar el dia");
  //     }
  //     else {
  //       this.saltarAlertas = true;
  //     }
  //   }
  // }
  // RealizarComprobacion(): void {
  //   if (this.Comprobacion == true) {
  //     this.guardarformulario();
  //   }
  //   // else if (this.Comprobacion == false) {
  //   //   this.ConfirmarActualizado();
  //   // }
  // }
  agenda: any
  Agendas() {
    this.crudService.llamarProcedimiento("sel_tmedico_agendaweb").
    subscribe(
      res => {
        this.agenda = res
        console.log("Estos son los médicos", res);
        // this.countries.map(country => country.nom_med1);
      },
      err => {
        console.log(err)
      }
    )
    // this.medicos.traerCdmedicos()
  }
  llenadotabla:any
  tabla() {
    this.crudService.llamarProcedimiento("sel_tdia_bmed_web").
    subscribe(
      res => {
        this.llenadotabla = res
        console.log("esta es la tabla", res);
      },
      err =>{
        console.log(err);
        
      }
    )
  }

  DesplegarModal(mjs: string) {
    let modal: any = document.querySelector(".modal2")
    modal.style.display = "flex"
    // this.mjsConfirmacion = mjs;
  }
  OcultarModal() {
    let modal: any = document.querySelector(".modal2")
    modal.style.display = "none"
  }
  
  BotonesOpciones(){
    this.formulario.reset()
  }

  guardarformulario() {
    console.log("Valor del formulario", this.formulario.value);
    this.crudService.llamarProcedimientoPorParametro("guardar_tdiamed_web", this.formulario.value)
    .subscribe(
      res => {
        console.log(res);
        this.formulario.reset();
        this.toastr.success('Registro Guardado!', this.titulo, { timeOut: 3000, progressBar: true });
        this.tabla();
        this.crudService.registrarMovimientosDelUsuario("tdiamed", 1)
        // notify('Los datos han sido guardados con éxito', "success", 5000);
        this.saltarAlertas = false;
      },
      err => {
        console.log(err);
      }
    )

  }
  mostrarListado() {
    this.mostrarLista = !this.mostrarLista;
    if (this.mostrarLista == true) {
      this.consultar();
    }
  }
  consultar() {
    // this.medicos.traerCdmedicos().subscribe(res => {
    //   this.objeDocumentos = res;
    //   this.dataSource = new MatTableDataSource(this.objeDocumentos);
    //   this.dataSource.sort = this.sort;
    //   this.dataSource.paginator = this.paginator;
    //   this.fuenteDatos = this.objeDocumentos;
    //   console.log(this.fuenteDatos)
    //   // notify('Consultando Agenda de los Profesionales', "success", 3000);
    // },
    //   err => {
    //     console.error(err)
    //     // notify('Error al traer las Agenda de los Profesionales.  ' + err, "error", 3000);
    //   });
  }
  selectEvent(item: any) {
    // console.log("este es el item: ",item.codigo1)        
    // this.Traeragenda(item.codigo1)
    let codmed: any = document.querySelector(".idmed")
    codmed.value = item.codigo1
  }

  get id_med1(): any { return this.formulario.get('id_med1'); }
  get fecha1(): any { return this.formulario.get('fecha1'); }
}