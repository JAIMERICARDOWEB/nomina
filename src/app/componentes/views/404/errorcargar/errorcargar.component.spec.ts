import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorcargarComponent } from './errorcargar.component';

describe('ErrorcargarComponent', () => {
  let component: ErrorcargarComponent;
  let fixture: ComponentFixture<ErrorcargarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErrorcargarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErrorcargarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
