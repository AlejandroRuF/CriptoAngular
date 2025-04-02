import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaCriptoComponent } from './lista-cripto.component';

describe('ListaCriptoComponent', () => {
  let component: ListaCriptoComponent;
  let fixture: ComponentFixture<ListaCriptoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaCriptoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaCriptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
