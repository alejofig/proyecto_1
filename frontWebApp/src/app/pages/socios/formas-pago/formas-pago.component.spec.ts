import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormasPagoComponent } from './formas-pago.component';
import { ActivatedRoute } from '@angular/router';

describe('FormasPagoComponent', () => {
  let component: FormasPagoComponent;
  let fixture: ComponentFixture<FormasPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormasPagoComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormasPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
