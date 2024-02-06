import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CajaNumericaComponent } from './caja-numerica.component';

describe('CajaNumericaComponent', () => {
  let component: CajaNumericaComponent;
  let fixture: ComponentFixture<CajaNumericaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CajaNumericaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CajaNumericaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
