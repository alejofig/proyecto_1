import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimerosAuxiliosComponent } from './primeros-auxilios.component';
import { ActivatedRoute } from '@angular/router';

describe('PrimerosAuxiliosComponent', () => {
  let component: PrimerosAuxiliosComponent;
  let fixture: ComponentFixture<PrimerosAuxiliosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimerosAuxiliosComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrimerosAuxiliosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
