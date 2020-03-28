import { HttpCacheService } from './../services/http-cache.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CacheInterceptor implements HttpInterceptor {

  constructor(private cacheService: HttpCacheService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // delete url from cache for delete requests
    if (req.method === 'DELETE') {
      this.cacheService.delete(req.url);
    }

    // don't do anything if not GET, pass to next interceptor (if any)
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    // for GET requests: check the url in cache, return if found
    const cachedResponse: HttpResponse<any> = this.cacheService.get(req.url);
    if (cachedResponse) {
      console.log(`returning cached response: ${cachedResponse.url}`);
      return of(cachedResponse);
    }

    // else send request to server and add response to cache
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          console.log(`not adding response since status!=200: ${event.status}`);
          if (event.status === 200) {
            console.log(`adding response to cache: ${req.url}`);
            this.cacheService.set(req.url, event);
          }
        }
      })
    );
  }

}
