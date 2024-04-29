import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionContratosComponent } from './gestion-contratos.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

describe('GestionContratosComponent', () => {
  let component: GestionContratosComponent;
  let fixture: ComponentFixture<GestionContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionContratosComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
