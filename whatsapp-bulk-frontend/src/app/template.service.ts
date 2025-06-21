import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageTemplate } from './models/message-template';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private baseUrl = 'https://localhost:44338'; // change to your API

  constructor(private http: HttpClient) {}

  getTemplates(): Observable<MessageTemplate[]> {
    return this.http.get<MessageTemplate[]>(`${this.baseUrl}/templates`);
  }

  createTemplate(template: Partial<MessageTemplate>): Observable<MessageTemplate> {
    return this.http.post<MessageTemplate>(`${this.baseUrl}/templates`, template);
  }

  updateTemplate(id: number, template: MessageTemplate): Observable<MessageTemplate> {
    return this.http.put<MessageTemplate>(`${this.baseUrl}/templates/${id}`, template);
  }

  deleteTemplate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/templates/${id}`);
  }
}
