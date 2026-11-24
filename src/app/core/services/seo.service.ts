import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  url?: string;
  image?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private isBrowser: boolean;
  private readonly defaultSiteUrl = 'https://gitesh.is-a.dev';
  private readonly defaultImage = 'https://gitesh.is-a.dev/hero-image.webp';

  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  init(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        const title = this.titleService.getTitle();
        const description = data['description'] || 'Gitesh Mahadik is a full-stack web developer and designer with 2+ years of experience building fast, beautiful, and AI-powered web apps.';

        this.updateMeta({
          title,
          description,
          url: this.router.url
        });
      });
  }

  updateMeta(config: SeoConfig): void {
    const fullTitle = config.title;
    const url = config.url ? `${this.defaultSiteUrl}${config.url.startsWith('/') ? config.url : '/' + config.url}` : this.defaultSiteUrl;
    const image = config.image || this.defaultImage;
    const type = config.type || 'website';

    // Title
    this.titleService.setTitle(fullTitle);

    // Primary Meta
    this.metaService.updateTag({ name: 'description', content: config.description });
    if (config.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: config.keywords });
    }

    // Open Graph
    this.metaService.updateTag({ property: 'og:title', content: fullTitle });
    this.metaService.updateTag({ property: 'og:description', content: config.description });
    this.metaService.updateTag({ property: 'og:url', content: url });
    this.metaService.updateTag({ property: 'og:type', content: type });
    this.metaService.updateTag({ property: 'og:image', content: image });
    this.metaService.updateTag({ property: 'og:image:alt', content: fullTitle });

    // Twitter Card
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: fullTitle });
    this.metaService.updateTag({ name: 'twitter:description', content: config.description });
    this.metaService.updateTag({ name: 'twitter:image', content: image });
    this.metaService.updateTag({ name: 'twitter:image:alt', content: fullTitle });

    // Canonical link
    this.updateCanonicalUrl(url);
  }

  private updateCanonicalUrl(url: string): void {
    if (!this.doc) return;
    let element: HTMLLinkElement | null = this.doc.querySelector("link[rel='canonical']");
    if (!element) {
      element = this.doc.createElement('link');
      element.setAttribute('rel', 'canonical');
      this.doc.head?.appendChild(element);
    }
    element.setAttribute('href', url);
  }
}
