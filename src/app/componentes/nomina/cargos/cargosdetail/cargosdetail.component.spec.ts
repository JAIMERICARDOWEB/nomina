import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargosdetailComponent } from './cargosdetail.component';

describe('CargosdetailComponent', () => {
  let component: CargosdetailComponent;
  let fixture: ComponentFixture<CargosdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargosdetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CargosdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
