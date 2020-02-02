import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailboxNameService {
  private mailboxName = new BehaviorSubject('');
  selectedMailboxName = this.mailboxName.asObservable();

  constructor() {
    const mailbox = localStorage.getItem('mailbox');
    if (mailbox) {
      this.changeMailboxName(mailbox);
    }
  }

  changeMailboxName(name: string) {
    this.mailboxName.next(name);
    localStorage.setItem('mailbox', name);
  }
}
