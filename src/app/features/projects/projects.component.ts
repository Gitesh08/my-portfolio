import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectModalComponent } from './components/project-modal/project-modal.component';
import { ScrollAnimate } from '../../shared/directives/scroll-animate';
import { ALL_PROJECTS } from '../../core/data/projects.data';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectModalComponent, ScrollAnimate],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent {
  // Using Signals for state management
  selectedProject = signal<any | null>(null);
  isModalOpen = signal<boolean>(false);

  projects = ALL_PROJECTS;

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
