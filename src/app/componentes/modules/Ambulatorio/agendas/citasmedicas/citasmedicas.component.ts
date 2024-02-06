import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import notify from 'devextreme/ui/notify';
import { 
  DxSchedulerModule, 
  DxTemplateModule,  
  DxTreeListModule, 
  DxCheckBoxModule,
  DxSelectBoxModule, 
  DxDataGridModule,
  DxDateBoxModule,
  
} from 'devextreme-angular';
import { locale, loadMessages } from 'devextreme/localization';
import esMessages from 'devextreme/localization/messages/es.json';
import { CRUDService } from 'src/app/servicios/CRUD.service';
import { AsignarcitasComponent } from '../asignarcitas/asignarcitas.component';
import { CitasShedulerDirective } from './citas-sheduler.directive';
import { ShedulerComponent } from './sheduler/sheduler.component';
import { CitasSaveService } from './sheduler/citasSave.service';
import { AsignarCitasService } from '../asignarcitas/asignarCitas.service';

@Component({
  selector: 'app-citasmedicas',
  standalone: true,
  imports: [CommonModule, SharedModule, DxSelectBoxModule, DxDataGridModule, ShedulerComponent, DxSchedulerModule, CitasShedulerDirective, DxTreeListModule, DxCheckBoxModule, DxDateBoxModule, AsignarcitasComponent],
  templateUrl: './citasmedicas.component.html',
  styleUrls: ['./citasmedicas.component.scss']
})
export class CitasmedicasComponent {

  // ! Variables 
  @ViewChild(CitasShedulerDirective) dynamic: CitasShedulerDirective; // llamar Directiva con el ViewChild

  cellDuration: number; 
  allDayPanelVisible: boolean;
  // currentDate: Date = new Date();

  now: Date = new Date();
  expandedRowKeys = [1, 2, 3]; // Puedes ajustar las claves iniciales a expandir según tus necesidades
  selectedRowKeys: number[] = []; // Aquí puedes mantener un seguimiento de las filas seleccionadas
  // recursiveSelectionEnabled = true;

  calculateDoctors(data) {
    return data.doctors.map(doctor => doctor.Name).join(', ');
  }
  showCalendario: boolean = true;
  selectedDoctorName: any;
 

  // ! aqui empieza el codigo
  openClose: boolean = false;

  constructor(
    private crudService: CRUDService,
    private citasSaveService: CitasSaveService
  ) {
    loadMessages(esMessages);
    locale('es');
  }

  ngOnInit(): void {
    this.citasSaveService.DetectarComponentesCerrados.subscribe(data => {
      console.log(`El valor de la variable cambio a: ${data}`);
      this.removerCodigoMedico(data)
    });
    this.consultarProfesionales();
    // Organizar los datos para el dataSource del dx-scheduler
    // this.dataSource = this.resultados.map((resultado) => ({
    //   Text: resultado.sede,
    //   StartDate: this.getDateForDayAndTime(resultado.dia, resultado.horaini),
    //   EndDate: this.getDateForDayAndTime(resultado.dia, resultado.horafin),
    //   AllDay: false,
    //   RecurrenceRule: null,
    //   RecurrenceException: null
    // }));
  }


  obtenerFechaActual() {
    var fechaActual = new Date();
    var año = fechaActual.getFullYear();
    var mes = fechaActual.getMonth() + 1;
    var dia = fechaActual.getDate();
  
    // Formatear la fecha en el formato deseado: "YYYY-MM-DD"
    var fechaFormateada = año + '-' + (mes < 10 ? '0' + mes : mes) + '-' + (dia < 10 ? '0' + dia : dia);
  
    return fechaFormateada;
  }

  // obtenerFechaActualMenos2Dias(){
  //   // Obtener fecha actual
  //   var fechaActual = new Date();

  //   // Restar dos días a la fecha actual
  //   fechaActual.setDate(fechaActual.getDate() - 2);

