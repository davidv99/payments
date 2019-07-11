import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesumaryComponent } from './purchasesumary.component';

describe('PurchasesumaryComponent', () => {
  let component: PurchasesumaryComponent;
  let fixture: ComponentFixture<PurchasesumaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasesumaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasesumaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
