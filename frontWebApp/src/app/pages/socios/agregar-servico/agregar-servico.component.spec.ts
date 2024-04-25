import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarServicoComponent } from './agregar-servico.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

describe('AgregarServicoComponent', () => {
  let component: AgregarServicoComponent;
  let fixture: ComponentFixture<AgregarServicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarServicoComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
