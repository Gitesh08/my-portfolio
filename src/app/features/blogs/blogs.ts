import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { take } from 'rxjs';
import { ScrollAnimate } from '../../shared/directives/scroll-animate';
import { BlogService, BlogPost } from '../../shared/services/blog.service';
import { SeoService } from '../../shared/services/seo.service';



@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, RouterModule, ScrollAnimate, HttpClientModule],
  templateUrl: './blogs.html',
  styleUrls: ['./blogs.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogsComponent implements OnInit, AfterViewInit, OnDestroy {

  blogs: BlogPost[] = [];
  isLoading = true;
  autoPlayInterval: any;

  private blogService = inject(BlogService);
  private cdr = inject(ChangeDetectorRef);
  private seo = inject(SeoService);

  ngOnInit(): void {
    this.seo.updateMeta({
      title: 'Blog | Gitesh Mahadik — Full-Stack Web Developer',
      description: 'Read articles and insights by Gitesh Mahadik on full-stack development, Angular, web design, AI integration, and more.',
      keywords: 'Gitesh Mahadik blog, Gitesh developer articles, full stack development blog, Angular tips, web development insights',
      url: '/blogs'
    });
    this.fetchMediumPosts();
  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
  }

  private fetchMediumPosts(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.blogService.getBlogs().pipe(take(1)).subscribe(blogs => {
      this.blogs = blogs;
      this.isLoading = false;
      this.cdr.markForCheck();
    });
  }

  openBlog(url: string) {
    window.open(url, '_blank', 'noopener');
  }

  viewProfile() {
    window.open('https://medium.com/@gitesh08', '_blank', 'noopener');
  }
}
