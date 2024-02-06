import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ConfiguracionesService {

  public nombreVentana = new BehaviorSubject<string>('')
  public presionaTab = new BehaviorSubject<boolean>(false)


  soloNumeros(event: KeyboardEvent, cantMax: number): boolean {
    const input = event.target as HTMLInputElement;
    const valor = input.value;
    const cantDigitos = valor.length;
  
    if (event.key == 'Enter') {
      return true;
    }
  
    // Verifico si el evento corresponde a un número o una tecla especial de backspace o delete
    if (!/^\d$/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete') {
      event.preventDefault();
      return false;
    }
  
    // Verifico si el valor completo del campo contiene solo números
    if (!/^\d+$/.test(valor)) {
      input.value = valor.replace(/\D/g, '');
      return false;
    }
  
    // Valido la cantidad de dígitos según el parámetro
    if (cantDigitos >= cantMax && event.key !== 'Backspace' && event.key !== 'Delete') {
      event.preventDefault();
      return false;
    }
  
    return true;
  }

  soloLetras(event: KeyboardEvent): boolean {
    const input = event.target as HTMLInputElement;
    const valor = input.value;
    
    if (event.key == 'Enter') {
      return true;
    }
  
    
    // Verifico si el evento corresponde a una letra o una tecla especial de backspace o delete
    if (!/^[a-zA-Z]$/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete') {
      event.preventDefault();
      return false;
    }
    
    // Verifico si el valor completo del campo contiene solo letras
    if (!/^[a-zA-Z]+$/.test(valor)) {
      input.value = valor.replace(/[^a-zA-Z]/g, '');
      return false;
    }
    return true;
  }
  soloLetrasEspacio(event: KeyboardEvent): boolean {
    const input = event.target as HTMLInputElement;
    const valor = input.value;
  
    if (event.key === 'Enter') {
      return true;
    }
  
    // Verifico si el evento corresponde a una letra, espacio o una tecla especial de backspace o delete
    if (!/^[a-zA-Z\s]$/.test(event.key) && event.key !== 'Backspace' && event.key !== 'Delete') {
      event.preventDefault();
      return false;
    }
  
    // Verifico si el valor completo del campo contiene solo letras y espacios
    if (!/^[a-zA-Z\s]+$/.test(valor)) {
      input.value = valor.replace(/[^a-zA-Z\s]/g, '');
      return false;
    }
  
    return true;
  }


  
  constructor() { }

}
