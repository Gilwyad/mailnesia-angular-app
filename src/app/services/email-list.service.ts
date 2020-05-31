import { environment } from './../../environments/environment';
import { EmailList } from './../types/email-list.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpBackend } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrors } from '../types/http-errors.model';

@Injectable({
  providedIn: 'root'
})
export class EmailListService {

  url = environment.backendApiUrl;
  httpClientSkipInterceptor: HttpClient;

  constructor(private http: HttpClient, handler: HttpBackend) {
    this.httpClientSkipInterceptor = new HttpClient(handler);
  }

  /** Load list of emails */
  getEmailList(mailboxName: string): Observable<EmailList[] | HttpErrors> {
    return this.http.get<EmailList[]>(`${this.url}/mailbox/${mailboxName}`)
      .pipe(
        catchError(err => this.handleHttpError(err))
      );
  }

  pollForNewMail(mailboxName: string, id = 0): Observable<EmailList[] | string | HttpErrors> {
    return this.httpClientSkipInterceptor.get<EmailList[]>(`${this.url}/mailbox/${mailboxName}?newerthan=${id}`)
      .pipe(
        catchError(err => this.handleHttpError(err))
      );
  }

  /** delete all emails in inbox */
  wipeMailbox(mailboxName: string): Observable<void | HttpErrors> {
    return this.http.delete<void>(`${this.url}/mailbox/${mailboxName}`)
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
