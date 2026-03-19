import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProcess } from './home-process';

describe('HomeProcess', () => {
  let component: HomeProcess;
  let fixture: ComponentFixture<HomeProcess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProcess]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProcess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
