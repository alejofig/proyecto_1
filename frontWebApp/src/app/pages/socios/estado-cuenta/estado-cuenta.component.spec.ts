import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoCuentaComponent } from './estado-cuenta.component';
import { ActivatedRoute } from '@angular/router';

describe('EstadoCuentaComponent', () => {
  let component: EstadoCuentaComponent;
  let fixture: ComponentFixture<EstadoCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoCuentaComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
