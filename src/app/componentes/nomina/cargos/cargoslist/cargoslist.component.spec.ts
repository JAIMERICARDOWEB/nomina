import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargoslistComponent } from './cargoslist.component';

describe('CargoslistComponent', () => {
  let component: CargoslistComponent;
  let fixture: ComponentFixture<CargoslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargoslistComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CargoslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
