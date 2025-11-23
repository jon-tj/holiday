import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-list-selector',
  imports: [],
  templateUrl: './list-selector.html',
  styleUrl: './list-selector.css',
})
export class ListSelector {
  @Input({ required: true }) items!: string[];
  @Input() title = "";
  @Output() selectedItem = new EventEmitter<string>();
  protected _selectedItem: string | null = null;

  protected click(item: string): void {
    this.selectedItem.emit(item);
    this._selectedItem = item;
  }
}
