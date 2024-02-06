import { Component, OnInit } from '@angular/core';
import { resourceData } from '../../../../principal/renderizador-principal/renderizador-principal.component';

@Component({
  selector: 'app-group-box',
  templateUrl: './group-box.component.html',
  styleUrls: ['./group-box.component.css']
})
export class GroupBoxComponent implements resourceData {

  data: any

  constructor() { }

}
