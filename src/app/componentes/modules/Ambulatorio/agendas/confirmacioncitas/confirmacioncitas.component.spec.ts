import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacioncitasComponent } from './confirmacioncitas.component';

describe('ConfirmacioncitasComponent', () => {
  let component: ConfirmacioncitasComponent;
  let fixture: ComponentFixture<ConfirmacioncitasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmacioncitasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmacioncitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
