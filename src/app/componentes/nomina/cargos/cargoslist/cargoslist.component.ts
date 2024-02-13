import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import {  DxDataGridModule, DxDataGridComponent } from "devextreme-angular";
import { CargosService } from '../services/cargos.service';
import { cargos } from '../interfaces/cargos';


@Component({
  selector: 'app-cargoslist',
  standalone: true,
  imports: [CommonModule, SharedModule,DxDataGridModule],
  templateUrl: './cargoslist.component.html',
  styleUrl: './cargoslist.component.scss'
})
export default class CargoslistComponent implements OnInit {
  @ViewChild('grid', { static: false }) grid: DxDataGridComponent;
  public cargosList:cargos[]
  async ngOnInit(): Promise<void> {
    let datos = await this.cagosservice.getAll()
    console.log(datos)
    this.cargosList=datos
  }
  
  constructor(private cagosservice:CargosService){

  }

}

