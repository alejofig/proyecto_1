import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LengSelectorComponent } from './leng-selector.component';
import { ActivatedRoute } from '@angular/router';

describe('LengSelectorComponent', () => {
  let component: LengSelectorComponent;
  let fixture: ComponentFixture<LengSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LengSelectorComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LengSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
