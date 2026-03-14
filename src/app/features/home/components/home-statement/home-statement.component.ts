import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimate } from '../../../../shared/directives/scroll-animate';

@Component({
    selector: 'app-home-statement',
    standalone: true,
    imports: [CommonModule, ScrollAnimate],
    templateUrl: './home-statement.component.html',
    styleUrls: ['./home-statement.component.css']
})
export class HomeStatementComponent {
}
