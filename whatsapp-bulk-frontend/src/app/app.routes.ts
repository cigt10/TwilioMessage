// import { Routes } from '@angular/router';
// import { SendBulkComponent } from './send-bulk/send-bulk.component';

// export const routes: Routes = [
//   {
//     path: '',
//     component: SendBulkComponent
//   }
// ];

// import { Routes } from '@angular/router';

// export const routes: Routes = [];
import { Routes } from '@angular/router';
import { SendBulkComponent } from './send-bulk/send-bulk.component';
import { ViewReportsComponent } from './view-reports/view-reports.component'; // adjust path as needed
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExcelUploadComponent } from './excel-upload/excel-upload.component';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component'; // adjust path as needed
import { ViewAllReportsComponent } from './view-all-reports/view-all-reports.component';
import { TemplateMessageComponent } from './template-message/template-message.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'send-bulk', component: SendBulkComponent },
  { path: 'report', component: ViewReportsComponent },
  { path: 'excel-upload', component: ExcelUploadComponent },
  { path: 'campaign-details', component: CampaignDetailsComponent }, 
  { path: 'view-all-reports', component: ViewAllReportsComponent },
  { path: 'template-message', component: TemplateMessageComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];


