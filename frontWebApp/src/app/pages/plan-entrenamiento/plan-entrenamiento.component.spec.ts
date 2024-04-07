import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanEntrenamientoComponent } from './plan-entrenamiento.component';
import { ActivatedRoute } from '@angular/router';

describe('PlanEntrenamientoComponent', () => {
  let component: PlanEntrenamientoComponent;
  let fixture: ComponentFixture<PlanEntrenamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanEntrenamientoComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
          }
        }
      ]
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
