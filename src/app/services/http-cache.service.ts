import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpCacheService {

  private requests = new Map();

  constructor() { }

  set(url: string, response: HttpResponse<any>): void {
    this.requests.set(url, response);
  }

  get(url: string): HttpResponse<any> | undefined {
    return this.requests.get(url);
  }

  delete(url: string): void {
    this.requests.delete(url);
  }

  clear(): void {
    this.requests.clear();
  }
}
