import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WhatsAppService } from '../whatsapp.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HtmlUtilsService } from '../Utils/helper';

@Component({
  selector: 'app-campaign-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.css']
})
export class CampaignDetailsComponent implements OnInit {
  logs: any[] = [];

  constructor(private route: ActivatedRoute, private whatsappService: WhatsAppService, private router: Router, private htmlUtils: HtmlUtilsService) {} // adjust path as needed

  ngOnInit(): void {
    const msgId = this.route.snapshot.queryParamMap.get('msgId');
    if (msgId) {
      this.whatsappService.getCampaignDetails(msgId).subscribe(data => {
        this.logs = data;
      });
    }
  }
  goBack() {
    // Example for Angular router
    this.router.navigate(['/report']);
  }
  convertHtml(htmlContent: string) {
    return this.htmlUtils.htmlToPlain(htmlContent);
  }

  getShortMessage(htmlContent: string, maxLength: number = 100 ) {
    return this.htmlUtils.getShortMessage(htmlContent, maxLength);
  }
}
