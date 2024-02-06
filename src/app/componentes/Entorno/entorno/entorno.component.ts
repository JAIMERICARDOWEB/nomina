import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-entorno',
  templateUrl: './entorno.component.html',
  styleUrls: ['./entorno.component.css']
})
export class EntornoComponent {
  @HostListener('window:unload', ['$event'])
  unloadHandler(event:any) {
      this.PostCall();
  }
  
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHander(event:any) {
      return false;
  }
  
  PostCall() {
      console.log('PostCall');
  }
  
  loader: boolean = true;
  endLoader: boolean = false;
  
  ngOnInit(): void {
      setTimeout(() => {
          this.loader = false;
          this.endLoader = true
      }, 4000);
  }
}
