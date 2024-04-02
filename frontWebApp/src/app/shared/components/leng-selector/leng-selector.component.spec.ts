import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LengSelectorComponent } from './leng-selector.component';

describe('LengSelectorComponent', () => {
  let component: LengSelectorComponent;
  let fixture: ComponentFixture<LengSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LengSelectorComponent]
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
