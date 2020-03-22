import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailboxNameService {
  private mailboxName = new BehaviorSubject('');
  private currentEmailListPage = new BehaviorSubject<PageChangedEvent>({
    page: 1,
    itemsPerPage: 10
  });
  selectedMailboxName = this.mailboxName.asObservable();
  selectedEmailListPage = this.currentEmailListPage.asObservable();

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

  changeCurrentEmailListPage(page: PageChangedEvent) {
    this.currentEmailListPage.next(page);
  }
}
