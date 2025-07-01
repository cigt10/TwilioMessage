import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhatsAppService } from '../whatsapp.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-reports.component.html',
  styleUrls: ['./view-reports.component.css'],
  providers: [WhatsAppService]
})
export class ViewReportsComponent implements OnInit {
  campaignReports: any[] = [];

  constructor(private whatsappService: WhatsAppService, private router: Router) {}

  ngOnInit(): void {
    this.loadAllReports();
  }

  loadAllReports(): void {
    this.whatsappService.getCampaignReports().subscribe(data => {
      this.campaignReports = data;
    });
  }  

  viewDetails(msgId: string): void {
    if (msgId) {
      this.router.navigate(['/campaign-details'], { queryParams: { campaignId: msgId } });
    } else {
      console.warn('Missing msgId for campaign.'); // ✅ check if msgId is present
    }
  }
  goToAllReports(): void {
    console.log('Navigating to all reports...');
    this.router.navigate(['/view-all-reports']);
  }

  exportToExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.campaignReports);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Delivery Report': worksheet },
      SheetNames: ['Delivery Report']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const data: Blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    FileSaver.saveAs(data, 'Delivery_Report.xlsx');
  }
  refreshReports() {
    this.loadAllReports();
  }
}
