// src/app/shared/html-utils.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HtmlUtilsService {
  constructor() {}

  htmlToPlain(html: string): string {
    if (!html) return '';
  
    // Replace <br> and <p> tags with newlines
    let temp = html
      .replace(/<\/p>/gi, '\n')     // End of paragraph = newline
      .replace(/<br\s*\/?>/gi, '\n') // <br> tags to newline
      .replace(/<[^>]+>/g, '')       // Strip other HTML tags
      .replace(/&nbsp;/gi, ' ')      // Replace non-breaking spaces
      .replace(/&amp;/gi, '&')       // Common entity
      .replace(/\n\s+/g, '\n')       // Clean spaces after newlines
      .trim();                       // Trim leading/trailing
  
    return temp;
    }

    getShortMessage(message: string, maxLength: number = 100): string {
        if (!message) return '';
        // Flatten the message (remove HTML or whitespace noise)
        const plain = message
          .replace(/<[^>]*>/g, '')         // Strip HTML tags
          .replace(/&nbsp;/g, ' ')
          .replace(/\r?\n|\r/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      
        return plain.length > maxLength
          ? plain.slice(0, maxLength) + '...'
          : plain;
  } 
  
  stripHtml(html: string): string {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
  }

}
