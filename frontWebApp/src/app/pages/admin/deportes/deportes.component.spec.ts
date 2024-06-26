import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeportesComponent } from './deportes.component';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

describe('DeportesComponent', () => {
  let component: DeportesComponent;
  let fixture: ComponentFixture<DeportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeportesComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
