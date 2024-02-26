import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestadoreslistdetailComponent } from './prestadoreslistdetail.component';

describe('PrestadoreslistdetailComponent', () => {
  let component: PrestadoreslistdetailComponent;
  let fixture: ComponentFixture<PrestadoreslistdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestadoreslistdetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrestadoreslistdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
