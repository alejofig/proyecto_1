import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimerosAuxiliosComponent } from './primeros-auxilios.component';

describe('PrimerosAuxiliosComponent', () => {
  let component: PrimerosAuxiliosComponent;
  let fixture: ComponentFixture<PrimerosAuxiliosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimerosAuxiliosComponent]
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
