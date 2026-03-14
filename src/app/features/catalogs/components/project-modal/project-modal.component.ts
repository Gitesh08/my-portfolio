import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-project-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './project-modal.component.html',
    styleUrls: ['./project-modal.component.css']
})
export class ProjectModalComponent {
    @Input() project: any = null;
    @Input() isOpen: boolean = false;
    @Output() close = new EventEmitter<void>();

    closeModal() {
        this.close.emit();
    }
}
