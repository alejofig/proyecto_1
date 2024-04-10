import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerticalCardImgComponent } from './vertical-card-img.component';
import { ActivatedRoute } from '@angular/router';

describe('VerticalCardImgComponent', () => {
  let component: VerticalCardImgComponent;
  let fixture: ComponentFixture<VerticalCardImgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerticalCardImgComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerticalCardImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
