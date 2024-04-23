import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiciosTercerosComponent } from './servicios-terceros.component';
import { ActivatedRoute } from '@angular/router';
import { AuthModule } from '@auth0/auth0-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ServiciosTercerosComponent', () => {
  let component: ServiciosTercerosComponent;
  let fixture: ComponentFixture<ServiciosTercerosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,ServiciosTercerosComponent,AuthModule.forRoot({
        domain: 'domain',
        clientId: 'clientId'
      })],
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
