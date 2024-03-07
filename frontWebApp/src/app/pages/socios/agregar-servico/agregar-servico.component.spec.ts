import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarServicoComponent } from './agregar-servico.component';

describe('AgregarServicoComponent', () => {
  let component: AgregarServicoComponent;
  let fixture: ComponentFixture<AgregarServicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarServicoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgregarServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
