import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPracticaComponent } from './formulario-practica.component';

describe('FormularioPracticaComponent', () => {
  let component: FormularioPracticaComponent;
  let fixture: ComponentFixture<FormularioPracticaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioPracticaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioPracticaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
