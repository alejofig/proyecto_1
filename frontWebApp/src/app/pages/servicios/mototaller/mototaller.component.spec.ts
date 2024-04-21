import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MototallerComponent } from './mototaller.component';
import { ActivatedRoute } from '@angular/router';
import { AuthModule } from '@auth0/auth0-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MototallerComponent', () => {
  let component: MototallerComponent;
  let fixture: ComponentFixture<MototallerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,MototallerComponent,AuthModule.forRoot({
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

    fixture = TestBed.createComponent(MototallerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
