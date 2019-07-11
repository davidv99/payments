import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsumaryComponent } from './transactionsumary.component';

describe('TransactionsumaryComponent', () => {
  let component: TransactionsumaryComponent;
  let fixture: ComponentFixture<TransactionsumaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionsumaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionsumaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
