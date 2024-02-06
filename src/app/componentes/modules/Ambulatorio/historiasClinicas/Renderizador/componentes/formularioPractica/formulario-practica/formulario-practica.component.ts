import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { interval } from 'rxjs';

@Component({
  selector: 'app-formulario-practica',
  templateUrl: './formulario-practica.component.html',
  styleUrls: ['./formulario-practica.component.css']
})
export class FormularioPracticaComponent implements OnInit {

  public formParent: FormGroup = new FormGroup({}); //TODO: Declaramos el Form

  constructor(private form: FormBuilder){}

  //TODO: Ciclo de vida
  ngOnInit(): void {
    this.initFormParent();
    this.loadData();
    let form: FormGroup = new FormGroup({
      language: new FormControl('', [Validators.required])
    });
    form.addControl("hola", new FormControl(''))
    console.log(form)
    
  }

  //TODO: FormGroup -> [FormArray, FormControls, FormGroup]
  initFormParent(): void {
    this.formParent = new FormGroup({
      skills: new FormArray([], [Validators.required])
    });
  }

  //TODO: Iniciar el formulario hijo (Skill) 🤣
  initFormSkill(): FormGroup {
    // this.form.controls["firstName"].setValidators([Validators.minLength(1), Validators.maxLength(30)]);
    let form: FormGroup = new FormGroup({})
    form.addControl("language", this.form.control(""))//✅✅✅✅✅✅
    form.controls["language"].addValidators([Validators.required])
    return form;
  }

  //TODO: Agregar nuevo skill en form 🤨
  addSkill(): void {
    const refSkills = this.formParent.get('skills') as FormArray;
    refSkills.push(this.initFormSkill());
  }

  //TODO: Obtener referencia a un formControl

  getCtrl(key: string, form: FormGroup): any {
    return form.get(key);
  }

  //TODO: Quitar validaciones 1,2,3,4 (language)
  removeValidation(index: number, key: string): void {
    const refParent = this.formParent.get('skills') as FormArray;
    const refSingle = refParent.at(index).get(key) as FormGroup;

    refSingle.clearValidators();
    refSingle.updateValueAndValidity();
  }

  //TODO: Agregar validaciones
  addValidation(index: number, key: string): void {
    const refParent = this.formParent.get('skills') as FormArray;
    const refSingle = refParent.at(index).get(key) as FormGroup;

    refSingle.setValidators([
      Validators.required,
      Validators.email,
      Validators.minLength(5),
    ]);
    refSingle.updateValueAndValidity();
  }

  //TODO: Cargar data de ejemplo

  loadData(): void {
    const data = {
      skills: [
        {
          language: ''
        },
      ],
    };

    //TODO: Primero creamos el esqueleto del formulario vacio y luego lo llenamos!
    for (const _ of data.skills) {
      this.addSkill();
    }

    //TODO: Puedes comentar la siguiente funcion y se debe armar el numero de skill vacio
    this.formParent.patchValue(data);
  }
}
