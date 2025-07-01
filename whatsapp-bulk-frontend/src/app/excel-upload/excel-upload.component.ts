// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import * as XLSX from 'xlsx';

// @Component({
//   selector: 'app-excel-upload',
//   imports: [CommonModule, FormsModule],
//   templateUrl: './excel-upload.component.html',
//   styleUrls: ['./excel-upload.component.css']
// })
// export class ExcelUploadComponent {
//   file: File | null = null;
//   sheetNames: string[] = [];
//   selectedSheet: string = '';
//   sendAll: boolean = true;
// startRow: number = 2;
// endRow: number = 10;
//   recipientCount: number = 0;
//   excelData: { [sheetName: string]: any[] } = {};

//   onFileSelected(event: any): void {
//     const file = event.target.files[0];
//     if (file && file.size <= 5 * 1024 * 1024) {
//       const reader = new FileReader();
//       reader.onload = (e: any) => {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: 'array' });
  
//         this.sheetNames = workbook.SheetNames;
//         this.selectedSheet = this.sheetNames[0];
//         this.file = file;
  
//         // ✅ Parse and store all sheets as JSON
//         workbook.SheetNames.forEach(sheetName => {
//           const worksheet = workbook.Sheets[sheetName];
//           const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
//           this.excelData[sheetName] = jsonData;
//         });
  
//         // ✅ Update recipient count after loading data
//         this.updateRecipientCount();
//       };
//       reader.readAsArrayBuffer(file);
//     } else {
//       alert('Please select a valid Excel file under 5 MB.');
//     }
//   }

//   removeFile(): void {
//     this.file = null;
//     this.sheetNames = [];
//     this.selectedSheet = '';
//   }

//   goBack(): void {
//     // Add your navigation or step change logic here
//     console.log('Going back to previous step...');
//   }

//   goNext(): void {
//     if (this.selectedSheet) {
//       console.log('Selected file:', this.file?.name);
//       console.log('Selected sheet:', this.selectedSheet);
//       // Proceed to next step or read the sheet content
//     } else {
//       alert('Please select a sheet.');
//     }
//   }
//   updateRecipientCount() {
//     if (this.sendAll) {
//       // Get all row count dynamically from the selected sheet data
//       const sheet = this.excelData[this.selectedSheet]; // Assume you have parsed Excel data stored
//       this.recipientCount = sheet?.length || 0;
//     } else {
//       const start = Math.max(2, this.startRow || 2);
//       const end = Math.max(start, this.endRow || start);
//       this.recipientCount = end - start + 1;
//     }
//   }
// }


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';


import { CountryCodeDialogComponent } from '../country-code-dialog/country-code-dialog.component';
import { TemplateMessageComponent } from '../template-message/template-message.component';
import { WhatsAppRequest } from '../models/whatsapp-request';
import { WhatsAppService } from '../whatsapp.service';
import { WhatsAppMsgResponse } from '../models/whats-app-msg-response';
import { FilePreview } from '../models/file-preview';
import { HtmlUtilsService } from '../Utils/helper';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';



@Component({
  selector: 'app-excel-upload',
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
    
  ],
  templateUrl: './excel-upload.component.html',
  styleUrls: ['./excel-upload.component.css']
})
export class ExcelUploadComponent implements OnInit {
  [x: string]: any;
  constructor(private dialog: MatDialog, private router: Router,private service: WhatsAppService, private htmlUtils: HtmlUtilsService, private snackBar: MatSnackBar) {}

  // View state
  currentView: 'upload' | 'sheet' | 'mapFields' | 'preview' = 'upload';
  currentIndex: number = 0;

  // File handling
  dragging = false;
  fileError = '';
  fileName = '';
  workbook: XLSX.WorkBook | null = null;

  // Excel data
  sheetNames: string[] = [];
  selectedSheet = '';
  rows: any[] = [];
  excelColumns: string[] = [];
  excelData: any[] = [];

  // Field selection
  selectedPhoneField: string = '';
  selectedMessageField: string = '';
  customMessage: string = '';
  selectedTemplateName: string = '';

  // Country code
  countryCodeOption: 'without' | 'with' | 'column' = 'without';
  selectedCountryCodeColumn = '';
  selectedCountryCodeLabel: string = '';
  
