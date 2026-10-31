import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private isBrowser: boolean;

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

  init() {
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
        mergeMap((route) => {
          // Get both title and data from the route
          return route.data;
        })
      )
      .subscribe((data) => {
        const title = this.titleService.getTitle(); // Angular router automatically sets title if provided in routes array
        const description = data['description'] || 'Gitesh Mahadik is a full-stack web developer and designer with 2+ years of experience building fast, beautiful, and AI-powered web apps.';

        this.updateMetaTags(title, description, this.router.url);
      });
  }

  private updateMetaTags(title: string, description: string, url: string) {
    const fullUrl = `https://gitesh.is-a.dev${url}`;
    
    // Standard Meta
    this.metaService.updateTag({ name: 'description', content: description });
    
    // Open Graph
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:url', content: fullUrl });

    // Twitter
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    
    // Canonical link
    this.updateCanonicalUrl(fullUrl);
  }

  private updateCanonicalUrl(url: string) {
    if (!this.doc) return;
    let element: HTMLLinkElement | null = this.doc.querySelector(`link[rel='canonical']`);
    if (!element) {
      element = this.doc.createElement('link');
      element.setAttribute('rel', 'canonical');
      this.doc.head?.appendChild(element);
    }
    element.setAttribute('href', url);
  }
}
