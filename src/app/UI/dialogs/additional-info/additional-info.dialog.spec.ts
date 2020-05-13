import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalInfoDialog } from './additional-info.dialog';

describe('AdditionalInfoDialog', () => {
  let component: AdditionalInfoDialog;
  let fixture: ComponentFixture<AdditionalInfoDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalInfoDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalInfoDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
