import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderInicioComponent } from './header-inicio.component';
import { ActivatedRoute } from '@angular/router';

describe('HeaderInicioComponent', () => {
  let component: HeaderInicioComponent;
  let fixture: ComponentFixture<HeaderInicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderInicioComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderInicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
