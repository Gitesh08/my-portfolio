import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollAnimate } from '../../../../shared/directives/scroll-animate';

@Component({
    selector: 'app-home-clients',
    standalone: true,
    imports: [CommonModule, ScrollAnimate],
    templateUrl: './home-clients.component.html',
    styleUrls: ['./home-clients.component.css']
})
export class HomeClientsComponent {
    clients = [
        { name: 'SKILLSHARE' },
        { name: 'BEHANCE' },
        { name: 'DRIBBBLE' }
    ];
}
