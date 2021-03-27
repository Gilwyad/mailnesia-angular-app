import { Component, OnInit } from '@angular/core';
import { MailboxNameService } from '../services/mailbox-name.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {
  saveLastViewedMailbox = false;

  constructor(
    private mailboxName: MailboxNameService,
  ) { }

  ngOnInit(): void {
    this.saveLastViewedMailbox = !!localStorage.getItem('saveLastViewedMailbox');
  }

  toggleSaveMailbox(checked: boolean): void {
    this.saveLastViewedMailbox = checked;
    if (checked) {
      localStorage.setItem('saveLastViewedMailbox', 'true');
      localStorage.setItem('mailbox', this.mailboxName.getMailboxName());
    } else {
      localStorage.removeItem('saveLastViewedMailbox');
      localStorage.removeItem('mailbox');
    }

  }
}
