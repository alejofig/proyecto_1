import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanEntrenamientoComponent } from './plan-entrenamiento.component';

describe('PlanEntrenamientoComponent', () => {
  let component: PlanEntrenamientoComponent;
  let fixture: ComponentFixture<PlanEntrenamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanEntrenamientoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlanEntrenamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
