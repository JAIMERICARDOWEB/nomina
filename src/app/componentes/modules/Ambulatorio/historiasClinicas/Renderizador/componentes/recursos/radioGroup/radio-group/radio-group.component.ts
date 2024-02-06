import { Component, OnInit } from '@angular/core';
import { resourceData } from '../../../../principal/renderizador-principal/renderizador-principal.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SalaesperaService } from 'src/app/servicios/salaespera/salaespera.service';

@Component({
  selector: 'app-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrls: ['./radio-group.component.css']
})
export class RadioGroupComponent implements resourceData, OnInit {

  public formularioHistorias: FormGroup; // declaramos el formulario general

  data: any;

  datosSelector: any;

  constructor(private formBuilder: FormBuilder, private salaEspera: SalaesperaService) {
    this.formularioHistorias =  formBuilder.group({})
   }

  ngOnInit(): void {
    this.subscribeEvent();
    this.datosSelector = this.data.vr_opciones_dhd.values;
    this.crearFormulario();
  }

  subscribeEvent(): void {
    this.salaEspera.eventSubject.subscribe({
      next: x => {
        this.submit()
      }
    })
  }

  crearFormulario(): void {
    this.formularioHistorias.addControl(this.data.vr_name_dhd, this.formBuilder.control(''));
  }
  submit(){
    this.salaEspera.datoshistoria.push(this.formularioHistorias.value);
    if (this.data.vr_key_dhd != null) {
      let cod: any = {};
      let valueForm = this.formularioHistorias.value;
      cod.codcampo = this.data.vr_key_dhd;
      for (const [key, value] of Object.entries(valueForm)) {
        cod.valor = value;
        console.log(`${key}: ${value}`);
      }
      
      this.salaEspera.datosHistoriaKeyValue.push(cod);
    }
    // console.log(this.formularioHistorias.value);
  }
}
