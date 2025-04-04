import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompararCriptosComponent } from './comparar-criptos.component';

describe('CompararCriptosComponent', () => {
  let component: CompararCriptosComponent;
  let fixture: ComponentFixture<CompararCriptosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompararCriptosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompararCriptosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
