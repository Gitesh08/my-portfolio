export interface ProjectHighlight {
  title: string;
  description: string;
}

export interface Project {
  id: number;
  title: string;
  tags: string[];
  description: string;
  imageUrl: string;
  images?: string[];
  githubUrl?: string;
  liveUrl?: string;
  blogUrl?: string;
  role?: string;
  client?: string;
  technologies: string[];
  overview: string[];
  highlights?: ProjectHighlight[];
  features?: string[];
  challenges?: string[];
  solutions?: string[];
  showDemoButton: boolean;
  showLiveButton: boolean;
  showGithubButton?: boolean;
  showOnHome?: boolean;
}

export const ALL_PROJECTS: Project[] = [
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
    showLiveButton: true,
    showOnHome: true
  },
  {
    id: 2,
    title: 'LuxeSalon (Personal Showcase)',
    tags: ['Next.js 15', 'TypeScript', 'Tailwind CSS v4', 'Framer Motion', 'Zustand'],
    description: 'A high-end salon management and client experience platform featuring dual-view architecture, real-time token queue tracking, and an integrated admin operations dashboard.',
    imageUrl: 'nail-studio-images/image-1.png',
    images: [
      'nail-studio-images/image-1.png',
      'nail-studio-images/image-2.png',
      'nail-studio-images/image-3.png',
      'nail-studio-images/image-4.png',
    ],
    githubUrl: 'https://github.com/Gitesh08/luxesalon',
    liveUrl: 'https://luxesalon-sandy.vercel.app/',
    role: 'Full Stack Developer',
    client: 'Personal Showcase',
    technologies: ['Next.js 15', 'TypeScript', 'Tailwind CSS v4', 'Framer Motion', 'Zustand'],
    overview: [
      'LuxeSalon is a premium salon management and customer experience platform designed to solve common salon industry challenges: chaotic walk-in queues and lack of live transparency between salon owners and clients.',
      'It features a unified dual-view interface allowing seamless switching between an interactive customer booking storefront and an operational owner admin dashboard, synchronized purely client-side.'
    ],
    highlights: [
      { title: 'Architecture & State', description: 'Built with Next.js 15 (App Router), TypeScript, and Zustand with reactive LocalStorage persistence and BroadcastChannel sync across tabs without requiring a backend.' },
      { title: 'Real-time Queue & Booking', description: 'Engineered an interactive multi-step booking wizard with visual service and time-slot pickers, automated token generation (#A-042), and live queue wait-time estimation.' },
      { title: 'Admin Operations Suite', description: 'Developed an extensive management dashboard featuring a Bento-grid metrics overview, live queue manager with standby logic, bookings calendar, and dynamic menu & offers editor.' },
      { title: 'Editorial Luxury UX', description: 'Implemented "The Appointment Card" editorial design aesthetic using Cormorant Garamond typography, brushed gold accents, zero card grids, and fluid Framer Motion animations.' }
    ],
    showDemoButton: true,
    showLiveButton: true,
    showGithubButton: true,
    showOnHome: true
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
    showLiveButton: false,
    showOnHome: true
  },
  {
    id: 4,
    title: 'Property Mitra - Agentic AI Real Estate Chatbot',
    tags: ['Angular 19', 'FastAPI', 'Llama 3.3', 'RAG'],
    description: 'A high-performance Agentic AI assistant for real estate using RAG to fetch real properties and stream human-like responses in real-time.',
    imageUrl: 'property-mitra/image-1.png',
    images: [
      'property-mitra/image-1.png',
      'property-mitra/image-2.png',
      'property-mitra/image-3.png',
      'property-mitra/image-4.png',
      'property-mitra/image-5.png',
      'property-mitra/image-6.png',
    ],
    role: 'Full Stack AI Developer',
    client: 'Personal Showcase',
    technologies: ['Angular 19', 'FastAPI', 'Llama 3.3', 'ChromaDB', 'PostgreSQL', 'Upstash Redis'],
    overview: [
      'Property Mitra acts as a personalized consultant, using RAG (Retrieval-Augmented Generation) to fetch real properties from a database and stream human-like responses in real-time.',
      'Unlike basic bots, it features real-time training via an Owner Dashboard and a lead capture system.'
    ],
    highlights: [
      { title: 'Agentic Intelligence', description: 'Uses Llama 3.3 via Groq and NVIDIA NIM for semantic search, ensuring no hallucinations.' },
      { title: 'Real-time Streaming', description: 'Built with FastAPI and WebSockets for instant, typing-like responses.' },
      { title: 'Performance', description: 'Leverages Angular 19 with Signals on the frontend and Upstash Redis for high-performance rate limiting.' }
    ],
    showDemoButton: true,
    showLiveButton: false,
    showGithubButton: true,
    showOnHome: true
  }
];