  // Row range selection
  rowOption: 'all' | 'selected' = 'all';
  startRow = 2;
  endRow = 2;
  recipientCount = 0;
  plainText: string = '';
  startRowError: string | null = null;
  endRowError: string | null = null;
  //attachment
  whatsAppRequest: WhatsAppRequest = {
    encodedPhoneNumbers: '',
    message: '',
    files: []
  };
  showAttachments = false;
  selectedFiles: FilePreview[] = [];
  errorMessage: string = '';
  showValidationError = false;
  showPhoneValidationError: boolean = false;
  showTemplateValidationError: boolean = false;
  isPreview : boolean = false;

  // send message
  processing = false;
  completed = false;
  paused = false;
  sentCount = 0;
  notSentCount = 0;
  totalCount = 0;
  isPaused: boolean = false;
  result: WhatsAppMsgResponse = {
      message: '',
      deliverMsgCount: 0,
      unDeliverMsgCount: 0,
      errorMessage: ''
  };
  step: 'form' | 'upload' | 'sheet' | 'mapFields' | 'preview' | 'processing' | 'result' = 'form';

  // htmlutils
  convertHtml(htmlContent: string) {
    return this.htmlUtils.htmlToPlain(htmlContent);
  }

  // ================================
  // File & Sheet Handling
  // ================================
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragging = true;
  }

  onDragLeave(event: DragEvent) {
    this.dragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragging = false;
    if (event.dataTransfer?.files.length) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  handleFile(file: File) {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      this.fileError = 'Only Excel files (.xls/.xlsx) are allowed.';
      return;
    }

    if (file.size > maxSize) {
      this.fileError = 'File size exceeds 5 MB limit.';
      return;
    }

    this.fileError = '';
    this.fileName = file.name;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      this.workbook = XLSX.read(data, { type: 'array' });
      this.sheetNames = this.workbook.SheetNames;
      this.selectedSheet = this.sheetNames[-1];
      this.onSheetSelect();
      this.currentView = 'sheet'; // Auto switch
    };
    reader.readAsArrayBuffer(file);
  }

  onSheetSelect() {
    if (this.selectedSheet) {
      this.showValidationError = false;
    }
    if (!this.workbook || !this.selectedSheet) return;

    const worksheet = this.workbook.Sheets[this.selectedSheet];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

    this.excelData = jsonData;
    this.excelColumns = Object.keys(jsonData[0] || {});
    this.rows = jsonData;

    this.startRow = 2;
    this.endRow = this.rows.length + 1;
    this.updateRecipientCount();
  }

  clearFile() {
    this.fileName = '';
    this.sheetNames = [];
    this.selectedSheet = '';
    this.rows = [];
    this.excelData = [];
    this.currentView = 'upload';
    this.workbook = null;
    this.clearMessageSelection();
    this.clearPhoneSelection();
  }

  // ================================
  // Message Selection
  // ================================
  goToTemplateMessage() {
    this.showTemplateValidationError = false;
    const dialogRef = this.dialog.open(TemplateMessageComponent, {
      width: '500px',
      disableClose: true, // ❗ prevents closing on backdrop click or ESC
      data: {
        message: this.customMessage,
        excelColumns: this.excelColumns
      }
    });

    dialogRef.afterClosed().subscribe((result: { message: string, templateName: string }) => {
      if (result) {
        this.customMessage =result.message;
        this.selectedTemplateName = result.templateName;
        this.selectedMessageField = ''; // Disable Excel column if custom message used
      }
    });
  }

  onMessageFieldChange() {
    if (this.selectedMessageField) {
      this.customMessage = '';
    }
  }

  onCustomMessageClick() {
    this.selectedMessageField = '';
    this.goToTemplateMessage();
  }

  clearMessageSelection() {
    this.selectedMessageField = '';
    this.customMessage = '';
  }

  clearPhoneSelection() {
    this.selectedPhoneField = '';
    this.showPhoneValidationError = true;

  }

  // ================================
  // Country Code Dialog
  // ================================
  openCountryCodeDialog() {
    const dialogRef = this.dialog.open(CountryCodeDialogComponent, {
      width: '500px',
      disableClose: true, // ❗ prevents closing on backdrop click or ESC
      data: {
        excelColumns: this.excelColumns,
        currentOption: this.countryCodeOption,
        selectedCode: this.selectedCountryCodeColumn
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
  
      this.countryCodeOption = result.option;
  
      if (result.option === 'without') {
        this.selectedCountryCodeColumn = result.selectedCode;
      } else if (result.option === 'with') {
        this.selectedCountryCodeColumn = '';
      } else if (result.option === 'column') {
        this.selectedCountryCodeColumn = result.selectedColumn;
      }
  
      // No need for countryCodeSaved flag unless UI shows "Saved"
    });
  }
  
  ngOnInit() {
    const saved = localStorage.getItem('defaultCountryCodeSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.countryCodeOption = parsed.option || 'with';
  
      if (parsed.option === 'without') {
        this.selectedCountryCodeColumn = parsed.selectedCode;
      } else if (parsed.option === 'column') {
        this.selectedCountryCodeColumn = parsed.selectedColumn;
      } else {
        this.selectedCountryCodeColumn = '';
      }
    }
  }
  

  // ================================
  // Row & Preview Logic
  // ================================
  onRowOptionChange() {
    this.updateRecipientCount();
  }

  updateRecipientCount() {
    if (this.rowOption === 'all') {
      this.recipientCount = this.rows.length;
    } else {
      const from = Math.max(2, this.startRow);
      const to = Math.min(this.rows.length + 1, this.endRow);
      this.recipientCount = Math.max(0, to - from + 1);
    }
  }

  // getSelectedPhoneNumber(): string {
  //   const row = this.excelData[this.currentIndex];
  //   const number = row?.[this.selectedPhoneField];
  //   const code = this.selectedCountryCodeColumn.match(/\+\d+/)?.[0] ?? '';
  //   return number ? `${code}${number}` : 'No number';
  // }

  getSelectedMessage(): string {
    const row = this.excelData[this.currentIndex] || {};
    let message = this.customMessage;
  
    // If no template, fall back to selected column
    if (!message && this.selectedMessageField) {
      return row[this.selectedMessageField] || '';
    }
  
    return message.replace(/@(\w+)/g, (_, key) => {
      return row[key] !== undefined ? row[key] : `@${key}`;
    });
  }  
  
  getTemplateName(): string {
    return this.selectedTemplateName || 'No template used';
  }  

  goToPreview() {
    this.currentIndex = 0;
    this.currentView = 'preview';
  }

  next() {
    if (this.currentIndex < this.excelData.length - 1) {
      this.currentIndex++;
    }
  }

  prev() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  proceed() {
    console.log('Proceeding with', this.recipientCount, 'recipients.');
  }

  @ViewChild('imageInput') imageInput!: ElementRef;
  @ViewChild('videoInput') videoInput!: ElementRef;
  @ViewChild('docInput') docInput!: ElementRef;

  // selectedFiles: { type: string; file: File; error: string | null }[] = [];

  triggerFileSelect(type: string) {
    if (type === 'image') this.imageInput.nativeElement.click();
    else if (type === 'video') this.videoInput.nativeElement.click();
    else if (type === 'document') this.docInput.nativeElement.click();
  }
  
  handleMediaFile(event: any, fileType: 'Image' | 'Video' | 'Document') {
    const file = event.target.files[0];
    if (!file) return;
  
    let maxSize = 0;
    let error: string | null = null;
  
    switch (fileType.toLowerCase()) {
      case 'image':
        maxSize = 1 * 1024 * 1024; // 1 MB
        if (file.size > maxSize) error = 'Image should be less than 1 MB.';
        break;
      case 'video':
        maxSize = 64 * 1024 * 1024; // 64 MB
        if (file.size > maxSize) error = 'Video should be less than 64 MB.';
        break;
      case 'document':
        maxSize = 100 * 1024 * 1024; // 100 MB
        if (file.size > maxSize) error = 'Document should be less than 100 MB.';
        break;
      default:
        error = 'Unsupported file type.';
    }
  
    const fileUrl = !error ? URL.createObjectURL(file) : ''; // Only create preview if no error
  
    this.selectedFiles.push({
      type: fileType,
      file,
      url: fileUrl,
      error
    });
  
    // Filter out files with error and set to whatsAppRequest.files
    this.whatsAppRequest.files = this.selectedFiles
      .filter(f => !f.error)
      .map(f => f.file);
  }
  
  removeAttachment(index: number): void {
    const file = this.selectedFiles[index];
    if (file.url) {
      URL.revokeObjectURL(file.url); // Clean memory
    }
    this.selectedFiles.splice(index, 1);
    this.whatsAppRequest.files = this.selectedFiles
      .filter(f => !f.error)
      .map(f => f.file);
  }
  
  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  getSelectedPhoneNumber(): any {
    const row = this.excelData[this.currentIndex];
    const number = row?.[this.selectedPhoneField] || '';
    var phoneNumber: any = null;

    alert(this.countryCodeOption)
    if (!number) return '';
  
    if (this.countryCodeOption === 'with') { 
      phoneNumber = number;
    }
    if (this.countryCodeOption === 'without') { 
      phoneNumber = `${this.selectedCountryCodeColumn}${number}`;    }
    if (this.countryCodeOption === 'column') {
      alert("column1")
      if (this.selectedCountryCodeColumn === 'CountryCode') {
        const code = row?.[this.selectedCountryCodeColumn] || '';
        phoneNumber = `${code}${number}`;
        alert("column2")
      } 
      else if (this.selectedCountryCodeColumn === 'PhoneNumber')
      { 
        alert("column3")
        if (this.getExcelData(this.selectedCountryCodeColumn)) {
          const pnumber = row?.[this.selectedCountryCodeColumn] || '';
        phoneNumber = pnumber;
        }
        else {
          alert("Phone Number does not contain country code, Please select another column");
            this.isPreview = false;
          return;
        }
      }
      else
      { 
        alert("column4")      }
      
    }
  
    // 'without' case: selectedCountryCodeColumn stores code like +91
    return phoneNumber;
  }
  getExcelData(selectedPhoneField: string): boolean { 
    var isValid = true;
    const numbersWithoutCode = this.excelData.filter(row => {
      const phone = row[selectedPhoneField];
      if(!this.hasCountryCode(phone)){
      isValid = false;
      }
    });
    return isValid;
  }

  hasCountryCode(phone: string): boolean {
    return typeof phone === 'string' && /^\+\d{1,4}/.test(phone.trim());
  }
  
  getSelectedCountryCodeOnly(): string {
    const match = this.selectedCountryCodeLabel?.match(/\+\d+/);
    return match ? match[0] : '';
  }  

  // send messages
// Additional Functions to be added to your existing component

  sendMessagesFromExcel() {
  console.log(this.result);
  if (!this.excelData || this.excelData.length === 0) {
    this.fileError = 'No Excel data loaded.';
    return;
  }

  const fullNumbers: string[] = [];
    const customerNames: string[] = [];
    
  const fromRow = this.rowOption === 'all' ? 0 : Math.max(0, this.startRow - 2);
  const toRow = this.rowOption === 'all' ? this.excelData.length : Math.min(this.endRow - 1, this.excelData.length - 1);

  for (let i = fromRow; i <= toRow; i++) {
    const row = this.excelData[i];
    if (!row || typeof row !== 'object') continue;  // Skip if row is invalid

    const number = this.getPhoneNumberFromRow(row);
    if (number) {
      fullNumbers.push(number);
    }
     const name = this.getNameFromRow(row);
    if (name) {
      customerNames.push(name);
    }
  }

  const formData = new FormData();
    const encodedPhoneNumbers = btoa(fullNumbers.join(','));
    const name = customerNames.join(',');

  formData.append('EncodedPhoneNumbers', encodedPhoneNumbers);
    formData.append('Message', this.customMessage); // Optional if using a single message
    formData.append('Name', name); // Optional if using a single message
  // formData.append('Message', JSON.stringify(messages));
  // console.log('Example Message:', messages[0]);

  if (this.whatsAppRequest.files) {
    for (let file of this.whatsAppRequest.files) {
      formData.append('Files', file);
    }
  }

  this.processing = true;
  this.step = 'processing';
  this.currentView='preview';
  this.sentCount = 0;
  this.notSentCount = 0;
  this.totalCount = fullNumbers.length;

  this.service.sendBulkMessage(formData).subscribe(res => {
    this.result = res;
    this.processing = false;
    this.completed = true;
    this.step = 'result';
    this.sentCount = res.deliverMsgCount;
    this.notSentCount = res.unDeliverMsgCount;
    this.errorMessage = res.errorMessage;
  });
}

getPhoneNumberFromRow(row: any): string {
  const number = row?.[this.selectedPhoneField]?.toString().trim() || '';
  if (!number) return '';

  if (this.countryCodeOption === 'with') {
    return number;
  }

  if (this.countryCodeOption === 'column') {
    const code = row?.[this.selectedCountryCodeColumn]?.toString().trim() || '';
    return code + number;
  }

  const code = this.getSelectedCountryCodeOnly();
  return code + number;
}
getNameFromRow(row: any): string {
  const name = row?.["Name"]?.toString().trim() || '';
  return name;
}
  interpolateMessage(row: any): string {
  if (this.customMessage) {
    return this.customMessage.replace(/@(\w+)/g, (_, key) => {
      return row[key] !== undefined && row[key] !== null
        ? row[key]
        : ''; // Replace undefined with empty string instead of leaving @key
    });
  }

    if (this.selectedMessageField) {
    return row[this.selectedMessageField]?.toString() || '';
  }

  return '';
}

goHome() {
  this.router.navigate(['/dashboard']);
}
cancelProcess() {
  this.processing = false;
  this.step = 'form';
}

pauseProcess() {
  this.isPaused = true;
}

resumeProcess() {
  this.isPaused = false;
}
openReport() {
  const url = this.router.serializeUrl(this.router.createUrlTree(['/report']));
  window.open(url, '_blank');
  }  
clearTemplateName(event: Event) {
    event.stopPropagation();
    this.selectedTemplateName = '';
  this.customMessage = ''; 
  this.showTemplateValidationError = true; 
  }
  breakMessages(htmlContent: string) {
    return this.htmlUtils.breakMessageIntoLines(htmlContent);
  } 
  // validate 

  validateAndProceed() {
    if (!this.selectedSheet) {
      this.showValidationError = true;
    } else {
      this.showValidationError = false;
      this.currentView = 'mapFields';
    }
  }
    validateBeforePreview() {
    let isValid = true;
  
    // Validate phone field
    if (!this.selectedPhoneField) {
      this.showPhoneValidationError = true;
      isValid = false;
    } else {
      this.showPhoneValidationError = false;
    }
  
    // Validate template
    const hasTemplate = this.getTemplateName().trim() !== 'No template used';
    if (!hasTemplate) {
      this.showTemplateValidationError = true;
      isValid = false;
    } else {
      this.showTemplateValidationError = false;
    }
  
    if (isValid) {
      this.onNextClick(); // Only navigate if both fields are valid
    }
  }

  validateRowRange() {
    this.startRowError = null;
    this.endRowError = null;
  
    if (!this.startRow || this.startRow <= 1) {
      this.startRowError = 'Must be greater than 1';
    }
  
    if (!this.endRow || this.endRow <= 1) {
      this.endRowError = 'Must be greater than 1';
    }
  
    if (this.startRow && this.endRow) {
      if (this.startRow > this.endRow) {
        this.startRowError = 'Must be smaller than end row';
        this.endRowError = 'Must be greater than start row';
      }
    }
  }
  onNextClick() {
    const phoneField = this.selectedPhoneField || this.excelColumns[0];
    const codeField = this.selectedCountryCodeColumn || '';
  
    // For 'without' option: check if some phone numbers already have country code
    if (this.countryCodeOption === 'without' && this.excelData?.length) {
      const alreadyWithCode = this.excelData.some(row => {
        const phone = row?.[phoneField];
        return typeof phone === 'string' && /^\+\d{1,4}/.test(phone.trim());
      });
  
      if (alreadyWithCode) {
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '550px',
          disableClose: true,
          data: {
            title: 'Country Code Conflict',
            message: 'Some phone numbers already contain a country code. Add again or switch to "Number contains country code"?',
            confirmText: 'Yes, switch to "with"',
            cancelText: 'No, add again'
          }
        });
  
        dialogRef.afterClosed().subscribe(choice => {
          if (choice === 'yes') {
            this.countryCodeOption = 'with';
            this.selectedCountryCodeColumn = '';
          }
          this.goToPreview(); // ✅ Proceed either way
        });
  
        return; // wait for user choice before continuing
      }
    }
  
    // ✅ Additional validation for 'column' option
    if (this.countryCodeOption === 'column' && this.excelData?.length) {
      const missingData = this.excelData.some(row => {
        const code = row?.[codeField];
        const phone = row?.[phoneField];
        return !code && !phone;
      });
  
      if (missingData) {
        alert('Some rows are missing both phone number and country code. Please check your data.');
        return;
      }
    }
  
    this.goToPreview(); // ✅ If everything okay
  }  
  
}
