import { environment } from './../../environments/environment';
import { EmailList } from './../types/email-list.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrors } from '../types/http-errors.model';

@Injectable({
  providedIn: 'root'
})
export class EmailListService {

  constructor(private http: HttpClient) { }

  /** Load list of emails */
  getEmailList(mailboxName: string): Observable<EmailList[] | HttpErrors> {
    return this.http.get<EmailList[]>(`${environment.backendApiUrl}/mailbox/${mailboxName}`)
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
