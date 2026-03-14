import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { take} from 'rxjs';
import { ScrollAnimate } from '../../../../shared/directives/scroll-animate';
import { BlogService, BlogPost } from '../../../../shared/services/blog.service';



@Component({
    selector: 'app-home-blogs',
    standalone: true,
    imports: [CommonModule, RouterModule, ScrollAnimate, HttpClientModule],
    templateUrl: './home-blogs.component.html',
    styleUrls: ['./home-blogs.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeBlogsComponent implements OnInit {
    blogs: BlogPost[] = [];
    isLoading = true;

    constructor(private blogService: BlogService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.fetchMediumPosts();
    }

    private fetchMediumPosts(): void {
        this.isLoading = true;
        this.cdr.markForCheck();

        // Subscribe to cached service data
        this.blogService.getBlogs().pipe(take(1)).subscribe(blogs => {
            this.blogs = blogs.slice(0, 2); // Home only needs 2 blogs
            this.isLoading = false;
            this.cdr.markForCheck();
        });
    }

    openBlog(url: string) {
        window.open(url, '_blank', 'noopener');
    }
}
