import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MototallerComponent } from './mototaller.component';
import { ActivatedRoute } from '@angular/router';

describe('MototallerComponent', () => {
  let component: MototallerComponent;
  let fixture: ComponentFixture<MototallerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MototallerComponent],
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
