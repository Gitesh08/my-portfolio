import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectModalComponent } from './components/project-modal/project-modal.component';
import { ScrollAnimate } from '../../shared/directives/scroll-animate';
import { ALL_PROJECTS } from '../../core/data/projects.data';
import { SeoService } from '../../shared/services/seo.service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, RouterModule, ProjectModalComponent, ScrollAnimate],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  private seo = inject(SeoService);

  // Using Signals for state management
  selectedProject = signal<any | null>(null);
  isModalOpen = signal<boolean>(false);

  projects = ALL_PROJECTS;

  ngOnInit(): void {
    this.seo.updateMeta({
      title: 'Projects | Gitesh Mahadik — Full-Stack Web Developer',
      description: 'Explore web applications and projects built by Gitesh Mahadik — full-stack developer. From real estate apps to AI-powered tools, see what Gitesh has built.',
      keywords: 'Gitesh Mahadik projects, Gitesh portfolio projects, full stack web apps, Angular projects, web developer portfolio',
      url: '/projects'
    });
  }

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
