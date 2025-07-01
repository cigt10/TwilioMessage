import { Component,  OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ViewChild, ElementRef } from '@angular/core';
import { WhatsAppService } from '../whatsapp.service';
import { WhatsAppRequest } from '../models/whatsapp-request';
import { COUNTRY_CODES } from '../shared/constants';
import { WhatsAppMsgResponse } from '../models/whats-app-msg-response';
import { TemplateMessageComponent } from '../template-message/template-message.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from '../shared/message.service';


@Component({
  selector: 'app-manual-entry',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './manual-entry.component.html',
  styleUrl: './manual-entry.component.css'
})
export class ManualEntryComponent implements OnInit {
  showAttachments = false;
  enableDelay = true;
  timeGap = 30;
  message: string = '';
  numbersInput: string = '';
  numbers: string[] = [];
  newNumber: string = '';
  countryCode: string = '+91';
  isOn = false;
  step: 'form' | 'processing' | 'result' = 'form';
  result: WhatsAppMsgResponse = {
    message: '',
    deliverMsgCount: 0,
    unDeliverMsgCount: 0,
    errorMessage: ''

  };
  whatsAppRequest: WhatsAppRequest = {
    encodedPhoneNumbers: '',
    message: '',
    files: []
  };
  countryCodes = COUNTRY_CODES;
  numberError: string = '';
  messageError: boolean = false;
  processing = false;
  completed = false;
  paused = false;
  sentCount = 0;
  notSentCount = 0;
  totalCount = 0;
  isPaused: boolean = false;
  //
  customMessage: string = '';
  selectedTemplateName: string = '';
  selectedMessageField: string = '';
  templateName: string = '';
  // error message
  errorMessage: string = '';
  //
  ngOnInit(): void {
    // this.messageService.message$.subscribe(msg => this.customMessage = msg ?? '');
    // this.messageService.templateName$.subscribe(name => this.templateName = name ?? '');
    
  }
  

  allowOnlyNumbersAndPlus(event: KeyboardEvent) {
    const allowedChars = /[0-9+]/;
    if (!allowedChars.test(event.key)) {
      event.preventDefault();
    }
  }
  
  addNumber() {
    const input = this.numbersInput.trim();
  
    if (!/^\d{10,15}$/.test(input)) {
      this.numberError = 'Enter a valid number (10–15 digits)';
      return;
    }
  
    this.numbers.push(input);
    this.numbersInput = '';
    this.numberError = '';
  }
  
  removeNumber(index: number) {
    this.numbers.splice(index, 1);
  }
  
  clearNumbers() {
    this.numbers = [];
  }
  
  @ViewChild('imageInput') imageInput!: ElementRef;
  @ViewChild('videoInput') videoInput!: ElementRef;
  @ViewChild('docInput') docInput!: ElementRef;

  selectedFiles: { type: string; file: File; error: string | null }[] = [];

  triggerFileSelect(type: string) {
    if (type === 'image') this.imageInput.nativeElement.click();
    else if (type === 'video') this.videoInput.nativeElement.click();
    else if (type === 'document') this.docInput.nativeElement.click();
  }
  
  handleFile(event: any, fileType: string) {
    const file = event.target.files[0];
    if (!file) return;
  
    let maxSize = 0;
    let error: string | null = null;
  
    switch (fileType.toLowerCase()) {
      case 'image':
        maxSize = 1 * 1024 * 1024; // 1MB
        if (file.size > maxSize) error = 'Image should be less than 1 MB.';
        break;
      case 'video':
        maxSize = 64 * 1024 * 1024; // 64MB
        if (file.size > maxSize) error = 'Video should be less than 64 MB.';
        break;
      case 'document':
        maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) error = 'Document should be less than 100 MB.';
        break;
      default:
        error = 'Unsupported file type.';
    }
  
    this.selectedFiles.push({ type: fileType, file, error });
    this.whatsAppRequest.files = this.selectedFiles
      .filter(f => !f.error)
      .map(f => f.file);

  }
  
  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  onSend() {
    console.log("Sending message:", this.message);
  }
  
  validateMessage() {
    this.messageError = !this.message || this.message.trim() === '';
  }
  constructor(private service: WhatsAppService, private messageService: MessageService, private router: Router,private dialog: MatDialog) { }
  sendMessages() {
    // ✅ Validate that at least one valid number is added
    if (this.numbers.length === 0) {
      this.numberError = 'Phone number is required.';
      return;
    }
  
    // ✅ Validate message
    // this.validateMessage();
    // if (this.messageError) return;
  
    const formData = new FormData();
  
    // ✅ Use the numbers from array, not from input
    const fullNumbers = this.numbers.map(num => this.countryCode + num)
    const encodedPhoneNumbers = btoa(fullNumbers.join(','));
    formData.append('EncodedPhoneNumbers', encodedPhoneNumbers);
    formData.append('Message', this.customMessage || '');
  
    // data source

    formData.append('DataSource', 'Copy-Paste');
    // ✅ Set message source based on template usage
    const templateName = this.getTemplateName();
    const isTemplateUsed = templateName !== 'Write Message Here';
    formData.append('MessageSource', isTemplateUsed ? 'Template' : 'Written');

    // ✅ Attach files

    if (this.whatsAppRequest.files) {
      for (let file of this.whatsAppRequest.files) {
        formData.append('Files', file);
      }
    }
    this.processing = true;
    this.step = 'processing';
    this.completed = false;
    this.sentCount = 0;
    this.notSentCount = 0;
    this.totalCount = this.numbers.length;

    this.service.sendBulkMessage(formData).subscribe(res => {
      this.result = res;
      this.isOn = true;
      this.sentCount = res.deliverMsgCount;
      this.notSentCount = res.unDeliverMsgCount;
      this.errorMessage = res.errorMessage;

    // ✅ Show result
    this.processing = false;
    this.completed = true;
    this.step = 'result';
    });
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
  //  Template Message 

  goToTemplateMessage() {
      const dialogRef = this.dialog.open(TemplateMessageComponent, {
        width: '500px',
        disableClose: true,
        data: {
          message: this.customMessage,
          excelColumns: [],
          templateName: this.selectedTemplateName          
          // excelColumns: this.excelColumns
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
  clearMessage(event: MouseEvent) {
    event.stopPropagation(); // prevent box click
    this.selectedTemplateName = '';
    this.customMessage = '';
  }
   getTemplateName(): string {
   return this.selectedTemplateName || 'Write Message Here';
  }  
  clearTemplateName(event: Event) {
    event.stopPropagation();
    this.selectedTemplateName = '';
    this.customMessage = ''; // optionally clear the message too
  }
  
}

