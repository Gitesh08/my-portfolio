import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeHeroComponent } from './components/home-hero/home-hero.component';
import { HomeStatementComponent } from './components/home-statement/home-statement.component';
import { HomeServicesComponent } from './components/home-services/home-services.component';
import { HomeProjectsComponent } from './components/home-projects/home-projects.component';
import { HomeCatalogsComponent } from './components/home-catalogs/home-catalogs.component';
import { HomeBlogsComponent } from './components/home-blogs/home-blogs.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        HomeHeroComponent,
        HomeStatementComponent,
        HomeServicesComponent,
        HomeProjectsComponent,
        HomeBlogsComponent,
        HomeCatalogsComponent
    ],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
}
