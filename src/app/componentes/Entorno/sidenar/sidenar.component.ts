import { SalaesperaComponent } from './../../Modulos/Ambulatorio/historiasClinicas/consultas/salaespera/salaespera.component';
import { TemasService } from './../../../services/temas.service';
import { DashboardComponent } from './../../views/dashboard/dashboard.component';
import { MedicosComponent } from './../../Modulos/Ambulatorio/agendas/profesional/medicos.component'
import { PacientesComponent } from '../../Modulos/Ambulatorio/agendas/pacientes/pacientes.component';
import { AgendasComponent } from '../../Modulos/Ambulatorio/agendas/crearagenda/agendas.component';
import { FestivosComponent } from '../../Modulos/Ambulatorio/agendas/diasfestivos/festivos.component';
import { CdmedicosComponent } from '../../Modulos/Ambulatorio/agendas/cancelardiamedicos/cdmedicos.component';
import { CancelacionComponent } from '../../Modulos/Ambulatorio/agendas/causacancelacion/cancelacion.component';
import { TipoconsultaComponent } from '../../Modulos/Ambulatorio/agendas/tipodeconsulta/tipoconsulta.component';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidenar',
  templateUrl: './sidenar.component.html',
  styleUrls: ['./sidenar.component.css']
})
export class SidenarComponent {
  tabs: Array<any> = [];
  selected = new FormControl(0);
  tab: Object = {};
  public selectAfterAdding: boolean = true;
  abrirMenu!: boolean;

  dashboardComponent = DashboardComponent;
  salaesperaComponent = SalaesperaComponent;
  medicosComponent = MedicosComponent;
  pacientesComponent = PacientesComponent;
  agendasComponent = AgendasComponent;
  festivosComponent = FestivosComponent;
  cdmedicosComponent = CdmedicosComponent;
  cancelacionComponent = CancelacionComponent;
  tipoconsultaComponent = TipoconsultaComponent;
  // cdmedicosComponent = CdmedicosComponent;
  
  constructor(private router: Router, private temaService: TemasService){

  }
  ngOnInit(): void {
    if (screen.width < 1000) {
      this.abrirMenu = false
    }
    else if (screen.width >= 1000) {
      this.abrirMenu = true
    }
    this.addTab("Inicio")


  }


  addTab(tabName: string) {
    let filtro: Array<any> = this.tabs.filter((element) => {
      return element.tabName == tabName;
    })
    let busqueda = filtro.find(obj => {
      return obj
    })
    if (filtro.length === 0 ) {
      this.casosParaAbrirTab(tabName)
    }
    else {
      console.log("no esta vacio");
      if (busqueda.tabName == tabName) {
        console.log("hay una ventana con el mismo nombre", busqueda);
        this.selected.setValue((this.tabs.indexOf(busqueda)));
      }
    }
    

  }

  casosParaAbrirTab(tabName: string): void{
    switch (tabName) {
      case 'Inicio':
        this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.dashboardComponent : this.dashboardComponent};
        this.tabs.push(this.tab)
        break;
      case 'sala de espera':
        this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.salaesperaComponent : this.salaesperaComponent};
        this.tabs.push(this.tab)
        break;
      case 'Profesionales':
        this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.medicosComponent : this.medicosComponent};
        this.tabs.push(this.tab)
        break;
      case 'Pacientes':
        this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.pacientesComponent : this.pacientesComponent};
        this.tabs.push(this.tab)
        break;
      case 'Crear agenda':
        this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.agendasComponent : this.agendasComponent};
        this.tabs.push(this.tab)
        break;
      case 'Días festivos':
        this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.festivosComponent : this.festivosComponent};
        this.tabs.push(this.tab)
        break;
      case 'Cancelar días medicos':
        this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.cdmedicosComponent : this.cdmedicosComponent};
        this.tabs.push(this.tab)
        break;
      case 'Cancelación':
        this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.cancelacionComponent : this.cancelacionComponent};
        this.tabs.push(this.tab)
        break;
      case 'Tipos de consultas':
        this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.tipoconsultaComponent : this.tipoconsultaComponent};
        this.tabs.push(this.tab)
        break;
        default:
          console.log('Inválido');
    }
    // Nos ubicamos en el Tab recien agregado
    this.selected.setValue(this.tabs.length + 1);
  }
  lastPanel: any;

  togglePanel(event: any) {
    const panelHeader = event.currentTarget;
    const panelContent = panelHeader.nextElementSibling;
    const panelExpandido = panelHeader.parentNode;
  
    if (panelContent.style.height === '0px' || panelContent.style.height === '') {
      // Cierra el último panel abierto, si lo hay
      if (this.lastPanel) {
        const lastPanelHeader = this.lastPanel.previousElementSibling;
        const lastPanelExpandido = lastPanelHeader.parentNode;
        lastPanelExpandido.classList.remove('panel_extendido');
        this.lastPanel.style.height = '0px';
      }
  
      // Abre el panel actual
      panelExpandido.classList.add('panel_extendido');
      panelContent.style.height = '0px';
  
      const panelHeight = panelContent.scrollHeight;
      setTimeout(() => {
        panelContent.style.height = panelHeight + 'px';
      }, 0);
      this.lastPanel = panelContent;
    } else { 
      panelExpandido.classList.remove('panel_extendido');
      panelContent.style.height = '0px';
      this.lastPanel = null;
    }
  }


  CambiarTema(tema: number){
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
    this.selected.setValue(this.tabs.length);
  }

  CerrarSesion(){
    sessionStorage.removeItem('Token')
    this.router.navigate(['/login'])
  }
}
