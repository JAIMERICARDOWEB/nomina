import { Component, OnInit } from '@angular/core';
import { SalaesperaService } from '../../../../../servicios/salaespera/salaespera.service';
import { CRUDService } from 'src/app/servicios/CRUD.service';

@Component({
  selector: 'app-iniciohistoria',
  templateUrl: './iniciohistoria.component.html',
  styleUrls: ['./iniciohistoria.component.css']
})
export class IniciohistoriaComponent implements OnInit{

  obj_seleccionado: any[] = [];
  fuenteDatos: Array<any> = [];

  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};

  ngOnInit(): void {
    this.traerDiagnosticos()
    
  }


  onItemSelect(item: any) {
    // console.log(item);
  }
 

  agregarDiagnosticos(): void{
    this.fuenteDatos = this.selectedItems;
    this.salaEspera.historyObjet.vr_diagnosti.diagnosticos = this.selectedItems;
  }

  constructor(private salaEspera: SalaesperaService, private crudService: CRUDService){}
  
  traerDiagnosticos(): void {
    this.crudService.llamarProcedimiento("sel_tdiagnosticoweb").subscribe(
      res => {
        console.log("estos son los diagnosticos: ", res);
        
        this.dropdownList = res.slice(0, 100) 
        this.dropdownList.map((dropdownList: { vr_nom_diag: string; vr_cod_diag: any; }) => dropdownList.vr_nom_diag = `${dropdownList.vr_cod_diag}: ${dropdownList.vr_nom_diag}`);
      },
      err => {
        console.log(err)
      }
    )
  }
}

