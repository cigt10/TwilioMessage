import { Component,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu-sidebar',
  imports: [],
  templateUrl: './menu-sidebar.component.html',
  styleUrl: './menu-sidebar.component.css'
})
export class MenuSidebarComponent {
  // activePanel: string = 'excel';
  @Output() panelSelected = new EventEmitter<string>();

selectPanel(panel: string) {
  this.panelSelected.emit(panel);
}

}
