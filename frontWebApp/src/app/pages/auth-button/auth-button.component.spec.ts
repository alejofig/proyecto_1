import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthButtonComponent } from './auth-button.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

describe('AuthButtonComponent', () => {
  let component: AuthButtonComponent;
  let fixture: ComponentFixture<AuthButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthButtonComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
          }
        },
        {
          provide: AuthService,
          useValue: {
          }
        }
      ]

    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
