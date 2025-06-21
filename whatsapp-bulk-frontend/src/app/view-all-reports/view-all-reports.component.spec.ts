import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAllReportsComponent } from './view-all-reports.component';

describe('ViewAllReportsComponent', () => {
  let component: ViewAllReportsComponent;
  let fixture: ComponentFixture<ViewAllReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAllReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAllReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
