import { Component, OnInit } from '@angular/core';
import { WhatsAppService } from '../whatsapp.service';
import { WhatsAppMessageLog } from '../models/whatsapp-message-log';
import * as XLSX from 'xlsx';
import { CommonModule } from '@angular/common';   

@Component({
  selector: 'app-view-all-reports',
  imports: [CommonModule], 
  templateUrl: './view-all-reports.component.html',
  styleUrl: './view-all-reports.component.css'
})
export class ViewAllReportsComponent implements OnInit {
  logs: WhatsAppMessageLog[] = [];

  constructor(private logService: WhatsAppService) {}

  ngOnInit(): void {
    this.fetchReports();
  }

  fetchReports(): void {
    this.logService.getReports().subscribe({
      next: (data) => {
        this.logs = data.map(item => ({
          ...item,
          sentAt: typeof item.sentAt === 'object' ? item.sentAt : new Date(item.sentAt)
        }));
      },
      error: (err) => {
        console.error('Error fetching reports:', err);
      }
    });
  }

  exportToExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.logs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Delivery Report');
    XLSX.writeFile(workbook, 'DeliveryReport.xlsx');
  }
}
