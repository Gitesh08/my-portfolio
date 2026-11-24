import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScrollAnimate } from '../../shared/directives/scroll-animate';
import { WinterModeService } from '../../core/services/winter-mode.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, ScrollAnimate],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  readonly winterService = inject(WinterModeService);

  toggleWinterMode(): void {
    this.winterService.toggle();
  }
}
