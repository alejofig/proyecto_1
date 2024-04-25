import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormasPagoComponent } from './formas-pago.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('FormasPagoComponent', () => {
  let component: FormasPagoComponent;
  let fixture: ComponentFixture<FormasPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormasPagoComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
          }
        },
        TranslateService
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
