import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    NgSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule,
    MatDialogModule,
  ],
  selector: 'app-country-code-dialog',
  templateUrl: './country-code-dialog.component.html',
  styleUrls: ['./country-code-dialog.component.css']
})
export class CountryCodeDialogComponent {
  countryCodeOption: 'without' | 'with' | 'column' = 'without';
  selectedCode: string = '';
  selectedColumn: string = '';
  countryCodes = [
    { label: 'India (+91)', value: '+91' },
    { label: 'USA (+1)', value: '+1' },
    { label: 'UK (+44)', value: '+44' },
    { label: 'UAE (+971)', value: '+971' },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { excelColumns: string[] },
    private dialogRef: MatDialogRef<CountryCodeDialogComponent>
  ) {}  
  get excelColumns() { return this.data.excelColumns; } // ✅ Access from dialog data

  closeDialog() {
    this.dialogRef.close(null); // cancel
  }

  save(): void {
    this.dialogRef.close({
      option: this.countryCodeOption,
      selectedCode: this.selectedCode,
      selectedColumn: this.selectedColumn
    });
  }
}
export const COUNTRY_CODES = [
  { label: 'India (+91)', value: '+91' },
  { label: 'US (+1)', value: '+1' },
  { label: 'UK (+44)', value: '+44' },
];

