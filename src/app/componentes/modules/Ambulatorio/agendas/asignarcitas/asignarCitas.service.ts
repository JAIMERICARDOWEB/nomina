import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsignarCitasService {

  infoAsignarCitas: any = {};
  infoAsignarCitasFila: any = {};

  SeAsignoCita = new BehaviorSubject<boolean>(false);

  constructor() { }

}
