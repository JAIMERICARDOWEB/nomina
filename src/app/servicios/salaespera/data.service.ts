import { Injectable, EventEmitter } from '@angular/core';


@Injectable({
    providedIn: 'root'
})
export class DataService {

    nombreVentana: string = 'Sistema Contable en la Nube';
    presionaTab: boolean = false;

    activarVentana = new EventEmitter<any>();

    constructor() { }


}