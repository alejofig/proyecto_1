import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosTercerosComponent } from './servicios-terceros.component';
import { ActivatedRoute } from '@angular/router';

describe('ServiciosTercerosComponent', () => {
  let component: ServiciosTercerosComponent;
  let fixture: ComponentFixture<ServiciosTercerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiciosTercerosComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiciosTercerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
