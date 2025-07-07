// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { NgSelectModule } from '@ng-select/ng-select';
// import { MatButtonModule } from '@angular/material/button';

// @Component({
//   selector: 'app-google-sheet',
//   imports: [CommonModule, FormsModule, NgSelectModule],
//   templateUrl: './google-sheet.component.html',
//   styleUrl: './google-sheet.component.css',
// })
// export class GoogleSheetComponent {
//   sheetUrl: string = '';
//   sheetOptions = [
//     { label: 'Google Sheet 1', value: 'https://sheet1.url' },
//     { label: 'Google Sheet 2', value: 'https://sheet2.url' }
//   ];
//   sheetNames: string[] = [];
//   selectedSheet: string = '';
//   rowOption: string = 'all';
//   recipientCount: number = 0;

//   showInitialForm = true;
// showNewForm = false;

// onSheetUrlChange(event: any) {
//   const url = typeof event === 'string' ? event : event.label;
//   this.sheetUrl = url;

//   this.sheetNames = ['Sheet1', 'Sheet2'];
//   this.selectedSheet = this.sheetNames[0];
//   this.recipientCount = 3;

//   this.showInitialForm = false;
//   this.showNewForm = true;
// }

// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-google-sheet',
  imports: [
    CommonModule, 
    FormsModule, 
    NgSelectModule, 
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule
  ],
  templateUrl: './google-sheet.component.html',
  styleUrl: './google-sheet.component.css',
})
export class GoogleSheetComponent {
   // Step 1
   sheetUrl: string = '';
   sheetLoaded: boolean = false;
 
   // Sheet Name
   manualSheetName: string = '';
 
   // Dropdown sheet list
   availableSheets: string[] = [];
   selectedSheet: string = '';
 
   // Column selection (optional if needed)
   columns: string[] = [];
   selectedColumn: string = '';
 
   // Row selection
   sendTo: 'all' | 'selected' = 'all';
   startRow: number = 1;
   endRow: number = 1;
   recipientCount: number = 0;
 
   // Mock recent URLs if you want dropdown in future
   recentUrls: string[] = [];
 
   constructor() {}
 
   // Called when URL is entered (you could add debounce for performance)
   onUrlEntered() {
     if (!this.sheetUrl || !this.sheetUrl.includes('docs.google.com')) {
       alert('Please enter a valid Google Sheet URL.');
       return;
     }
 
     this.loadSheetData(this.sheetUrl);
   }
 
   // Simulate fetching sheet names from the provided URL
   loadSheetData(url: string) {
     // ✅ TODO: Replace with real Google Sheets API call
     this.availableSheets = ['Sheet1', 'Sheet2', 'Customers']; // Mocked data
     this.selectedSheet = this.availableSheets[0]; // Default selection
 
     // Optional mock column headers
     this.columns = ['Name', 'Phone', 'Message']; // You can remove this if not needed
     this.selectedColumn = this.columns[0];
 
     this.sheetLoaded = true;
 
     // Default row range
     this.startRow = 2;
     this.endRow = 4;
     this.updateRecipientCount();
   }
 
   // Recalculate recipients when row numbers or selection type changes
   updateRecipientCount() {
     if (this.sendTo === 'all') {
       this.recipientCount = 10; // Simulate full data row count
     } else if (this.sendTo === 'selected') {
       const from = Math.max(1, this.startRow);
       const to = Math.max(from, this.endRow);
       this.recipientCount = to - from + 1;
     }
   }
 
   goBack() {
     // Navigation or view step logic here
     console.log('Back clicked');
   }
 
   goNext() {
     if (!this.manualSheetName || !this.selectedSheet) {
       alert('Please fill in all required fields.');
       return;
     }
 
     // Construct and pass the payload to next step or API
     const payload = {
       url: this.sheetUrl,
       sheet: this.selectedSheet,
       manualName: this.manualSheetName,
       column: this.selectedColumn,
       sendTo: this.sendTo,
       startRow: this.startRow,
       endRow: this.endRow,
       recipientCount: this.recipientCount
     };
 
     console.log('Next Step Payload:', payload);
     // Navigate or emit data here
   }
 }