import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailboxNameService {
  private mailboxName = new BehaviorSubject('');
  selectedMailboxName = this.mailboxName.asObservable();

  constructor() { }

  changeMailboxName(name: string) {
    this.mailboxName.next(name);
  }
}
