import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
// import { informacionPersonal } from "./interface/informacionPaciente";

export interface historyaObjet  {
    vr_admision: number;
    vr_fecha: string;
    vr_ano: number;
    vr_medico: number;
    vr_diagnosti: {diagnosticos: Array<any>};
    vr_codhis_diseno: number;
    vr_campos_key: {camposkey: Array<any>};
    vr_datahistoria: {data: Array<any>};
}

@Injectable({
  providedIn: 'root'
})
export class SalaesperaService {
  menuBars: Subject<void> = new Subject<void>();
  menuBarsLeft: Subject<void> = new Subject<void>();

  eventSubject: Subject<void> = new Subject<void>();
  datoshistoria: Array<any> = [];
  datosHistoriaKeyValue: Array<any> = [];

  historyObjet: historyaObjet = {
    vr_admision: 0,
    vr_fecha: "",
    vr_ano: 0,
    vr_medico: 0,
    vr_diagnosti: {diagnosticos: []},
    vr_codhis_diseno: 0,
    vr_campos_key: {camposkey: []},
    vr_datahistoria: {data: []}
  }

  codigoHistoria: number = 0;


  constructor() { }

  saveHistory(): void{
    this.eventSubject.next();
  }

  // sendHistory(historiaClinica: any){
  //   return this.http.post<any[]>(this.URL + '/guardarhistoriadatos', historiaClinica, {headers: this.headers});
  // }

  MenuLateralDerecho(): void{
    this.menuBars.next();
  }
  MenuLateralIzquierdo(): void{
    this.menuBarsLeft.next();
  }
}
