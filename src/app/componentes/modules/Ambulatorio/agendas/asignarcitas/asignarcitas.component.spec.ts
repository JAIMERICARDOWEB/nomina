import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarcitasComponent } from './asignarcitas.component';

describe('AsignarcitasComponent', () => {
  let component: AsignarcitasComponent;
  let fixture: ComponentFixture<AsignarcitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarcitasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsignarcitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
