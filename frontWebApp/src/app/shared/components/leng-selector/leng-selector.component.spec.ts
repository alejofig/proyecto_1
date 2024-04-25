import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LengSelectorComponent } from './leng-selector.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

describe('LengSelectorComponent', () => {
  let component: LengSelectorComponent;
  let fixture: ComponentFixture<LengSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LengSelectorComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
          }
        },
        TranslateService
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
