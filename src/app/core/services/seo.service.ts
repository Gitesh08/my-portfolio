import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  constructor(
    private titleService: Title,
    private metaService: Meta,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

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
    const head = document.getElementsByTagName('head')[0];
    let element: HTMLLinkElement | null = document.querySelector(`link[rel='canonical']`) || null;
    if (element == null) {
      element = document.createElement('link') as HTMLLinkElement;
      head.appendChild(element);
    }
    element.setAttribute('rel', 'canonical');
    element.setAttribute('href', url);
  }
}
