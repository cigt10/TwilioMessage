import { Component,OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TemplateService } from '../template.service';
import { MessageTemplate } from '../models/message-template';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { QuillModule } from 'ngx-quill';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from '../shared/message.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-template-message',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, QuillModule, MatMenuModule],
  templateUrl: './template-message.component.html',
  styleUrls: ['./template-message.component.css']
})
export class TemplateMessageComponent implements OnInit {
  templates: MessageTemplate[] = [];
  selectedTemplateId: number | null = null;
  message: string = '';
  creatingTemplate = false;
  isEditing = false;
  newTemplateName: string = '';
  dropdownOpen = false;
  hoveredTemplateId: number | null = null;
  newTemplateMessage = '';
  hoveringDropdown: boolean = false;
  selectedTemplate: string | null = null;
  selectedTemplateName: string = '';
  templateName: string = '';

  excelColumns: string[] = [];

  constructor(private templateService: TemplateService,   private messageService: MessageService,
    public dialogRef: MatDialogRef<TemplateMessageComponent>, private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: { message: string, excelColumns: string[] ,templateName: string}
  ) {
    this.message = data.message || '';
    this.excelColumns = data.excelColumns || []; // ✅ Initialize from dialog data
    this.selectedTemplateName = data.templateName || ''; // ✅ Initialize from dialog data
  }
  onTemplateSelect(template: any) {
    this.message = template.content; // or template.message
    this.selectedTemplate = template.name; // store actual name
  }  
  onDone() {
    // this.messageService.setMessage(this.message);
    // this.messageService.setTemplateName(this.selectedTemplateName || 'Template  Message');
    // this.router.navigate(['']);
    this.dialogRef.close({
      message: this.message,
      templateName: this.selectedTemplateName || 'Whatsapp Message'
      // templateName: this.templateName || 'Whatsapp Message'

    });
  }
  
  ngOnInit(): void {
    this.loadTemplates();
  }
  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],              // toggled buttons
      [{ 'list': 'ordered'}, { 'list': 'bullet' }], // lists
      ['clean'],                                    // remove formatting
      ['link', 'image'],                            // media
      [{ 'size': [] }],                             // font size
    ]
  };   
    
  loadTemplates(): void {
    this.templateService.getTemplates().subscribe(data => {
      this.templates = data;
    });
  }
  insertVariable(column: string) {
    this.message += `@${column}`;
  }  
  onTemplateChange(): void {
    const selected = this.templates.find(t => t.templateId === +this.selectedTemplateId!);
    if (selected) {
      this.message = selected.templateMessage;
    }
  }

  clearTemplate(): void {
    this.selectedTemplateId = null;
    this.message = '';
    this.templateName = '';
  }

  cancelCreateEdit(): void {
    this.creatingTemplate = false;
    this.isEditing = false;
    this.newTemplateName = '';
    this.message = '';
  }

  editTemplate(template: any): void {
    this.creatingTemplate = true;
    this.isEditing = true;
    this.newTemplateName = template.templateName;
    this.message = template.templateMessage;
    this.selectedTemplateId = template.templateId;
  }  

  saveNewTemplate(): void {
    if (!this.newTemplateName.trim() || !this.message.trim()) {
      alert("Both template name and message are required.");
      return;
    }

    const payload: Partial<MessageTemplate> = {
      templateName: this.newTemplateName,
      templateMessage: this.message
    };

    if (this.isEditing && this.selectedTemplateId) {
      this.templateService.updateTemplate(this.selectedTemplateId, payload as MessageTemplate)
        .subscribe(() => {
          this.cancelCreateEdit();
          this.loadTemplates();
        });
    } else {
      this.templateService.createTemplate(payload).subscribe(() => {
        this.cancelCreateEdit();
        this.loadTemplates();
      });
    }
  }

  deleteTemplate(templateId: number): void {
    if (confirm('Are you sure you want to delete this template?')) {
      this.templateService.deleteTemplate(templateId).subscribe(() => {
        this.message = '';
        this.selectedTemplateId = null;
        this.loadTemplates();
      });
    }
  }  

  submitMessage(): void {
    console.log("Submitted message:", this.message);
    this.clearTemplate();
    close();
    // Send to backend if needed
  }
  getSelectedTemplateName() {
    const selected = this.templates.find(t => t.templateId === this.selectedTemplateId);
    return selected ? selected.templateName : '';
  }
  
  selectTemplate(template: MessageTemplate) {
    this.selectedTemplateId = template.templateId;
    this.message = template.templateMessage;
    this.selectedTemplateName = template.templateName; // ✅ add this line
    this.dropdownOpen = false;
  }
  
  startCreatingTemplate() {
    this.creatingTemplate = true;
    this.newTemplateName = '';
    this.newTemplateMessage = '';
    this.dropdownOpen = false;
  }
  
  cancelCreatingTemplate() {
    this.creatingTemplate = false;
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  closeModal() {
    this.dialogRef.close();
  }
}
