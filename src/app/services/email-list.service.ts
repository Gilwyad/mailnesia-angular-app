import { EmailList } from './../types/email-list.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailListService {

  constructor() { }

  private testEmailList: EmailList[] = [
    {
      id: 1,
      date: new Date('1999-02-02'),
      from: 'test sender1',
      subject: 'first subject',
      to: 'one'
    },
    {
      id: 2,
      date: new Date('1999-02-03'),
      from: 'test sender2',
      subject: 'second subject',
      to: 'two'
    }
  ];

  /** Load list of emails */
  getEmailList() {
    return this.testEmailList;
  }
}
