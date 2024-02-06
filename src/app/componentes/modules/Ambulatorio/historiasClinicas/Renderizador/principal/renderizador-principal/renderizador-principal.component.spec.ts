import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenderizadorPrincipalComponent } from './renderizador-principal.component';

describe('RenderizadorPrincipalComponent', () => {
  let component: RenderizadorPrincipalComponent;
  let fixture: ComponentFixture<RenderizadorPrincipalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenderizadorPrincipalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RenderizadorPrincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
