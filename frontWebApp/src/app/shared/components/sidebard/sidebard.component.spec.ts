import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebardComponent } from './sidebard.component';
import { ActivatedRoute } from '@angular/router';

describe('SidebardComponent', () => {
  let component: SidebardComponent;
  let fixture: ComponentFixture<SidebardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebardComponent],
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
