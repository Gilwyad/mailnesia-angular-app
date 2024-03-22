import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailboxNameService {
  mailboxName = new BehaviorSubject('');
  currentEmailListPage = new BehaviorSubject<PageChangedEvent>({
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
    if (localStorage.getItem('saveLastViewedMailbox')) {
      localStorage.setItem('mailbox', name);
    }
  }

  /**
   * @returns {string} the currently saved mailbox name
   */
  getMailboxName(): string {
    return this.mailboxName.getValue();
  }

  changeCurrentEmailListPage(page: PageChangedEvent) {
    this.currentEmailListPage.next(page);
  }
}
