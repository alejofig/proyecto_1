import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalCardComponent } from './horizontal-card.component';
import { ActivatedRoute } from '@angular/router';

describe('HorizontalCardComponent', () => {
  let component: HorizontalCardComponent;
  let fixture: ComponentFixture<HorizontalCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalCardComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
          }
        }
      ]

    })
    .compileComponents();

    fixture = TestBed.createComponent(HorizontalCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
