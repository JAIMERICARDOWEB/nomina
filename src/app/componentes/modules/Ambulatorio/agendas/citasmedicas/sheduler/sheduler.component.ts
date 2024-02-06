import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { 
  DxSchedulerModule, 
  DxTemplateModule,  
  DxTreeListModule, 
  DxCheckBoxModule,
  DxSelectBoxModule, 
  DxDataGridModule,
  DxDateBoxModule,
} from 'devextreme-angular';
import { AsignarcitasComponent } from '../../asignarcitas/asignarcitas.component';
import { CRUDService } from 'src/app/servicios/CRUD.service';
import { loadMessages, locale } from 'devextreme/localization';
import { CitasSaveService } from './citasSave.service';
import { AsignarCitasService } from '../../asignarcitas/asignarCitas.service';

@Component({
  selector: 'app-sheduler',
  standalone: true,
  imports: [CommonModule, SharedModule, DxSelectBoxModule, DxDataGridModule, DxSchedulerModule, DxTreeListModule, DxCheckBoxModule, DxDateBoxModule, AsignarcitasComponent],

  templateUrl: './sheduler.component.html',
  styleUrls: ['./sheduler.component.scss']
})
export class ShedulerComponent {

  // ! Constantes
  openClose: boolean = false; //* Este es del acordion lateral derecho 
  cellDuration: number; 
  cellDurations: number[]; //? Variable para el tiempo según la vista
  dataSource: any[] = [];
  minDate: Date = new Date();
  resultadoMostrado: any;
  // {
  //   EndDate: new Date("2023-12-15 09:45:00"),
  //   StartDate:  new Date("2023-12-15 07:00:00"),
  //   text: "DAVILA PEÑA JARED JOSE - ASISDE"
  // }
  allDayPanelVisible: boolean;
  views = ['workWeek', 'month'];
  currentView = this.views[0];
  showMedico = true;

  dataSheduler: Array<
  {
    data: {
      filaSeleccionada: any,
      Dias: Array<any>,
      Citas: {
        p_fecha_inicio: string | any,
        p_fecha_final: string | any,
        p_cod_medico: string | any,
        p_id_sede: string | any
      }
    }
  }>

  recursiveSelectionEnabled = true;
  now: Date = new Date();
  data: Array<any> = [];

