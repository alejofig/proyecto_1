import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerarPlanEntreComponent } from './generar-plan-entre.component';
import { ActivatedRoute } from '@angular/router';

describe('GenerarPlanEntreComponent', () => {
  let component: GenerarPlanEntreComponent;
  let fixture: ComponentFixture<GenerarPlanEntreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerarPlanEntreComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerarPlanEntreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
