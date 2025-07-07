import { Component, Output, Input, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-sidebar',
  imports: [CommonModule],
  templateUrl: './menu-sidebar.component.html',
  styleUrl: './menu-sidebar.component.css'
})
export class MenuSidebarComponent {
  // activePanel: string = 'excel';
  @Input() activePanel: string = '';
@Output() panelSelected = new EventEmitter<string>();

  
selectPanel(panel: string) {
  this.panelSelected.emit(panel);
}


}
