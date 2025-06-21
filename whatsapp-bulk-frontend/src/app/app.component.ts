// import { Component } from '@angular/core';
// import { SendBulkComponent } from './send-bulk/send-bulk.component';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [SendBulkComponent], //  Import the standalone component here
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css'],
// })
// export class AppComponent {
//   title = 'whatsapp-bulk-frontend';
// }

// import { Component } from '@angular/core';
// import { SendBulkComponent } from './send-bulk/send-bulk.component';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [SendBulkComponent],
//   template: `<app-send-bulk></app-send-bulk>`,
// })
// export class AppComponent {}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
  
})
export class AppComponent {}