  //   // Obtener los componentes de la fecha
  //   var año = fechaActual.getFullYear();
  //   var mes = fechaActual.getMonth() + 1; // Los meses comienzan desde 0, por lo que se suma 1
  //   var dia = fechaActual.getDate();

  //   // Formatear la fecha en el formato deseado: "YYYY-MM-DD"
  //   var fechaFormateada = año + '-' + (mes < 10 ? '0' + mes : mes) + '-' + (dia < 10 ? '0' + dia : dia);

  //   console.log(fechaFormateada); 
  //   return fechaFormateada
  // }

  async onSelectionChanged(selectedItems) {
    this.showCalendario = true;
    // Aquí puedes manejar la lógica cuando se cambia la selección
    console.log('Fila(s) seleccionada(s):', selectedItems.selectedRowsData);
    let datosMedico = selectedItems.selectedRowsData[0]
    let DataCitasAgendaMedico: {
      filaSeleccionada: any,
      Dias: Array<any>,
      Citas: any
    } = {
      filaSeleccionada: {},
      Dias: [],
      Citas: {}
    }
    DataCitasAgendaMedico.filaSeleccionada = selectedItems.selectedRowsData[0]
    console.log("000000000", DataCitasAgendaMedico.filaSeleccionada);
    // return [
    //   {dateInit: new Date(2023, 5, 0), dateEnd: new Date(2024, 0, 15), Dias: { 1: {startHour: 8, endHour: 17}, 3: {startHour: 12, endHour: 17} } },
    //   {dateInit: new Date(2024, 5, 0), dateEnd: new Date(2025, 0, 15), Dias: { 2: {startHour: 8, endHour: 17}, 4: {startHour: 12, endHour: 17} } }
    // ];
    await this.crudService.llamarProcedimientoPorParametro("sel_tagenda_id_disponibles_web", {
      p_id_med: datosMedico.IdMedico, 
      p_fecha_ini: this.obtenerFechaActual(),
      p_id_sede: localStorage.getItem("id_sede")
    })
    .subscribe(
      async (res: Array<{
        vr_fecha_fin: string,
        vr_fecha_ini: string,
        vr_id_agen: string
      }>) => {
        let agendasMedico: Array<{
          dateInit: Date | string | any,
          dateEnd: Date | string | any,
          Dias: {} 
        }> = []

        await res.forEach(async agenda => {
          let objAgenda: {
            dateInit: Date | string | any,
            dateEnd: Date | string | any,
            Dias: {} 
          } = {
            dateInit: "",
            dateEnd: "",
            Dias: {}
          } 

          
          objAgenda.dateEnd = await new Date(agenda.vr_fecha_fin);
          objAgenda.dateInit = await new Date(this.validarFechaSiEsMenorQueLaActual(agenda.vr_fecha_ini));

          console.log("Este es el id de la agenda: ",  agenda.vr_id_agen);
          

          await this.crudService.llamarProcedimientoPorParametro("sel_tdisponweb", {idagenda1 : agenda.vr_id_agen})
          .subscribe(
            async (res: Array<{
              vr_id_agen: number,
              vr_item: number,
              vr_dia: number,
              vr_horaini: string,
              vr_horafin: string,
              vr_nombre: string
            }>) => {
              // DataCitasAgendaMedico.Dias = res
              let dia = {}
              await res.forEach(async diaDisponible => {
                dia[diaDisponible.vr_dia] = {
                  startHour: diaDisponible.vr_horaini,
                  endHour: diaDisponible.vr_horafin
                }
              })
              objAgenda.Dias = await dia;

              await agendasMedico.push(objAgenda)
            },
            err => {
              console.log(err);
            }
          )
        })
        console.log("funcion agenda 1", agendasMedico);
        DataCitasAgendaMedico.Dias = agendasMedico;

        DataCitasAgendaMedico.Citas = {
          p_fecha_inicio: this.obtenerFechaActual(),
          p_fecha_final: "2024-09-27",
          p_cod_medico: datosMedico.CodigoMedico,
          p_id_sede: "1",
        }

        // ? Aqui estaba la consulta de las citas medicas
        if (this.validarClaveEnObjeto(selectedItems.selectedRowsData[0], "IdMedico")) {
          await this.generateComponent(DataCitasAgendaMedico)
        }
        const selectedItemss = selectedItems.selectedRowsData;

        // Obtén los índices de los ítems seleccionados en el array de datos
        const indicesToRemove = selectedItemss.map((item) => this.data.indexOf(item));
        
        // Elimina los ítems del array de datos
        const itemsToRemove = indicesToRemove.map((index) => this.data[index]);
        indicesToRemove.forEach((index) => this.data.splice(index, 1));
        
        // Realiza alguna acción con los ítems seleccionados, por ejemplo, imprimir en la consola
        
        // Inserta los elementos eliminados después de esperar 3 segundos
        itemsToRemove.forEach((item, i) => {
          setTimeout(() => {
            // Inserta una copia del elemento nuevamente en la misma posición
            this.data.splice(indicesToRemove[i], 0, { ...item });
        
            // Puedes imprimir en la consola para verificar
            console.log('Elemento insertado de nuevo:', { ...item });
          }, 300); // i * 300 representa la espera entre cada inserción
        });
      },
      err => {
        console.log(err);
      }
    )
    

    

    
    

  }
    // Función para verificar si una clave existe en el objeto
    validarClaveEnObjeto(objeto, clave) {
      return clave in objeto;
    }

