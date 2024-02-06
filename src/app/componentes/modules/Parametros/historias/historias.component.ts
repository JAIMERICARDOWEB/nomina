import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

import { FormControl, FormGroup, Validators } from "@angular/forms";
@Component({
  selector: 'app-historias',
  templateUrl: './historias.component.html',
  styleUrls: ['./historias.component.css']
})
export class HistoriasComponent implements OnInit {
  data: any;
  contactForm!: FormGroup;
  
  constructor() {
    this.contactForm = this.createFormGroup();
  }

  ngOnInit(): void {
    console.log(this.data)
  }

  createFormGroup(){
    return new FormGroup({
      vr_codhd_dhd:          new FormControl(0),
      vr_name_dhd:           new FormControl(''), 
      vr_etiqueta_dhd:       new FormControl(''),
      vr_tipoctrl_dhd:       new FormControl(''),
      vr_tipodato_dhd:       new FormControl(''),
      vr_longdato_dhd:       new FormControl(0),
      vr_tamano_dhd:         new FormControl(0),
      vr_orden_dhd:          new FormControl(0),
      vr_opciones_dhd:       new FormControl(0),
      vr_enable_dhd:         new FormControl(),
      vr_visible_dhd:        new FormControl(),
      vr_codpadre_dhd:       new FormControl(0),
      vr_estado_dhd:         new FormControl(),
      vr_tipoitem_dhd:       new FormControl(0),
      vr_valorini_dhd:       new FormControl(''),
      vr_obligatorio_dhd:    new FormControl(),
      vr_key_dhd:            new FormControl(0),
      vr_etiqueta_repor_dhd: new FormControl(''),
      vr_sexo_pacien_dhd:    new FormControl(''),
      vr_dbdecimal_dhd:      new FormControl(),
      vr_referen_paci_dhd:   new FormControl()
    })
  }

  saveHistoria(){
  //   if (this.contactForm.valid) {
  //     Swal.fire({
  //       title: '¿Desea registrar estos datos?',
  //       showDenyButton: true,
  //       showCancelButton: true,
  //       confirmButtonText: 'Guardar',
  //       confirmButtonColor: 'chartreuse',
  //       denyButtonText: `Salir`,
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         this.historiasService.guardarHistoria(this.contactForm.value).subscribe(
  //           res => {
  //             console.log(res)
  //           },
  //           err => console.log(err)
  //         )
  //         // console.log(this.contactForm.value)
  //         Swal.fire('Guardado!', '', 'success')
  //       } else if (result.isDenied) {
  //         Swal.fire('Los cambios no se guardan', '', 'info')
  //       }
  //     })
  //   } else {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Oops...',
  //       text: '¡Complete los campos requeridos!',
  //       footer: '<p style="color: red;">No se enviaran los datos</p>'
  //     })
  //   }
  }
}