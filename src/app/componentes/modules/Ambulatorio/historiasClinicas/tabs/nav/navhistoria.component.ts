import { Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subscription } from 'rxjs';


import { HistoriasComponent } from '../../../../Parametros/historias/historias.component';

import { IniciohistoriaComponent } from '../../Inicio/iniciohistoria.component';
import { RemisionComponent } from '../../tabs/tabsData/referenciaPacientes/remision.component';
import { IncapacidadComponent } from '../../tabs/tabsData/incapacidad/incapacidad.component';
import { MatDrawer } from '@angular/material/sidenav';
import { SalaesperaService } from 'src/app/servicios/salaespera/salaespera.service';
import { DataService } from 'src/app/servicios/salaespera/data.service';

export interface Itab {
  tabName: any;
  selector: any;
}

@Component({
  selector: 'app-navhistoria',
  templateUrl: './navhistoria.component.html',
  styleUrls: ['./navhistoria.component.css']
})
export class NavhistoriaComponent implements OnInit{

    @ViewChild("drawer") drawer!: MatDrawer;
  
    showFiller = false;

    tabs: any = [];
    selected = new UntypedFormControl(0);


    HistoriasComponent = HistoriasComponent;
    IniciohistoriaComponent = IniciohistoriaComponent;
    RemisionComponent = RemisionComponent;
    IncapacidadComponent = IncapacidadComponent;

    nombreVentana: string = 'Inicio';
    pulsoTab: boolean = false;
    suscripcionVentana!: Subscription;
    tabGroup: any;

    constructor( private salaEspera: SalaesperaService, private dataService: DataService) { }

    ngOnInit(): void {
      this.subscribeEvent();
          //Muestra la pantalla de Inicio al cargar la ventana
          this.addTab(true, 'Inicio', '');

        // Recibe la información de la ventana a cargar
          this.suscripcionVentana = this.dataService.activarVentana.subscribe(activacionVentana => {
            this.nombreVentana = activacionVentana.nombreVentana;
            this.pulsoTab = activacionVentana.presionaTab;
            console.log('Recibiendo Activación: ' + this.nombreVentana + ' ' + this.pulsoTab);

            if (this.pulsoTab == false){
              this.addTab(true, this.nombreVentana, '')
            };

          });

    }

    bajarContenido(): void {
      let container_example: any = document.querySelector(".example-container");
      container_example.classList.toggle("example-container-down");
    }

    subscribeEvent(): void {
      this.salaEspera.menuBars.subscribe({
        next: x => {
          this.mostrarOcultarMenu()
        }
      })
      this.salaEspera.menuBarsLeft.subscribe({
        next: x => {
          this.bajarContenido()
        }
      })
    }

    mostrarOcultarMenu(){
      this.drawer.toggle();
    }

    ngAfterViewInit() {
      // console.log('afterViewInit => ', this.tabGroup.selectedIndex);
    }

    // Destruimos la variable Observable con el nombre de la ventana para que quede vacia para la nueva asignación en el menú
    ngOnDestroy(): void {
      this.suscripcionVentana.unsubscribe();
    }


    //Colocamos quemado en TRUE para que se posicione en el Tab creado
    public selectAfterAdding: boolean = true;

    //Definimos el objeto Json vacio para el tab
    tab: { tabName: string, selector: any } = { tabName: '', selector: null };


    // Agrega un nuevo Tab
    addTab(selectAfterAdding: boolean, tabName: string, selector: any) {

      switch (tabName) {
        case 'Inicio':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.IniciohistoriaComponent : this.IniciohistoriaComponent };
          this.tabs.push(this.tab)

          break;

        case 'Certificado de incapacidad':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.IncapacidadComponent : this.IncapacidadComponent };
          this.tabs.push(this.tab)
          break;

        case 'Referencia de pacientes':
          this.tab = { tabName: tabName, selector: this.tabs.length === 0 ? this.RemisionComponent : this.RemisionComponent };
          this.tabs.push(this.tab)
          break;

          default:
          console.log('Inválido');
      }

      // Nos ubicamos en el Tab recien agregado
        this.selected.setValue(this.tabs.length + 1);

    }

    // Elimina el Tab seleccionado
    removeTab(index: number) {
      this.tabs.splice(index, 1);
      this.selected.setValue(this.tabs.length);
    }

    cambiaNombreVentanas = (tabChangeEvent: MatTabChangeEvent): void => {
      this.dataService.activarVentana.emit({nombreVentana: tabChangeEvent.tab.textLabel, presionaTab: true});
      this.dataService.nombreVentana = tabChangeEvent.tab.textLabel;
    }

    step = 0;

  setStep(index: number) {
    this.step = index;
    console.log(index)
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  cambiaNombreVentana(ventana: any){

    this.addTab(true, ventana, '');
}
}