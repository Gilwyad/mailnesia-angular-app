import { TestBed } from '@angular/core/testing';

import { CacheInterceptor } from './cache.interceptor';

describe('CacheInterceptorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CacheInterceptor = TestBed.get(CacheInterceptor);
    expect(service).toBeTruthy();
  });
});
