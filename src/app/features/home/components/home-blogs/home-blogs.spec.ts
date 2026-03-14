import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBlogs } from './home-blogs';

describe('HomeBlogs', () => {
  let component: HomeBlogs;
  let fixture: ComponentFixture<HomeBlogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeBlogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeBlogs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
