import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenarComponent } from './sidenar.component';

describe('SidenarComponent', () => {
  let component: SidenarComponent;
  let fixture: ComponentFixture<SidenarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidenarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidenarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
