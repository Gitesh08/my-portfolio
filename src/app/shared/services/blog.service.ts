import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, throwError, switchMap, map, shareReplay } from 'rxjs';

export interface BlogPost {
  title: string;
  url: string;
  pubDate: string;
  tags: string[];
  thumbnail: string;
  readingTime: number;
}

const FALLBACK_BLOGS: BlogPost[] = [
  {
    title: 'Mastering Angular: A Developer\'s Guide to Building Modern Web Apps',
    url: 'https://medium.com/@gitesh08/mastering-angular-a-developers-guide-to-building-modern-web-apps-386801f67466',
    pubDate: 'Oct 24, 2024',
    tags: ['Angular'],
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop',
    readingTime: 8
  },
  {
    title: 'Understanding Angular Zone.js vs Zoneless',
    url: 'https://medium.com/@gitesh08/understanding-angular-zone-js-vs-zoneless-6f619ef85bdd',
    pubDate: 'Sep 12, 2024',
    tags: ['Angular'],
    thumbnail: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&auto=format&fit=crop',
    readingTime: 6
  },
  {
    title: 'Mastering Angular Directives and Pipes in 2025',
    url: 'https://medium.com/@gitesh08/mastering-angular-directives-and-pipes-in-2025-858158145e32',
    pubDate: 'Jan 15, 2025',
    tags: ['Angular'],
    thumbnail: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&auto=format&fit=crop',
    readingTime: 7
  },
  {
    title: 'Become Certified Marketing Insider',
    url: 'https://medium.com/@gitesh08/become-certified-marketing-insider-aa033ee8a941',
    pubDate: 'Nov 5, 2024',
    tags: ['Marketing'],
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
    readingTime: 5
  },
  {
    title: 'Smart Compressor: The Ultimate Tool for Developers and Creators',
    url: 'https://medium.com/@gitesh08/smart-compressor-the-ultimate-tool-for-developers-and-creators-d7f7e2c2dfe3',
    pubDate: 'Dec 01, 2024',
    tags: ['Tools'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    readingTime: 6
  },
  {
    title: 'Angular v20 Unleashed: Every Update You Need to Know',
    url: 'https://medium.com/@gitesh08/angular-v20-unleashed-every-update-you-need-to-know-4ba4bd14c392',
    pubDate: 'Feb 10, 2025',
    tags: ['Angular v20'],
    thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?w=800&auto=format&fit=crop',
    readingTime: 9
  },
  {
    title: 'Angular Signals Without the Headache: Debounce, Throttle, and Merge',
    url: 'https://medium.com/@gitesh08/angular-signals-without-the-headache-debounce-throttle-and-merge-made-simple-eda9a99a7fe8',
    pubDate: 'Aug 20, 2024',
    tags: ['Angular'],
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop',
    readingTime: 7
  },
  {
    title: 'How to Pass Data Between Components in Angular',
    url: 'https://medium.com/@gitesh08/how-to-pass-data-between-components-in-angular-d45613bbde99',
    pubDate: 'Jul 15, 2024',
    tags: ['Angular'],
    thumbnail: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop',
    readingTime: 5
  }
];

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly FEED_URL = 'https://medium.com/feed/@gitesh08';
  private blogsCache$: Observable<BlogPost[]> | null = null;

  // Ordered proxies so we hit the fastest/most reliable first
  private readonly PROXIES = [
    (u: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(u)}`,
    (u: string) => `https://corsproxy.io/?url=${encodeURIComponent(u)}`,
    (u: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(u)}`,
  ];

  constructor(private http: HttpClient) {}

  /**
   * Returns an Observable of blog posts, either from memory cache or network.
   */
  getBlogs(): Observable<BlogPost[]> {
    if (!this.blogsCache$) {
      // 1. Try sequential network fetch
      // 2. Fall back to local FALLBACK if all proxies fail
      // 3. Cache the final result in memory for lifetime of app session
      this.blogsCache$ = this.fetchPostsRecursive(0).pipe(
        catchError(() => {
          console.warn('All proxies failed to fetch Medium RSS. Falling back to local fallback data.');
          return of(FALLBACK_BLOGS);
        }),
        shareReplay(1)
      );
    }
    return this.blogsCache$;
  }

  /**
   * Provide immediate fallback data for UI while loading via network.
   */
  getFallbackBlogs(): BlogPost[] {
    return FALLBACK_BLOGS;
  }

  /**
   * Try each proxy recursively, moving to next only if current fails HTTP or fails to parse.
   */
  private fetchPostsRecursive(index: number): Observable<BlogPost[]> {
    if (index >= this.PROXIES.length) {
      return throwError(() => new Error('All proxies failed'));
    }

    const proxyFn = this.PROXIES[index];
    const proxyUrl = proxyFn(this.FEED_URL);

    return this.http.get(proxyUrl, { responseType: 'text' }).pipe(
      map(raw => this.parseRssXml(raw, 8)),
      switchMap(blogs => {
        if (!blogs || blogs.length === 0) {
          throw new Error('Invalid or empty feed data from proxy');
        }
        return of(blogs);
      }),
      catchError(() => {
        // Current proxy failed or returned bad data, try the next one
        return this.fetchPostsRecursive(index + 1);
      })
    );
  }

  private parseRssXml(raw: string, limit: number): BlogPost[] {
    let xmlStr = raw;
    if (raw.trimStart().startsWith('{')) {
      try { xmlStr = JSON.parse(raw).contents ?? ''; } catch { return []; }
    }
    if (!xmlStr) return [];

    const xml = new DOMParser().parseFromString(xmlStr, 'text/xml');
    
    // Check for parsing errors
    const parserError = xml.querySelector('parsererror');
    if (parserError) {
       console.error('Error parsing RSS XML');
       return [];
    }

    const items = Array.from(xml.querySelectorAll('item'));
    if (!items.length) return [];

    return items.slice(0, limit).map((item, idx) => {
      const getText = (tag: string) => item.querySelector(tag)?.textContent?.trim() ?? '';
      const pubDate = getText('pubDate');
      const contentEncoded = item.getElementsByTagNameNS('*', 'encoded')[0]?.textContent ?? '';
      
      const categories = Array.from(item.querySelectorAll('category'))
        .map(c => c.textContent?.trim() ?? '').filter(Boolean);
        
      return {
        title: getText('title'),
        url: getText('link') || item.querySelector('guid')?.textContent?.trim() || '',
        pubDate: pubDate ? new Date(pubDate).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        }) : '',
        tags: categories.length ? categories : ['Blog'],
        thumbnail: this.extractFigureImage(contentEncoded) || FALLBACK_BLOGS[idx]?.thumbnail || FALLBACK_BLOGS[0].thumbnail,
        readingTime: this.estimateReadingTime(contentEncoded),
      };
    });
  }

  /** Finds the first <figure><img src> — this is the cover image in Medium RSS */
  private extractFigureImage = (html: string) =>
    html.match(/<figure[^>]*>\s*<img[^>]+src=["']([^"'>]+)["']/i)?.[1] ||
    html.match(/<img[^>]+src=["']([^"'>]+)["']/i)?.[1] || null;
    
  private stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');
  
  private estimateReadingTime = (html: string) =>
    Math.max(1, Math.round(this.stripHtml(html).split(/\s+/).length / 200));
}
