import { VisitorList } from './../types/mailbox-settings.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpBackend } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrors } from '../types/http-errors.model';

@Injectable({
  providedIn: 'root'
})
export class MailboxSettingsService {

  httpClientSkipInterceptor: HttpClient;

  constructor(handler: HttpBackend) {
    this.httpClientSkipInterceptor = new HttpClient(handler);
  }

  getVisitorList(mailbox: string): Observable<VisitorList[] | HttpErrors> {
    return this.httpClientSkipInterceptor.get<VisitorList[]>(`${environment.backendApiUrl}/visitors/${mailbox}`)
      .pipe(
        catchError(err => this.handleHttpError(err))
      );
  }

  getAliasList(mailbox: string): Observable<string[] | HttpErrors> {
    return this.httpClientSkipInterceptor.get<string[]>(`${environment.backendApiUrl}/alias/${mailbox}`)
      .pipe(
        catchError(err => this.handleHttpError(err))
      );
  }

  addAlias(mailbox: string, alias: string): Observable<void | HttpErrors> {
    return this.httpClientSkipInterceptor.post<void>(
        `${environment.backendApiUrl}/alias/${mailbox}/${alias}`, undefined
      ).pipe(
        catchError(err => this.handleHttpError(err))
      );
  }

  deleteAlias(mailbox: string, alias: string): Observable<void | HttpErrors> {
    return this.httpClientSkipInterceptor.delete<void>(
        `${environment.backendApiUrl}/alias/${mailbox}/${alias}`
      ).pipe(
        catchError(err => this.handleHttpError(err))
      );
  }

  modifyAlias(mailbox: string, oldAlias: string, newAlias: string): Observable<void | HttpErrors> {
    return this.httpClientSkipInterceptor.put<void>(
        `${environment.backendApiUrl}/alias/${mailbox}/${oldAlias}/${newAlias}`, undefined
      ).pipe(
        catchError(err => this.handleHttpError(err))
      );
  }

  handleHttpError(err: HttpErrorResponse): Observable<HttpErrors> {
    const errorObject: HttpErrors = {
      code: err.status,
      message: err.error,
      serverMessage: err.message
    };

    return throwError(errorObject);
  }

}
