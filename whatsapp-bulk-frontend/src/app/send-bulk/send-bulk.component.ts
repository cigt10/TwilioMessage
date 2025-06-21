// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { WhatsAppService } from '../whatsapp.service';
// import * as XLSX from 'xlsx';


// @Component({
//   selector: 'app-send-bulk',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './send-bulk.component.html',
//   styleUrls: ['./send-bulk.component.css']
// })
import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // ✅ Important
import { WhatsAppService } from '../whatsapp.service';
import { RouterModule } from '@angular/router';
import { ExcelUploadComponent } from '../excel-upload/excel-upload.component';
import { ManualEntryComponent } from '../manual-entry/manual-entry.component';
import { MenuSidebarComponent } from '../menu-sidebar/menu-sidebar.component';
import { GoogleSheetComponent } from '../google-sheet/google-sheet.component';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-send-bulk',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule,
    ExcelUploadComponent, ManualEntryComponent, MenuSidebarComponent, GoogleSheetComponent],
  templateUrl: './send-bulk.component.html',
  styleUrl:'./send-bulk.component.css',
  providers: [WhatsAppService] // Optional if provided elsewhere
})
export class SendBulkComponent {
  isOn = false;
  numbersInput = '';
  message = '';
  result: WhatsAppMsgResponse | null = null; // correct type here

  activePanel: string = 'paste';
  currentStatus = 'active';
  showAttachments = false;
  
  constructor(private service: WhatsAppService) {}

  // sendMessages() {
  //   const numbers = this.numbersInput
  //     .split(',')
  //     .map(n => n.trim())
  //     .filter(Boolean);

  //   this.service.sendBulkMessage(numbers, this.message).subscribe(res => {
  //     this.result = res;
  //     this.isOn = true;
  //     alert(`Status: ${res.message}\nDelivered: ${res.deliverMsgCount}\nUndelivered: ${res.unDeliverMsgCount}`);
  //   });
  // }
  @ViewChild('imageInput') imageInput!: ElementRef;
  @ViewChild('videoInput') videoInput!: ElementRef;
  @ViewChild('docInput') docInput!: ElementRef;

  triggerFileSelect(type: string) {
    switch (type) {
      case 'image':
        this.imageInput.nativeElement.click();
        break;
      case 'video':
        this.videoInput.nativeElement.click();
        break;
      case 'document':
        this.docInput.nativeElement.click();
        break;
    }
  }

  handleFile(event: any, fileType: string) {
    const file = event.target.files[0];
    if (file) {
      console.log(`${fileType} selected:`, file);
      // You can upload or preview the file here
    }
  }
  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length !== 1) {
      console.error('Please upload a single file only.');
      return;
    }

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      const phoneNumbers = data
        .flat()
        .filter((val: any) => typeof val === 'string' || typeof val === 'number')
        .join(',');

      this.numbersInput = phoneNumbers;
    };

    reader.readAsBinaryString(target.files[0]);
  }
}
interface WhatsAppMsgResponse {
  message: string;
  deliverMsgCount: number;
  unDeliverMsgCount: number;
} 


// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { WhatsAppService } from '../whatsapp.service';
// import * as XLSX from 'xlsx';

// @Component({
//   selector: 'app-send-bulk',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './send-bulk.component.html',
//   styleUrls: ['./send-bulk.component.css']
// })
// export class SendBulkComponent {
//   isOn = false;
//   numbersInput = '';
//   message = '';
//   selectedFile: File | null = null;
//   result: any[] = [];

//   constructor(private service: WhatsAppService) {}

//   // Encode numbers, attach file, and send
//   sendMessages() {
//     const numbersArray = this.numbersInput
//       .split(',')
//       .map(n => n.trim())
//       .filter(Boolean);

//     if (numbersArray.length === 0 || !this.message.trim()) {
//       alert('Please enter phone numbers and a message.');
//       return;
//     }

//     const encodedNumbers = btoa(numbersArray.join('\n')); // Base64 encode

//     this.service.sendBulkMessage(encodedNumbers, this.message, this.selectedFile!)
//       .subscribe({
//         next: (res) => this.result = res as any[],
//         error: (err) => console.error('Error:', err)
//       });
//   }

//   // Handle Excel import
//   onFileChange(event: any): void {
//     const target: DataTransfer = <DataTransfer>(event.target);

//     if (target.files.length !== 1) {
//       console.error('Please upload a single file only.');
//       return;
//     }

//     const reader: FileReader = new FileReader();

//     reader.onload = (e: any) => {
//       const bstr: string = e.target.result;
//       const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

//       const wsname: string = wb.SheetNames[0];
//       const ws: XLSX.WorkSheet = wb.Sheets[wsname];

//       const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

//       const phoneNumbers = data
//         .flat()
//         .filter((val: any) => typeof val === 'string' || typeof val === 'number')
//         .join(',');

//       this.numbersInput = phoneNumbers;
//     };

//     reader.readAsBinaryString(target.files[0]);
//   }

//   // Capture media file (real file)
//   onMediaFileSelected(event: any) {
//     const file = event.target.files[0];
//     if (file) {
//       this.selectedFile = file;
//     }
//   }
// }
