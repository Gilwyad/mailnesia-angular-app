import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrors } from '../types/http-errors.model';
import { Email } from '../types/email.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private http: HttpClient) { }

  getEmail(mailboxName: string, emailId: number): Observable<Email | HttpErrors> {
    return this.http.get<Email>(`${environment.backendApiUrl}/mailbox/${mailboxName}/${emailId}`)
      .pipe(
        catchError(err => this.handleHttpError(err))
      );
  }

  getRawEmail(mailboxName: string, emailId: number): Observable<string | HttpErrors> {
    return this.http.get<string>(`${environment.backendApiUrl}/mailbox/${mailboxName}/${emailId}/raw`)
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
