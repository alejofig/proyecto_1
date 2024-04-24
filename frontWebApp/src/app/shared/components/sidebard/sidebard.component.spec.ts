import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebardComponent } from './sidebard.component';
import { ActivatedRoute } from '@angular/router';
import { AuthModule } from '@auth0/auth0-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiGatewayBackendService } from '../../../apigateway-backend.service';
import { of, throwError } from 'rxjs';

describe('SidebardComponent', () => {
  let component: SidebardComponent;
  let fixture: ComponentFixture<SidebardComponent>;
  let apiService: jasmine.SpyObj<ApiGatewayBackendService>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,SidebardComponent,AuthModule.forRoot({
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

    fixture = TestBed.createComponent(SidebardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



});
