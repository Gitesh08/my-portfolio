import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProjectModalComponent } from './components/project-modal/project-modal.component';
import { ScrollAnimate } from '../../shared/directives/scroll-animate';

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

  projects = [
    {
      id: 1,
      title: 'Katsura Resort (Personal Showcase)',
      tags: ['Angular 16', 'Firebase', 'Chart.js', 'RxJS'],
      description: 'A complete, full-stack solution for luxury hospitality management. Centralizing guest data and room bookings into a real-time, aesthetically premium dashboard.',
      imageUrl: 'katsura-images/image-1.png',
      images: [
        'katsura-images/image-1.png',
        'katsura-images/image-2.png',
      ],
      githubUrl: 'https://github.com/Gitesh08/katwate-resort',
      liveUrl: 'https://resort-demo-ten.vercel.app',
      role: 'Full Stack Developer',
      client: 'Personal Showcase',
      technologies: ['Angular 16', 'Firebase', 'Chart.js'],
      overview: [
        'I built this project to demonstrate a complete, full-stack solution for luxury hospitality management. The goal was to solve a common industry challenge: centralizing guest data and room bookings into a real-time, aesthetically premium dashboard.'
      ],
      highlights: [
        { title: 'Architecture', description: 'Built with Angular 16 to handle complex application states and modular component architecture.' },
        { title: 'Real-time Logic', description: 'Integrated Firebase to ensure live data syncing between the public booking entrance and the private admin control panel.' },
        { title: 'Management Suite', description: 'Developed a specialized Admin Dashboard featuring a visual booking calendar, a searchable guest data center, and real-time analytics powered by Chart.js.' },
        { title: 'Design Focus', description: 'Implemented a "Quiet Luxury" UI/UX, prioritizing clean typography and smooth transitions to match a high-end resort branding.' }
      ],
      showDemoButton: true,
      showLiveButton: true
    },
    {
      id: 2,
      title: 'Nailed Studio (Personal Showcase)',
      tags: ['Angular 21', 'Firebase', 'Lenis', 'GSAP'],
      description: 'A high-performance, boutique management system for luxury studios. Centralizing real-time platform scheduling that maintains a premium brand experience.',
      imageUrl: 'nail-studio-images/image-1.png',
      images: [
        'nail-studio-images/image-1.png',
        'nail-studio-images/image-2.png',
        'nail-studio-images/image-3.png',
        'nail-studio-images/image-4.png',
      ],
      liveUrl: 'https://nail-studio-blush.vercel.app', // placeholder live url to trigger button
      role: 'Full Stack Developer',
      client: 'Personal Showcase',
      technologies: ['Angular 21', 'Firebase', 'Lenis', 'GSAP'],
      overview: [
        'I built this project to demonstrate a high-performance, boutique management system for luxury studios. The goal was to solve a critical operational gap: moving from manual, fragmented scheduling to a centralized, real-time platform that maintains a premium brand experience.'
      ],
      highlights: [
        { title: 'Architecture', description: 'Built with Angular 21 to leverage the latest signals-based state management and a highly modular, component-driven UI.' },
        { title: 'Real-time Data', description: 'Integrated Firebase to handle live syncing for appointment bookings, ensuring the admin dashboard and client storefront are always in lockstep.' },
        { title: 'Admin Suite', description: 'Developed a specialized management dashboard featuring real-time appointment tracking, dynamic service configuration, and organized guest data management.' },
        { title: 'Premium UX', description: 'Implemented a "Quiet Luxury" design system using GSAP for sophisticated micro-interactions and Lenis for smooth, high-fidelity scrolling behaviors.' }
      ],
      showDemoButton: true,
      showLiveButton: true
    },
    {
      id: 3,
      title: 'Order Management System',
      tags: ['Angular', 'RxJS', 'SaaS', 'PWA'],
      description: 'A comprehensive, multi-tenant POS and order management solution designed for restaurants, handling everything from table reservations to POS billing and kitchen tickets (KOT).',
      imageUrl: 'order-management-images/image-1.png',
      images: [
        'order-management-images/image-1.png',
        'order-management-images/image-2.png',
        'order-management-images/image-3.png',
        'order-management-images/image-4.png',
        'order-management-images/image-5.png',
        'order-management-images/image-6.png',
        'order-management-images/image-7.png',
      ],
      role: 'Lead Frontend Developer',
      client: 'Multiple Restaurant Clients',
      technologies: ['Angular 16', 'RxJS', 'Tailwind CSS', 'Express.js', 'PostgreSQL'],
      overview: [
        'This Order Management System (OMS) was built to solve the operational chaos of managing a busy restaurant floor. It serves as a central hub for waitstaff, kitchen staff, and management.',
        'The system supports multiple tenant configurations, allowing different restaurants to operate uniquely while using the same core application architecture.'
      ],
      features: [
        'Real-time Kitchen Order Ticket (KOT) generation and printing.',
        'Dynamic table reservations and status tracking (Available, Occupied, Reserved).',
        'Complex billing calculations including dynamic taxes (GST) and discounts.',
        'Role-based access control (Admin, Waiter, Kitchen).'
      ],
      challenges: [
        'Handling complex, synchronized state across multiple devices (e.g., a waiter takes an order, and the kitchen display must update instantly).',
        'Generating accurate, formatted print documents (receipts, KOTs) directly from the browser.'
      ],
      solutions: [
        'Heavily leveraged RxJS observables and a robust centralized state management service to keep all clients in sync without tedious manual updates.',
        'Created a specialized PrintService that dynamically compiles HTML templates and triggers hidden print iframes for silent, accurate receipt printing.'
      ],
      showDemoButton: true,
      showLiveButton: false
    },
    {
      id: 4,
      title: 'Mermaid Diagram Generator',
      tags: ['Angular', 'AI/LLM', 'Gemini API'],
      description: 'Turn your ideas into beautiful, professional workflow diagrams just by describing them in plain English using Gemini AI.',
      imageUrl: 'https://via.placeholder.com/1200x675/8b5cf6/ffffff?text=Mermaid+Diagram+Generator',
      githubUrl: 'https://github.com/Gitesh08/mermaid-diagram',
      blogUrl: 'https://medium.com/google-cloud/how-to-generate-workflow-diagrams-using-gemini-8d3d538bd2e7',
      technologies: ['Angular', 'Google Gemini Pro API', 'Mermaid.js'],
      overview: [
        'As developers, creating system architectures and workflow diagrams can be tedious. I built this tool to automate the process using Google\'s Gemini LLM. You simply type what you want, and it writes the Mermaid.js syntax and renders the diagram in real-time.'
      ],
      showDemoButton: false,
      showLiveButton: false,
      showGithubButton: true
    }
  ];

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
