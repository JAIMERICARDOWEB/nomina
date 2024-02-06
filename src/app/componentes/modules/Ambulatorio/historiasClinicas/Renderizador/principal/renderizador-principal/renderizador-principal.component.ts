import { AfterViewInit, Component, ViewChild } from '@angular/core';

import { GroupBoxComponent } from '../../componentes/recursos/groupBox/group-box/group-box.component';
import { TextBoxComponent } from '../../componentes/recursos/textBox/text-box/text-box.component';
import { MemoComponent } from '../../componentes/recursos/memo/memo/memo.component';
import { CajaNumericaComponent } from '../../componentes/recursos/cajaNumerica/caja-numerica/caja-numerica.component';
import { ComboBoxComponent } from '../../componentes/recursos/comboBox/combo-box/combo-box.component';
import { CheckBoxComponent } from '../../componentes/recursos/checkBox/check-box/check-box.component';
import { FechaComponent } from '../../componentes/recursos/fecha/fecha/fecha.component';
import { RadioGroupComponent } from '../../componentes/recursos/radioGroup/radio-group/radio-group.component';

import { DynamicComponentDirective } from '../../directiva/dynamic-component.directive';
import { ActivatedRoute, Params } from '@angular/router';
import { SalaesperaService } from 'src/app/servicios/salaespera/salaespera.service';
import { CRUDService } from 'src/app/servicios/CRUD.service';

@Component({
  selector: 'app-renderizador-principal',
  templateUrl: './renderizador-principal.component.html',
  styleUrls: ['./renderizador-principal.component.css']
})
export class RenderizadorPrincipalComponent implements AfterViewInit {

  @ViewChild(DynamicComponentDirective) dynamic!: DynamicComponentDirective; // llamar Directiva con el ViewChild

  // [headers: variables globales]
  resource: Array<any> = [] // declaro la varible de forma global para usarla en otras funciones

  datoshistoria: Array<any> = [];

  infoUser: any = {}

  constructor(private salaEspera: SalaesperaService, private rutaActiva: ActivatedRoute, private crudService: CRUDService) {}
  ngOnInit(): void {
    
    let base64DatosHistoria: any = sessionStorage.getItem("Datos")
    // console.log(base64);
    let decode = atob(base64DatosHistoria)
    // console.log(decode);
    // console.log(JSON.parse(decode));
    this.infoUser = JSON.parse(decode)
    console.log(this.infoUser);
  }

  ngAfterViewInit(): void {
    
    const codigoHistoria = this.infoUser.vr_codhis_diseno;
    this.ConsulteHitory(codigoHistoria);
    // this.ConsulteHitory(7);
  }

  ConsulteHitory(codigoHistoria: number): void{
    console.log("este es el codigo de la historia: ", codigoHistoria);
    
    this.crudService.llamarProcedimientoPorParametro("sel_t_historia_disenoweb", {idhist: codigoHistoria}).subscribe(
      res => {
        console.log("esto si se esta ejecutando", res);
        
        this.spread(res);
        this.datoshistoria = res;
      },
      err =>{
        console.log(err);
      }
    )
  }

  generateComponent(numeroComponentes: number): void{
    if (this.dynamic) {
      const ViewContainerRef = this.dynamic.viewContainerRef; // viewContainerRef Representa un contenedor donde se pueden adjuntar una o más vistas a un componente.
      
      const componentRef = ViewContainerRef.createComponent<resourceData>(this.resource[numeroComponentes].component); // El metodo CreateComponent() se encarga de traer el componente a la vista.

      componentRef.instance.data = this.resource[numeroComponentes].data; // llenamos los datos de la instancia con nuestros datos
    } else {
      console.log("el objeto de la directiva es indefinido");
    }
  }

  numeroComponentes(resource: Array<any>): void{
    let numberMaxObject: number = resource.length; // esta variable contiene la longitud del array o cuantos objetos contiene

    let i: number = 0; // inicializo la varible i en cero asi llama al primer objecto con un orden asendente

    while (i < numberMaxObject) { // mientras i sea menor que la longitud del array que aumente +1 y que genere ese componente
      this.generateComponent(i);
      // console.log(i); #### muestra los numeros en incremento
      i++;
    }
  }

  spread(resource: Array<any>): void{
    //let resources: Array<any> = [] // esta variable va a contener los datos con su respectivo componente.
    let datos = resource  // estos datos son llenados con la consulta a la base de datos
    let component: any // esta variable definira el componente a utilizar

    datos.forEach(element => { // accedo a los datos y uso un ciclo para definir los datos en 'resources'
        switch (element.vr_tipoctrl_dhd) { // con el switch dependiento el tipo de dato defino el componente.
          case "GROUP BOX":
            component = GroupBoxComponent
            break;
          case "MEMO":
            component = MemoComponent
            break;
          case "TEXT BOX":
            component = TextBoxComponent
            break;
          case "CAJA NUMERICA":
            component = CajaNumericaComponent
            break;
          case "COMBO BOX":
            component = ComboBoxComponent
            break;
          case "CHECK BOX":
            component = CheckBoxComponent
            break;
          case "FECHA":
            component = FechaComponent
            break;
          case "RADIO GROUP":
            component = RadioGroupComponent
            break;
          default:
            break;
        }

        this.resource.push({ // inserto los datos de 'element' que viene cada que carga el ciclo.
          data: element, // 'data' se usa para llevar los datos a cada componente.
          component: component // component se usa para definir el componente que se va a llamar.
        })
    })
      // console.log(this.resource); #### muestra los objectos con su respectivo componente
      this.numeroComponentes(resource); // ejecuto la funcion luego de realizar todas las validaciones
  }

  saveHistory(): void{

    this.salaEspera.saveHistory();  // recoje los datos de los demas componentes
    this.infoUser.vr_datahistoria.data = this.salaEspera.datoshistoria; // llenas los datos en el arreglo de las historias

    var date: Date = new Date();

    this.infoUser.vr_ano = date.getFullYear(); // le pasamos el año actual
    this.infoUser.vr_fecha = date.toISOString(); // fecha y hora en que se guardo la historia

    // let numeroDiagnosticos: number = this.infoUser.vr_diagnosti.length;
    let i: number = 1;

    this.infoUser.vr_diagnosti.diagnosticos.forEach((obj: any) => {
        obj.orden = i;
        i++;
    })

    // this.datoshistoria.forEach(obj => {
    //   if(obj.vr_key_dhd != null){
    this.infoUser.vr_campos_key.camposkey = this.salaEspera.datosHistoriaKeyValue;
    //   }
    // })
    this.crudService.llamarProcedimientoPorParametro("guardar_t_historia_datosweb", this.infoUser).subscribe(
      res =>{
        console.log(res);
        this.salaEspera.datoshistoria = []
        i = 1;
      },
      err => {
        console.error(err)
        this.salaEspera.datoshistoria = []
        i = 1;
      }

    )

    console.log(this.infoUser)
    
    this.salaEspera.datoshistoria = []
    this.salaEspera.datosHistoriaKeyValue = []
    i = 1;

  }

}

export interface resourceData{ // exporto la interfas para usarla en otros componentes
  data: any;
}
