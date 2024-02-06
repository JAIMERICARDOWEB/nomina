import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitasSaveService {
  // Creamos un BehaviorSubject de tipo boolean
  public DetectarComponentesCerrados = new BehaviorSubject<string>("");
  constructor() { }

}
