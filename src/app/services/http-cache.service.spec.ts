import { TestBed } from '@angular/core/testing';

import { HttpCacheService } from './http-cache.service';
import { HttpResponse } from '@angular/common/http';

describe('HttpCacheService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpCacheService = TestBed.get(HttpCacheService);
    expect(service).toBeTruthy();
  });

  it('service CRUD', () => {
    const service: HttpCacheService = TestBed.get(HttpCacheService);
    const testResponse: HttpResponse<string> = new HttpResponse({body: 'test1'});
    service.set('test1', testResponse);
    expect(service.get('test1')).toEqual(testResponse);

    expect(service.get('test2')).toEqual(undefined);

    const testResponse2: HttpResponse<string> = new HttpResponse({body: 'test2'});
    service.set('test2', testResponse2);
    expect(service.get('test2')).toEqual(testResponse2);

    service.delete('test2');
    expect(service.get('test2')).toEqual(undefined);

    service.clear();
    expect(service.get('test1')).toEqual(undefined);
  });

});
