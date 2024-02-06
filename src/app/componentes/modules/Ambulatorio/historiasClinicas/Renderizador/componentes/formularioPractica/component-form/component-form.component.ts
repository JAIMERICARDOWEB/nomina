import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-component-form',
  templateUrl: './component-form.component.html',
  styleUrls: ['./component-form.component.css']
})
export class ComponentFormComponent implements OnInit {

  checkoutForm: FormGroup = new FormGroup({}); 

  constructor() {}

  ngOnInit(): void {
    this.initFormSkill()
    this.loadData()
  }

  initFormParent(): void {
    this.checkoutForm = new FormGroup({
      skills: new FormArray([]),
    });
  }
  initFormSkill(): FormGroup {
    return new FormGroup({
      language: new FormControl('', [Validators.required]),
      projectUrl: new FormControl(''),
      expYear: new FormControl('', [Validators.required]),
      expYear3: new FormControl('', [Validators.required]),
    });
  }

  addSkill(): void {
    const refSkills = this.checkoutForm.get('skills') as FormArray;
    refSkills.push(this.initFormSkill());
  }

  getCtrl(key: string, form: FormGroup): any {
    return form.get(key);
  }

  loadData(): void {
    const data = {
      name: '',
      skills: [
        {
          language: '',
          projectUrl: '',
          expYear: '',
        },
      ],
    };

    //TODO: Primero creamos el esqueleto del formulario vacio y luego lo llenamos!
    for (const _ of data.skills) {
      this.addSkill();
    }

    //TODO: Puedes comentar la siguiente funcion y se debe armar el numero de skill vacio
    this.checkoutForm.patchValue(data);
  }

}
