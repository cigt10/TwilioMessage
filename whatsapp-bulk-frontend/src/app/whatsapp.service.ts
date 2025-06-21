// // import { Injectable } from '@angular/core';
// // import { HttpClient } from '@angular/common/http';

// // @Injectable({ providedIn: 'root' })
// // export class WhatsAppService {
// //   private apiUrl = 'http://localhost:3000/api/send-bulk';

//   constructor(private http: HttpClient) {}

//   sendBulkMessage(numbers: string[], message: string, mediaUrl: string) {
//     return this.http.post(this.apiUrl, { numbers, message, mediaUrl });
//   }
// }
// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//   providedIn: 'root'
// })
// export class WhatsAppService {
//   constructor(private http: HttpClient) {}

//   sendBulkMessage(numbers: string[], message: string) {
//     return this.http.post('/api/send-bulk', { numbers, message });
//   }
// }

// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class WhatsAppService {

//   private apiUrl = 'https://localhost:7018/send-whatsapp'; // <-- Your local API URL

//   constructor(private http: HttpClient) {}

//   sendBulkMessage(numbers: string[], message: string, mediaUrl: string) {
//     const body = {
//       encodedPhoneNumbers: btoa(numbers.join(',')  ), // base64 encode comma-separated numbers
//       message: message,
//       mediaUrl: mediaUrl
//     };
//     return this.http.post<WhatsAppMsgResponse>(this.apiUrl, body);
//   }
// }
// export interface WhatsAppMsgResponse {
//   message: string;
//   deliverMsgCount: number;
//   unDeliverMsgCount: number;
// }
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface WhatsAppMsgResponse {
  message: string;
  deliverMsgCount: number;
  unDeliverMsgCount: number;
}

export interface WhatsAppMessageLog {
  msgId: string;
  phoneNumber: string;
  message: string;
  status: string;
  sentAt: Date; // ✅ Correctly defined as Date
}

@Injectable({
  providedIn: 'root'
})
export class WhatsAppService {
  private apiUrl = 'https://localhost:44338/sendmessage';
  private reportUrl = 'https://localhost:44338/reports';
  private campaignReportUrl = 'https://localhost:44338/reports/campaigns';
  private campaignDetailsUrl = 'https://localhost:44338/reports/by-campaign';

  constructor(private http: HttpClient) {}

  sendBulkMessage(formData: FormData) {
    // const body = {
    //   encodedPhoneNumbers: btoa(numbers.join(',')),
    //   message: message,
    // };
    return this.http.post<WhatsAppMsgResponse>(this.apiUrl, formData);
  }

  getReports(): Observable<WhatsAppMessageLog[]> {
    return this.http.get<WhatsAppMessageLog[]>(this.reportUrl);
  }
  getCampaignReports(): Observable<any[]> {
    return this.http.get<any[]>(this.campaignReportUrl);
  }
  
  getCampaignDetails(msgId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.campaignDetailsUrl}/${msgId}`);
  }
  
}


// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class WhatsAppService {
//   private apiUrl = 'http://192.168.0.103/send-whatsapp'; // Your local API endpoint

//   constructor(private http: HttpClient) {}

//   sendBulkMessage(encodedPhoneNumbers: string, message: string, mediaFile?: File) {
//     const formData = new FormData();

//     formData.append('encodedPhoneNumbers', encodedPhoneNumbers);
//     formData.append('message', message);

//     if (mediaFile) {
//       formData.append('media', mediaFile); // Must match server's expected name
//     }

//     return this.http.post(this.apiUrl, formData);
//   }
// }