    validarFechaSiEsMenorQueLaActual(fecha: string) {
      var fechaActual = new Date();
      var fechaPasada = new Date(fecha);
    
      if (fechaPasada < fechaActual) {
        // La fecha pasada es menor que la fecha actual
        var año = fechaActual.getFullYear();
        var mes = fechaActual.getMonth() + 1;
        var dia = fechaActual.getDate();
    
        // Formatear la fecha actual en el formato deseado: "YYYY-MM-DD"
        var fechaFormateada = año + '-' + (mes < 10 ? '0' + mes : mes) + '-' + (dia < 10 ? '0' + dia : dia);
    
        return fechaFormateada;
      } else {
        // La fecha pasada es mayor o igual que la fecha actual
        return fecha;
      }
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
  recursiveSelectionEnabled = true;


  data: Array<any> = [];
  selection = {
    allowSelectAll: false,
    mode: "multiple"
  }
  
  consultarProfesionales() {
    this.crudService.llamarProcedimientoPorParametro("sel_tespecialidades_tagenda_web", { p_cod_sede: "43" }).subscribe(
      async res => {
        console.log("esta es la consulta de las agendas", res);
        let i: number = 1;
        await res.forEach(element => {
          let objProfecionalEspecialidad: {
            IDXD: number,
            Head_ID: number,
            Full_Name: string,
            Cod_espe: string
          } = {
            IDXD: 0,
            Head_ID: 0,
            Full_Name: '',
            Cod_espe: ''
          };
          objProfecionalEspecialidad.IDXD = i;
          objProfecionalEspecialidad.Head_ID = 0;
          objProfecionalEspecialidad.Full_Name = element.vr_nombre_espe;
          objProfecionalEspecialidad.Cod_espe = element.vr_cod_espe;
          i++;
          // console.log("Este es objProfecionalEspecialidad", objProfecionalEspecialidad);
          this.data.push(objProfecionalEspecialidad);
        });
        console.log(this.data);

        await res.forEach(async elementRes => {
          await this.crudService.llamarProcedimientoPorParametro("sel_tmedico_cod_espe_web", { p_cod_espe: elementRes.vr_cod_espe}).subscribe(
            async respuesta => {
              await respuesta.forEach(element => {
                let objProfecional: {
                  IDXD: number,
                  Head_ID: number,
                  Full_Name: string,
                  Cod_espe_med: string,
                  CodigoMedico: string,
                  IdMedico: string,
                } = {
                  IDXD: 0,
                  Head_ID: 0,
                  Full_Name: '',
                  Cod_espe_med: '',
                  CodigoMedico: '',
                  IdMedico: '',
                };
  
                objProfecional.IDXD = i;
                objProfecional.Full_Name = element.vr_nom_med;
                objProfecional.Cod_espe_med = element.vr_cod_espe;
                objProfecional.CodigoMedico = element.vr_codigo;
                objProfecional.IdMedico = element.vr_id_med;
                
                const objEspecialidad = this.data.filter(obj => { return obj.Cod_espe === element.vr_cod_espe})
                if (objEspecialidad.length > 0) {
                  const indice = this.data.findIndex((obj) => obj === objEspecialidad[0]);
                  // console.log("Índice: ", indice);
                  objEspecialidad.find(obj => {
                    objProfecional.Head_ID = indice + 1;/* parseInt(element.vr_cod_espe, 10); */
                  })
                }
   
                // ? chatgpt aqui va la logica o donde quiero que me ayudes  
                i++;
                // console.log("profesionales", objProfecional);
                this.data.push(objProfecional);
                // console.log("Data: ", this.data);
                
              });
              // console.log("ultimo log: ", this.data);
            },
            err => {
              console.log(err);
            }
          )
        });
        
      },
      err => {
        console.log(err);
      }
    );
  }

  availableColor = 'green';

  getAvailableDays(currentDate: Date): boolean {
    const dayOfWeek = currentDate.getDay(); // Obtener el día de la semana (0: domingo, 1: lunes, ...)
    const startTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 8, 0); // Hora de inicio (8 am)
    const endTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 18, 0); // Hora de fin (6 pm)
  
