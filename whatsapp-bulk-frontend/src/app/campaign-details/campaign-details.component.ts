import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WhatsAppService } from '../whatsapp.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HtmlUtilsService } from '../Utils/helper';
import { APP_CONSTANTS } from '../shared/constants';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { EXCEL_TYPE } from '../shared/constants';

@Component({
  selector: 'app-campaign-details',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.css']
})
export class CampaignDetailsComponent implements OnInit {
  campaign: any;
  logs: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private whatsappService: WhatsAppService,
    private router: Router,
    private htmlUtils: HtmlUtilsService
  ) { }

  // ngOnInit(): void {
  //   const campaignId = this.route.snapshot.queryParamMap.get('campaignId');
  //   if (campaignId) {
  //     this.whatsappService.getCampaignDetails(campaignId).subscribe(data => {
  //       this.campaign = data.campaign;
  //       this.logs = data.logs;
  //     });
  //   }
  // }
  filter = {
    all: true,
    sent: false,
    notSent: false
  };
  
  originalLogs: any[] = []; // store full logs
  
  ngOnInit(): void {
    const campaignId = this.route.snapshot.queryParamMap.get('campaignId');
    if (campaignId) {
      this.whatsappService.getCampaignDetails(campaignId).subscribe(data => {
        this.campaign = data.campaign;
        this.originalLogs = data.logs;
        this.logs = [...this.originalLogs]; // initialize visible log
      });
    }
  }
  
  applyFilter(type: string) {
    console.log('Applying filter:', type, this.filter);

    if (type === 'all') {
      this.filter.sent = false;
      this.filter.notSent = false;
    } else {
      this.filter.all = false;
    }
  
    if (this.filter.all) {
      this.logs = [...this.originalLogs];
    } else {
      this.logs = this.originalLogs.filter(log => {
        if (this.filter.sent && log.status === 'Sent') return true;
        if (this.filter.notSent && log.status !== 'Sent') return true;
        return false;
      });
    }
  }
  
  goBack() {
    this.router.navigate(['/report']);
  }

  convertHtml(htmlContent: string) {
    return this.htmlUtils.htmlToPlain(htmlContent);
  }

  getShortMessage(htmlContent: string) {
    return this.htmlUtils.getShortMessage(htmlContent, APP_CONSTANTS.MSG_MAX_LENGTH);
  }

  get sentCount(): number {
    return this.logs.filter(l => l.status === 'sent').length;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'sent': return 'bg-success text-white';
      case 'Not on WhatsApp': return 'bg-warning text-dark';
      case 'Failed': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }
  // export to excel
  
  exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.logs);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, 'CampaignLogs.xlsx');
  }

  exportToCSV() {
    const worksheet = XLSX.utils.json_to_sheet(this.logs);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, 'CampaignLogs.csv');
  }
}



