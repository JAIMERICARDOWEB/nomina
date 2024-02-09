import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/theme/shared/shared.module';


@Component({
  selector: 'app-cargoslist',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './cargoslist.component.html',
  styleUrl: './cargoslist.component.scss'
})
export default class CargoslistComponent {

}
