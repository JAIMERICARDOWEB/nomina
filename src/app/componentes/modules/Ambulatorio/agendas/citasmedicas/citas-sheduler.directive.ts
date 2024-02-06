import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appCitasSheduler]',
  standalone: true,
})
export class CitasShedulerDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
 }
