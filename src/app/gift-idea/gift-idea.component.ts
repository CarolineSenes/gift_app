import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GiftIdea } from '../models/gift-idea-model';

@Component({
  selector: 'app-gift-idea',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gift-idea.component.html',
  styleUrl: './gift-idea.component.css'
})
export class GiftIdeaComponent {
  @Input() idea!: GiftIdea;
  @Output() editIdea = new EventEmitter<GiftIdea>();
  @Output() deleteIdea = new EventEmitter<GiftIdea>();

  /**
   * Emits the `editIdea` event with the current gift idea.
   * Triggered when the user clicks on the card to edit the idea.
   */
  onEdit() {
    this.editIdea.emit(this.idea);
  }

  /**
   * Emits the `deleteIdea` event with the current gift idea.
   * Stops the event propagation to prevent triggering other click events.
   */
  onDelete(event: Event) {
    event.stopPropagation();
    this.deleteIdea.emit(this.idea);
  }
}
