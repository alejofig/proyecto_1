import { TestBed } from '@angular/core/testing';

import { UsersBackendService } from './users-backend.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

describe('UsersBackendService', () => {
  let service: UsersBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
        }
      }]
    });
    service = TestBed.inject(UsersBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
