import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlimentacionComponent } from './alimentacion.component';
import { ActivatedRoute } from '@angular/router';

describe('AlimentacionComponent', () => {
  let component: AlimentacionComponent;
  let fixture: ComponentFixture<AlimentacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlimentacionComponent],
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
