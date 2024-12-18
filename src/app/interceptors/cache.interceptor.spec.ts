import { HttpCacheService } from './../services/http-cache.service';
import { TestBed } from '@angular/core/testing';
import { CacheInterceptor } from './cache.interceptor';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient, HttpResponse, HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CacheInterceptorService', () => {
  let httpMock: HttpTestingController;
  let http: HttpClient;
  let cacheService: HttpCacheService;

  const createInterceptor = (httpCacheService: HttpCacheService) => new CacheInterceptor(httpCacheService);

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        HttpCacheService,
        {
            provide: HTTP_INTERCEPTORS,
            useFactory: createInterceptor,
            deps: [HttpCacheService],
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});

    httpMock = TestBed.inject(HttpTestingController);
    http = TestBed.inject(HttpClient);
    cacheService = TestBed.inject(HttpCacheService);
  });

  afterEach(() => {
    httpMock.verify();
  });


  it('should be created', () => {
    const service: CacheInterceptor = TestBed.inject(CacheInterceptor);
    expect(service).toBeTruthy();
  });


  it('first request should go to the backend', () => {
    const url = '/api/test';
    const testData1 = 'test data 1';
    const expectedResponse: HttpResponse<string> = new HttpResponse({
      body: testData1,
      url
    });
    expect(cacheService.get(url)).toBeFalsy();
    http.get(url).subscribe((response: string) => {
      expect(response).toEqual(testData1);
      expect(cacheService.get(url)).toEqual(expectedResponse);

      http.get(url).subscribe((secondResponse: string) => {
        expect(secondResponse).toEqual(testData1);
        expect(cacheService.get(url)).toEqual(expectedResponse);
      });

    });

    const request = httpMock.expectOne(url);
    request.flush(testData1);
  });

  it('request served from cache', () => {
    const url = '/api/test2';
    const testData1 = 'test data 2';
    const expectedResponse: HttpResponse<string> = new HttpResponse({
      body: testData1,
      url
    });
    cacheService.set(url, expectedResponse);
    expect(cacheService.get(url)).toBeTruthy();
    http.get(url).subscribe((response: string) => {
      expect(response).toEqual(testData1);
      expect(cacheService.get(url)).toEqual(expectedResponse);
    });

    httpMock.expectNone(url);
  });

});
