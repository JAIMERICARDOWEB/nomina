import { TipoconsultaComponent } from './../modules/Ambulatorio/agendas/tipodeconsulta/tipoconsulta.component';
import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabChangeEvent, MatTabGroup, MatTabsModule } from "@angular/material/tabs";
import { UntypedFormControl, Validators } from '@angular/forms';
import { ConfiguracionesService } from '../../servicios/configuraciones.service';
import { Subscription } from 'rxjs';
import DashboardComponent from 'src/app/demo/dashboard/dashboard.component';
import { FacturaventaComponent } from '../facturacion/facturaventa/facturaventa.component';
import { CuentasComponent } from '../contabilidad/cuentas/cuentas.component';
import { ComprobantesComponent } from '../contabilidad/comprobantes/comprobantes.component';
import { NotacontableComponent } from '../contabilidad/notacontable/notacontable.component';
import { DocumentosComponent } from '../maestros/documentos/documentos.component';
import { CencosComponent } from '../contabilidad/cencos/cencos.component';
import { TercerosComponent } from '../maestros/terceros/terceros.component';
import { PacientesComponent } from '../modules/Ambulatorio/agendas/pacientes/pacientes.component';
import { MedicosComponent } from '../modules/Ambulatorio/agendas/profesional/medicos.component';
import { AgendasComponent } from '../modules/Ambulatorio/agendas/crearagenda/agendas.component';
import { CancelacionComponent } from '../modules/Ambulatorio/agendas/causacancelacion/cancelacion.component';
import { SalaesperaComponent } from '../modules/Ambulatorio/historiasClinicas/consultas/salaespera/salaespera.component';
import { CdmedicosComponent } from '../modules/Ambulatorio/agendas/cancelardiamedicos/cdmedicos.component';
import { FestivosComponent } from '../modules/Ambulatorio/agendas/diasfestivos/festivos.component';
import { CitasmedicasComponent } from '../modules/Ambulatorio/agendas/citasmedicas/citasmedicas.component';
import { AsignarcitasComponent } from '../modules/Ambulatorio/agendas/asignarcitas/asignarcitas.component';
import { ConfirmacioncitasComponent } from '../modules/Ambulatorio/agendas/confirmacioncitas/confirmacioncitas.component';
import { SedesComponent } from '../modules/Parametros/sedes/sedes.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, MatTabsModule],
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  @HostListener('window:unload', ['$event'])
  unloadHandler(event: any) {
      this.PostCall();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event: any) {
      return false;
  }

  PostCall() {
      console.log('PostCall');
  }
  // componentes
  dashboardcomponent = DashboardComponent
  facturaventa = FacturaventaComponent
  cuentas = CuentasComponent
  comprobantes = ComprobantesComponent
  notacontable = NotacontableComponent
  documentos = DocumentosComponent
  cencos = CencosComponent
  terceros = TercerosComponent

  pacientesComponent = PacientesComponent
  medicosComponent = MedicosComponent
  agendasComponent = AgendasComponent
  cancelacionComponent = CancelacionComponent
  cdmedicosComponent = CdmedicosComponent
  festivosComponent = FestivosComponent

  salaesperaComponent = SalaesperaComponent
  tipoconsultaComponent = TipoconsultaComponent
  citaMedicasComponent = CitasmedicasComponent
  asignarcitasComponent = AsignarcitasComponent
  confirmacioncitasComponent = ConfirmacioncitasComponent
  sedesComponent = SedesComponent



  tabs = [];
  selected = new UntypedFormControl(0);
  ventana: string = 'Inicio';
  pulsoTab: boolean = false;

  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;



  constructor(
    private configuraciones: ConfiguracionesService
  ) { }



  ngOnInit(): void {

    /*this.tab = { tabName: 'Inicio', selector: this.tabs.length === 0 ? this.dashboardcomponent : this.dashboardcomponent };
    this.tabs.push(this.tab)

    //Recibe la información de la ventana a cargar
    this.configuraciones.nombreVentana.subscribe(data => {
      this.ventana = data
    })

    this.configuraciones.presionaTab.subscribe(data => {
      this.pulsoTab = data
      if (this.pulsoTab == false) {
        this.addTab(true, this.ventana, '')
      };
    })*/

  }



  //Colocamos quemado en TRUE para que se posicione en el Tab creado
  public selectAfterAdding: boolean = true;

  //Definimos el objeto Json vacio para el tab
  private tab: {};


  // Agrega un nuevo Tab
  addTab(selectAfterAdding: boolean, tabName: string, selector: any) {

    const tabTitle = tabName;
    const existingTabIndex = this.tabGroup._tabs.toArray().findIndex(tab => tab.textLabel === tabTitle);

    // Miramos con el nombre si la pestaña ya ha sido abierta (SI la ubicamos, NO la creamos)
    if (existingTabIndex !== -1) {
      this.tabGroup.selectedIndex = existingTabIndex;

    } else {

      switch (tabName) {
        case 'Inicio':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.dashboardcomponent : this.dashboardcomponent };
          this.tabs.push(this.tab)
          break;

        case 'Factura de Venta':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.facturaventa : this.facturaventa };
          this.tabs.push(this.tab)
          break;

        case 'Plan de Cuentas':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.cuentas : this.cuentas };
          this.tabs.push(this.tab)
          break;

        case 'Comprobantes':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.comprobantes : this.comprobantes };
          this.tabs.push(this.tab)
          break;

        case 'Nota Contable':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.notacontable : this.notacontable };
          this.tabs.push(this.tab)
          break;

        case 'Definición de Documentos':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.documentos : this.documentos };
          this.tabs.push(this.tab)
          break;

        case 'Centros de Costo':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.cencos : this.cencos };
          this.tabs.push(this.tab)
          break;

        case 'Terceros':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.terceros : this.terceros };
          this.tabs.push(this.tab)
          break;
        case 'Pacientes':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.pacientesComponent : this.pacientesComponent };
          this.tabs.push(this.tab)
          break;
        case 'Profesionales':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.medicosComponent : this.medicosComponent };
          this.tabs.push(this.tab)
          break;
        case 'Crear agendas':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.agendasComponent : this.agendasComponent };
          this.tabs.push(this.tab)
          break;
        case 'Causas de cancelación':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.cancelacionComponent : this.cancelacionComponent };
          this.tabs.push(this.tab)
          break;
        case 'Cancelar días de médicos':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.cdmedicosComponent : this.cdmedicosComponent };
          this.tabs.push(this.tab)
          break;
        case 'Días festivos':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.festivosComponent : this.festivosComponent };
          this.tabs.push(this.tab)
          break;
        case 'Reportes':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.asignarcitasComponent : this.asignarcitasComponent };
          this.tabs.push(this.tab)
          break;
        case 'Infor.generales de citas':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.confirmacioncitasComponent : this.confirmacioncitasComponent };
          this.tabs.push(this.tab)
          break;
        case 'Sedes':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.sedesComponent : this.sedesComponent };
          this.tabs.push(this.tab)
          break;
        // case 'Citas médicas':
        //   this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.asignarcitasComponent : this.asignarcitasComponent };
        //   this.tabs.push(this.tab)
        //   break;
        




        case 'Sala de espera':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.salaesperaComponent : this.salaesperaComponent };
          this.tabs.push(this.tab)
          break;
        case 'Tipos de consulta':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.tipoconsultaComponent : this.tipoconsultaComponent };
          this.tabs.push(this.tab)
          break;
        case 'Citas médicas':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.citaMedicasComponent : this.citaMedicasComponent };
          this.tabs.push(this.tab)
          break;

        default:
          console.log('');
      }
    }





    // Nos ubicamos en el Tab recien agregado
    this.selected.setValue(this.tabs.length + 1);

  }


  // Elimina el Tab seleccionado
  removeTab(index: number) {
    this.tabs.splice(index, 1);
    this.selected.setValue(this.tabs.length);
  }


  cambiaNombreVentana = (tabChangeEvent: MatTabChangeEvent): void => {
    this.configuraciones.nombreVentana.next(tabChangeEvent.tab.textLabel)
  }


}