    return (
      currentDate >= new Date(2023, 8, 19) && // Verificar si la fecha está dentro del rango (19/09/2023 hasta 22/09/2023)
      currentDate <= new Date(2023, 8, 22) &&
      (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) && // Verificar si es lunes, miércoles o viernes
      currentDate >= startTime && // Verificar si está dentro del horario de 8 am a 6 pm
      currentDate <= endTime
    );
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

  CodigosMedicos: Array<string> = []

  removerCodigoMedico(codigo: string){

    // Obtén el índice del elemento que quieres eliminar
    const indiceARemover = this.CodigosMedicos.indexOf(codigo);

    // Verifica si el elemento está en el array antes de intentar eliminarlo
    if (indiceARemover !== -1) {
      // Utiliza splice para eliminar el elemento en el índice encontrado
      this.CodigosMedicos.splice(indiceARemover, 1);

    } else {
      console.log("El elemento no está presente en el array.");
    }
  }

  generateComponent(data: {
    filaSeleccionada: any,
    Dias: Array<any>,
    Citas: Array<any>
  }): void{
    
    if (this.CodigosMedicos.includes(data.filaSeleccionada.CodigoMedico)) {
      console.log("La agenda del medico ya existe");
    }
    else{
      this.CodigosMedicos.push(data.filaSeleccionada.CodigoMedico)
      if (this.dynamic) {
        const ViewContainerRef = this.dynamic.viewContainerRef; // viewContainerRef Representa un contenedor donde se pueden adjuntar una o más vistas a un componente.
        
        const componentRef = ViewContainerRef.createComponent<resourceData>(ShedulerComponent); // El metodo CreateComponent() se encarga de traer el componente a la vista.
        componentRef.instance.dataSheduler = [{data}]; // llenamos los datos de la instancia con nuestros datos
  
      } else {
        console.log("el objeto de la directiva es indefinido");
      }
    }
  }

}
export interface resourceData{ // exporto la interfas para usarla en otros componentes
  dataSheduler: any;
}