  constructor(
    private crudService: CRUDService, 
    private citasSaveService: CitasSaveService, 
    private asignarCitasService: AsignarCitasService){
    loadMessages("afsadfasfdasfd");
    locale('es');
    this.cellDuration = 5;
    this.allDayPanelVisible = false,
    this.cellDurations = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30];
  }
  async ngOnInit(){
    this.asignarCitasService.SeAsignoCita.subscribe(data => {
      if (data) {
        this.seAsignoCitaxd(data)
      }
    });
    this.mostrasDiasdisponibles()
    console.log("hola: ", this.dataSheduler[0].data);

    // let citas = await this.dataSheduler[0].data.Citas;
    // this.dataSource = citas;
    this.consultarCitasMedicas()
  }

  seAsignoCitaxd(data){
    console.log(`El valor de la variable cambio a: ${data}`);
    this.showForm = false;
    this.showFormAsignarCitas = false;
    this.consultarCitasMedicas()
  }

  consultarCitasMedicas(){
    console.log("Se consultan las citas: ", this.dataSheduler[0].data.Citas);
    
    this.crudService.llamarProcedimientoPorParametro("sel_tcitaasig_web", this.dataSheduler[0].data.Citas).subscribe(
      (res: Array<any>) => {
        let citasArray: Array<any> = []
        // console.log("afafafdasfdasdfasfdasfdsaf",res);
        res.forEach(async cita => {
          let citaDataObj: any = { 
            text: cita.vr_nombre, 
            StartDate : await new Date(cita.vr_fechacita), 
            EndDate: await new Date(await this.sumarMinutos(cita.vr_fechacita, parseInt(cita.vr_intervalo)))
          };
          console.log("Las citas xd: ", citaDataObj);
          citasArray.push(citaDataObj)
        })

        this.dataSource = citasArray;
      },
      err => {
        console.log(err);
      }
    )
  }

  mostrasDiasdisponibles() {
    setTimeout(() => {
      let accederdias = this.dataSheduler[0].data.Dias;
      //* Objeto para mapear los números a nombres de días
      const diasSemana = {
        0: 'Domingo',
        1: 'Lunes',
        2: 'Martes',
        3: 'Miércoles',
        4: 'Jueves',
        5: 'Viernes',
        6: 'Sábado'
      };
      const resultadoMostradoStrings: string[] = [];
      accederdias.forEach((dia) => {
        let vrDia = dia.vr_dia;
        let nombreDia = diasSemana[vrDia];
        let horaInicio = dia.vr_horaini;
        let horaFin = dia.vr_horafin;
        
        //* Formato personalizado de la cadena con nombre del día, hora de inicio y hora de fin
        let textoDia = `${nombreDia}: ${horaInicio} - ${horaFin}`;
        
        resultadoMostradoStrings.push(textoDia);
      });
      this.resultadoMostrado = resultadoMostradoStrings;
    }, 3000);
  }
  

  isWeekend(date: Date) {
    const day = date.getDay();
    return day === 0 || day === 6;
  }

  isValidAppointmentDate(date: Date) {
    return !this.isHoliday(date) && !this.isWeekend(date);
  }
  
  selection = {
    allowSelectAll: false,
    mode: "multiple"
  }
  opcionesScheduler = {
    editing: {
        allowUpdating: false,
        // allowAdding: false,
        allowDeleting: false,
        allowDragging: false,
        allowResizing: false,
        // allowTimeZoneEditing: false,
        // allowRecurringEditing: false
    }
  };
  showForm: boolean = false;
  showForm2: boolean = false;
  showFormAsignarCitas: boolean = false;

  onCellDurationChange(event: any) {
    this.cellDuration = event.value; // actualiza la duración de la celda cuando se selecciona una nueva opción
  } 
  onAppointmentDblClick(event){
    // this.showForm = true;
    event.cancel = true;
    // this.dataSource.push(event.cellData)
  }
  salirOpciones(indice: number){
    switch (indice) {
      case 1:
        this.showForm = false;
        break;
      case 2:
        this.showFormAsignarCitas = false;
        break;
      case 3:
        this.showForm2 = false;
        break;
      default:
        break;
    }
  }
  clickAsignarCitasShow(){
    this.showForm = false;
    this.showFormAsignarCitas = true;
  }

  showCalendario: boolean = true;
  selectedMedico: any
  onSelectionChanged(selectedItems): any {
    this.showCalendario = true;
    // Aquí puedes manejar la lógica cuando se cambia la selección
    console.log("log de datos medicos", selectedItems.selectedRowsData[0]);
    console.log('Fila(s) seleccionada(s):', this.dataSheduler[0].data.filaSeleccionada);
    let datosMedico = selectedItems.selectedRowsData[0]
    let citasAsignadas = this.dataSource // ? esta almacena las citas
    
    // this.crudService.llamarProcedimientoPorParametro("sel_tagendamedicoweb", {idmedico1: datosMedico.IdMedico})
    // .subscribe(
    //   res => {
    //     console.log("funcion agenda 1",res);
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // )
    // * Funcion de los días
    this.crudService.llamarProcedimientoPorParametro("sel_tdisponweb", {idagenda1 : '303'})
    .subscribe(
      res => {
        console.log("funcion agenda 2",res);
      },
      err => {
        console.log(err);
      }
    )
    console.log("Esta es la prueba de las citas antes", citasAsignadas);
    this.crudService.llamarProcedimientoPorParametro("sel_tcitaasig_web", {
      p_fecha_inicio: citasAsignadas,
      p_fecha_final: citasAsignadas,
      p_cod_medico: datosMedico.CodigoMedico,
      p_id_sede: 1,
    }).subscribe(
      (res: Array<any>) => {
        res.forEach(async cita => {
          let citaDataObj: any = { 
            Text: cita.vr_nombre, 
            StartDate: cita.vr_fechacita, 
            EndDate: await this.sumarMinutos(cita.vr_fechacita, parseInt(cita.vr_intervalo))
          };
          // citaDataObj = this.dataSheduler[0].data.Citas
          console.log("1234567890000", citaDataObj);
          // this.dataSource.push(citaDataObj);
        })
      },
      err => {
        console.log(err);
      }
    )
  }

  cerrarTodo() {
    this.citasSaveService.DetectarComponentesCerrados.next(this.dataSheduler[0].data.filaSeleccionada.CodigoMedico);
    this.showCalendario = false;
    this.showMedico = false;
  }

  notifyDisableDate() {
    console.log("esta esta deshabilitada para asignaar citas");
  }

  // getDinnerTime() {
  //   return { from: 12, to: 13 };
  // }

  // isDinner(date: Date) {
  //   let DiasDisponibles: Array<{
  //     vr_dia: number;
  //     vr_horafin: string;
  //     vr_horaini: string;
  //     vr_id_agen: number;
  //     vr_item: number;
  //     vr_nombre: string;
  //   }> = this.dataSheduler[0].data.Dias
  //   const dayRanges = new Map<number, { vr_horaini: number, vr_horafin: number }>();
  //   // ! de esta manera se llenan los días en el componente 
  //   DiasDisponibles.forEach((dia) => {
  //     const vr_horaini = parseInt(dia.vr_horaini);
  //     const vr_horafin = parseInt(dia.vr_horafin);
  //     dayRanges.set(dia.vr_dia, { vr_horaini, vr_horafin });
  //   });
  //   const day = date.getDay(); // Obtener el día de la semana (0-6)
  //   const hours = date.getHours(); // Obtener las horas del día (0-23)
  
  //   if (dayRanges.has(day)) {
  //     const { vr_horaini, vr_horafin } = dayRanges.get(day)!;
  //     return (hours >= vr_horaini && hours < vr_horafin);
  //   }
  //   return false;
  // }

  onAppointmentFormOpening(e) { 
    const startDate = e.appointmentData.StartDate;
    console.log(startDate);
    e.cancel = true; 
    if (!this.isValidAppointmentDate(startDate)) {
      e.cancel = true; 
      this.showForm = true;
      console.log(this.showForm);
      this.notifyDisableDate();
    }
    else{
      e.cancel = true; 
      this.showForm2 = true;
      console.log(this.showForm);
      this.notifyDisableDate();
    }
  }// Cancela la acción predeterminada // Aquí puede hacer lo que quiera con los datos de la cita console.log(e.appointmentData); }

  isValidAppointmentInterval(startDate: Date, endDate: Date, cellDuration: number) {
    const edgeEndDate = new Date(endDate.getTime() - 1);
    if (!this.isValidAppointmentDate(edgeEndDate)) {
      return false;
    }
    const durationInMs = cellDuration * 60 * 1000;
    const date = startDate;
    while (date <= endDate) {
      if (!this.isValidAppointmentDate(date)) {
        return false;
      }
      const newDateTime = date.getTime() + durationInMs - 1;
      date.setTime(newDateTime);
    }
    return true;
  }

  isValidAppointment(component: any, appointmentData: any) {
    const startDate = new Date(appointmentData.startDate);
    const endDate = new Date(appointmentData.endDate);
    const cellDuration = component.option('cellDuration');
    return this.isValidAppointmentInterval(startDate, endDate, cellDuration);
  }

  onAppointmentAdding(e: any) {
    const isValidAppointment = this.isValidAppointment(e.component, e.appointmentData);
    if (!isValidAppointment) {
      e.cancel = true;
      this.notifyDisableDate();
    }
  }

  onAppointmentUpdating(e: any) {
    const isValidAppointment = this.isValidAppointment(e.component, e.newData);
    if (!isValidAppointment) {
      e.cancel = true;
      this.notifyDisableDate();
    }
  }

  onOptionChanged(e: any) {
    if (e.name === 'currentView') {
      this.currentView = e.value;
    }
  }

  // getHolidays() { 
  //   return this.dataSheduler[0].data.Dias;
  // }
  
  isHoliday(date: Date) {
    
    const holidays = this.dataSheduler[0].data.Dias;
    
    for (let holiday of holidays) {
      if (date >= holiday.dateInit && date <= holiday.dateEnd) {
        const day = date.getDay();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const currentTime = hours * 60 + minutes; // Convertir la hora actual a minutos
        if (holiday.Dias[day]) {
          const startHourMinutes = parseInt(holiday.Dias[day].startHour.split(':')[0]) * 60 + parseInt(holiday.Dias[day].startHour.split(':')[1]); // Convertir la hora de inicio a minutos
          const endHourMinutes = parseInt(holiday.Dias[day].endHour.split(':')[0]) * 60 + parseInt(holiday.Dias[day].endHour.split(':')[1]); // Convertir la hora de fin a minutos
          return (currentTime >= startHourMinutes && currentTime < endHourMinutes);
        }
      }
    }
    return false;
  }
  
      // let DiasDisponibles: Array<{
      //   vr_dia: number;
      //   vr_horafin: string;
      //   vr_horaini: string;
      //   vr_id_agen: number;
      //   vr_item: number;
      //   vr_nombre: string;
      // }> = this.dataSheduler[0].data.Dias
      // const dayRanges = new Map<number, { vr_horaini: number, vr_horafin: number }>();
    
      // for (let holiday of DiasDisponibles) {
      //   if (holiday.vr_dia === date.getDay()) {
      //     const hours = date.getHours(); // Obtener las horas del día (0-23)
      //     const vr_horaini = parseInt(holiday.vr_horaini);
      //     const vr_horafin = parseInt(holiday.vr_horafin);
      //     return (hours >= vr_horaini && hours < vr_horafin);
      //   }
      // }
      // const day = date.getDay(); // Obtener el día de la semana (0-6)
      // const hours = date.getHours(); // Obtener las horas del día (0-23)
      // if (dayRanges.has(day)) {
      //   const { vr_horaini, vr_horafin } = dayRanges.get(day)!;
      //   return (hours >= vr_horaini && hours < vr_horafin);
      // }

  isDisableDate(date: Date) {
    return this.isHoliday(date) 
    // || this.isWeekend(date);
  }

  isMonthView() {
    return this.currentView === 'month';
  }

  hasCoffeeCupIcon(date: Date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    // const dinnerTime = this.getDinnerTime();
    // return hours === dinnerTime.from && minutes === 0;
  }

  isDisabledDateCell(date: Date) {
    return this.isMonthView()
      ? this.isWeekend(date)
      : this.isDisableDate(date);
  }

  sumarMinutos(fecha, minutos) {
    const fechaOriginal = new Date(fecha);
    // Sumar los minutos a la fecha original
    fechaOriginal.setMinutes(fechaOriginal.getMinutes() + minutos);
    // Obtener los componentes de la fecha y hora
    var año = fechaOriginal.getFullYear();
    var mes = (fechaOriginal.getMonth() + 1).toString().padStart(2, '0'); // Sumar 1 al mes, ya que en JavaScript los meses van de 0 a 11
    var dia = fechaOriginal.getDate().toString().padStart(2, '0');
    var hora = fechaOriginal.getHours().toString().padStart(2, '0');
    var minuto = fechaOriginal.getMinutes().toString().padStart(2, '0');
    var segundo = fechaOriginal.getSeconds().toString().padStart(2, '0');

    // Formatear la fecha y hora en el nuevo formato
    var fechaFormateada = año + '-' + mes + '-' + dia + ' ' + hora + ':' + minuto + ':' + segundo;
    return fechaFormateada;
  }

  onCellClick(event: any): void {
    console.log("El propiooooooooo: ", event.cellData);
    this.asignarCitasService.infoAsignarCitas = event.cellData
    this.asignarCitasService.infoAsignarCitasFila = this.dataSheduler[0].data.filaSeleccionada
  }

  ocultarMenuLateralDerecho(){
    if (!this.openClose) {
      // const menuLateral: any = document.getElementById("titulo_container_lateral_derecho");
      // menuLateral.style.width = "300px";
      this.openClose = true;
    }
    else {
      this.openClose = false;
    }
    console.log("Hizo click: ", this.openClose);
  }


}
