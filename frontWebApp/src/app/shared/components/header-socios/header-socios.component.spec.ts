import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSociosComponent } from './header-socios.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

describe('HeaderSociosComponent', () => {
  let component: HeaderSociosComponent;
  let fixture: ComponentFixture<HeaderSociosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderSociosComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderSociosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
