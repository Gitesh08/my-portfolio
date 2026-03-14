import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { take } from 'rxjs';
import { ScrollAnimate } from '../../shared/directives/scroll-animate';
import { BlogService, BlogPost } from '../../shared/services/blog.service';



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

  constructor(private blogService: BlogService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
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
