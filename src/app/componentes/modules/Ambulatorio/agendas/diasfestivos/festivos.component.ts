import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule, registerLocaleData } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { CRUDService } from 'src/app/servicios/CRUD.service';
import { ToastrService } from 'ngx-toastr';
import { DxSelectBoxModule, DxCalendarModule } from "devextreme-angular";
@Component({
  selector: 'app-festivos',
  standalone: true,
  imports: [CommonModule, SharedModule, DxSelectBoxModule, DxCalendarModule],
  templateUrl: './festivos.component.html',
  styleUrls: ['../../../../../scss/estilosestandares.component.scss']
})
export class FestivosComponent implements OnInit {

  formulario !: FormGroup;
  saltarAlertas: boolean = false;
  currentValue: any = new Date();
  minDateValue: any | null = null;
  maxDateValue: any | null = null;
  disabledDates: any | null = null;

  titulo = 'Días Festivos'

  objeDocumentos: any = {
    fecha1: ''
  }

  objDocumentos: any = {
    vr_con_diapk: 0,
    vr_fecha: ''
  }
  weekDays : { id: number; text: string }[] = [
    { id: 0, text: 'Domingo' },
    { id: 1, text: 'Lunes' },
    { id: 2, text: 'Martes' },
    { id: 3, text: 'Miércoles' },
    { id: 4, text: 'Jueves' },
    { id: 5, text: 'Viernes' },
    { id: 6, text: 'Sábado' },
  ];

  weekNumberRules: string[] = [
    'auto', 'Primer Día', 'Primeros Cuatros Días', 'Semana Completa'
  ];

  cellTemplate = 'cell';

  holidays: any = [[1, 0], [4, 6], [25, 11]];

  zoomLevels: string[] = [ 'month', 'year', 'decade', 'century', ];

  constructor(private forBuilder: FormBuilder, private crudService: CRUDService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.formulario = this.forBuilder.group({
      fecha1: [this.objeDocumentos.fecha1, Validators.required]
    })
    this.consultar();
  }

  BotonesOpciones(){
    this.formulario.reset()
  }


  festivos: Date[] = [];

  consultar() {
    this.crudService.llamarProcedimiento('sel_tdia_festweb').subscribe(
      res => {
        console.log("Estos son los días festivos", res);
  
        this.festivos = res.map((festivo: any) => {
          const fechaEnColombia = new Date(`${festivo.vr_fecha}T00:00:00`);
          fechaEnColombia.setUTCHours(fechaEnColombia.getUTCHours()); // Ajustar a GMT-5 (Colombia)
          return fechaEnColombia;
        });
      },
      err => {
        console.log(err);
      }
    );
  }
  

  getCellStyle(cellData: any): string {
    const cellDate = new Date(cellData.date);
    if (this.festivos.some(festivo => festivo.getTime() === cellDate.getTime())) {
      return 'festivo-cell'; // Aplica una clase CSS específica para días festivos
    }
    return '';
  }
  
  

  ConfirmarGuardado(){
    console.log(this.formulario.value);
    if (this.formulario.valid) {
      this.crudService.llamarProcedimientoPorParametro("guardar_tdiafest_web", {vr_fecha: {vr_fecha: this.formulario.value.fecha1}}).subscribe(
        res => {
          console.log(res);
          this.formulario.reset();
          this.saltarAlertas = false;
          this.toastr.success('Registro Guardado!', this.titulo, { timeOut: 3000, progressBar: true });
          this.consultar();
          this.crudService.registrarMovimientosDelUsuario("tdiafest", 1)
        },
        err => {
          this.toastr.error('Este día ya esta guardado!', this.titulo, { timeOut: 3000, progressBar: true });
          console.log(err)
          // notify('Error al guardar, el servidor dejo de responder', "error", 3000);
        }
      )
    }
    else {
      // this.aparecerAlerta("Complete los campos que son requeridos", 2)
      this.saltarAlertas = true;
    }
  }
  notificacionRegistro(msjNotify: string):void{
    let notify: any = document.querySelector(".notify")
    notify.textContent = msjNotify;
    notify.style.display = "block";
    setTimeout(() => {
      notify.style.display = "none";
    }, 3000);
  }

  get fecha1(): any { return this.formulario.get('fecha1'); }
}