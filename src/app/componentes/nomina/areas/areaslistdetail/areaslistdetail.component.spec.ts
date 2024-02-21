import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreaslistdetailComponent } from './areaslistdetail.component';

describe('AreaslistdetailComponent', () => {
  let component: AreaslistdetailComponent;
  let fixture: ComponentFixture<AreaslistdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaslistdetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AreaslistdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
