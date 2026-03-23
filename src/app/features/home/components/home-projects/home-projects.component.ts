import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ScrollAnimate } from '../../../../shared/directives/scroll-animate';
import { ProjectModalComponent } from '../../../projects/components/project-modal/project-modal.component';
import { ALL_PROJECTS } from '../../../../core/data/projects.data';

@Component({
  selector: 'app-home-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, ScrollAnimate, ProjectModalComponent],
  templateUrl: './home-projects.component.html',
  styleUrls: ['./home-projects.component.css']
})
export class HomeProjectsComponent {
  selectedProject = signal<any | null>(null);
  isModalOpen = signal<boolean>(false);

  // Show only projects marked for home page
  projects = ALL_PROJECTS.filter(p => p.showOnHome);

  openProject(project: any) {
    this.selectedProject.set(project);
    this.isModalOpen.set(true);
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen.set(false);
    setTimeout(() => {
      this.selectedProject.set(null);
    }, 400); // clear after animation finishes
    // Restore background scrolling
    document.body.style.overflow = '';
  }
}
