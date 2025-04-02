import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCriptoComponent } from './detalle-cripto.component';

describe('DetalleCriptoComponent', () => {
  let component: DetalleCriptoComponent;
  let fixture: ComponentFixture<DetalleCriptoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleCriptoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleCriptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
