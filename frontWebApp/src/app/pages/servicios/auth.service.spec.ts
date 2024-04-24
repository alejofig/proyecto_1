import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should return access token', async () => {
    const mockTokenResponse = { access_token: 'mockAccessToken' };

    service.getManagementApiToken().then(token => {
      expect(token).toEqual('mockAccessToken');
    });

    const req = httpMock.expectOne(`https://${environment.auth0Domain}oauth/token`);
    expect(req.request.method).toBe('POST');
    req.flush(mockTokenResponse);
  });

  it('should handle errors when getting access token and return undefined', async () => {
    service.getManagementApiToken().then(token => {
      expect(token).toBeUndefined();
    });

    const req = httpMock.expectOne(`https://${environment.auth0Domain}oauth/token`);
    expect(req.request.method).toBe('POST');
    req.error(new ErrorEvent('API Error'));
  });

});
