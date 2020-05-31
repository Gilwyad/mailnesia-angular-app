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

  constructor(private http: HttpClient, handler: HttpBackend) {
    this.httpClientSkipInterceptor = new HttpClient(handler);
  }

  getVisitorList(mailboxName: string): Observable<VisitorList[] | HttpErrors> {
    return this.httpClientSkipInterceptor.get<VisitorList[]>(`${environment.backendApiUrl}/visitors/${mailboxName}`)
      .pipe(
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
