import { Injectable, inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  url?: string;
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private doc = inject(DOCUMENT);

  private readonly siteUrl = 'https://gitesh.is-a.dev';

  updateMeta(config: SeoConfig): void {
    const fullTitle = config.title;
    const url = config.url ? `${this.siteUrl}${config.url}` : this.siteUrl;

    // Title
    this.title.setTitle(fullTitle);

    // Primary
    this.meta.updateTag({ name: 'description', content: config.description });
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:url', content: url });

    // Twitter Card
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });

    // Canonical
    this.setCanonical(url);
  }

  private setCanonical(url: string): void {
    let link: HTMLLinkElement = this.doc.querySelector("link[rel='canonical']") as HTMLLinkElement;
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
