import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlimentacionComponent } from './alimentacion.component';
import { ActivatedRoute } from '@angular/router';
import { AuthModule } from '@auth0/auth0-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AlimentacionComponent', () => {
  let component: AlimentacionComponent;
  let fixture: ComponentFixture<AlimentacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,AlimentacionComponent,AuthModule.forRoot({
        domain: 'domain',
        clientId: 'clientId'
      }),],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlimentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
