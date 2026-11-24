import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private isBrowser: boolean;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Initializes router subscription to track virtual pageviews on every route change.
   * Essential for Single Page Applications (SPAs) so Google Analytics doesn't only record the first landing page.
   */
  init(): void {
    if (!this.isBrowser) return;

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.trackPageView(event.urlAfterRedirects);
      });
  }

  /**
   * Pushes a virtual pageview event to Google Tag Manager dataLayer and gtag.
   */
  trackPageView(url: string, title?: string): void {
    if (!this.isBrowser) return;

    window.dataLayer = window.dataLayer || [];
    const pageTitle = title || document.title;
    const pageLocation = window.location.href;

    window.dataLayer.push({
      event: 'page_view',
      page_path: url,
      page_title: pageTitle,
      page_location: pageLocation
    });

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: url,
        page_title: pageTitle,
        page_location: pageLocation
      });
    }
  }

  /**
   * Track custom portfolio events (e.g., 'generate_lead', 'project_view', 'social_click').
   */
  trackEvent(eventName: string, params?: Record<string, any>): void {
    if (!this.isBrowser) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: eventName,
      ...params
    });

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  }
}
