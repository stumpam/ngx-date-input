import { TestBed, waitForAsync } from '@angular/core/testing';
import { NgxDateInputModule } from './ngx-date-input.module';

describe('NgxDateInputModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NgxDateInputModule],
    }).compileComponents();
  }));

  it('should create', () => {
    expect(NgxDateInputModule).toBeDefined();
  });
});
