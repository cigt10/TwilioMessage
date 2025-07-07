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
import { CountryCodeDialogData } from '../models/country-code-dialog-data';
import { COUNTRY_CODES } from '../shared/constants';

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
  styleUrls: ['./country-code-dialog.component.css'],
})
export class CountryCodeDialogComponent {
  countryCodeOption: 'without' | 'with' | 'column' = 'without';
  selectedCode: string = '';
  selectedColumn: string = '';
  isSaved = false;

  countryCodes = COUNTRY_CODES;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CountryCodeDialogData,
    private dialogRef: MatDialogRef<CountryCodeDialogComponent>
  ) {
    const saved = localStorage.getItem('defaultCountryCodeSettings');
    
    if (saved) {
      const parsed = JSON.parse(saved);
      this.countryCodeOption = parsed.option || 'with';
      this.isSaved = true;

      if (this.countryCodeOption === 'without') {
        this.selectedCode = parsed.selectedCode || '';
      } else if (this.countryCodeOption === 'column') {
        this.selectedColumn = parsed.selectedColumn || '';
      }
    } else {
      this.countryCodeOption = (data.currentOption || 'with') as 'without' | 'with' | 'column';
      if (this.countryCodeOption === 'without') {
        this.selectedCode = data.selectedCode || '';
      } else if (this.countryCodeOption === 'column') {
        this.selectedColumn = data.selectedCode || '';
      }
    }
  }

  get excelColumns() {
    return this.data.excelColumns;
  }

  closeDialog() {
    this.dialogRef.close(null); // Cancel
  }

  save(): void {
    const config: any = {
      option: this.countryCodeOption,
    };

    if (this.countryCodeOption === 'without') {
      config.selectedCode = this.selectedCode;
    } else if (this.countryCodeOption === 'column') {
      config.selectedColumn = this.selectedColumn;
    }

    localStorage.setItem('defaultCountryCodeSettings', JSON.stringify(config));
    this.isSaved = true;
  }

  canSubmit(): boolean {
    if (this.countryCodeOption === 'without') {
      return !!this.selectedCode;
    }
    if (this.countryCodeOption === 'column') {
      return !!this.selectedColumn;
    }
    return true;
  }

  done(): void {
    const result: any = {
      option: this.countryCodeOption,
      isSaved: this.isSaved
    };

    if (this.countryCodeOption === 'without') {
      result.selectedCode = this.selectedCode;
    } else if (this.countryCodeOption === 'column') {
      result.selectedColumn = this.selectedColumn;
    }

    this.dialogRef.close(result);
  }
  onOptionChange(): void {
    this.isSaved = false;
  }
  
  onCodeChange(): void {
    this.isSaved = false;
  }
  
  onColumnChange(): void {
    this.isSaved = false;
  }
  
}

