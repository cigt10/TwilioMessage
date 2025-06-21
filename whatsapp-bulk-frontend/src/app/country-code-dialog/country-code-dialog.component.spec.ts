import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryCodeDialogComponent } from './country-code-dialog.component';

describe('CountryCodeDialogComponent', () => {
  let component: CountryCodeDialogComponent;
  let fixture: ComponentFixture<CountryCodeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountryCodeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryCodeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
