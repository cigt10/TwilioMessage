import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendBulkComponent } from './send-bulk.component';

describe('SendBulkComponent', () => {
  let component: SendBulkComponent;
  let fixture: ComponentFixture<SendBulkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendBulkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
