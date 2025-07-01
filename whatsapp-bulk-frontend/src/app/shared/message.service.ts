import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private message = new BehaviorSubject<string | null>(null);
  private templateName = new BehaviorSubject<string | null>(null);

  message$ = this.message.asObservable();
  templateName$ = this.templateName.asObservable();

  setMessage(message: string) {
    this.message.next(message);
  }

  setTemplateName(name: string) {
    this.templateName.next(name);
  }

  clear() {
    this.message.next(null);
    this.templateName.next(null);
  }
}
