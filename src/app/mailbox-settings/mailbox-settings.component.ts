import { VisitorList } from './../types/mailbox-settings.model';
import { MailboxSettingsService } from './../services/mailbox-settings.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
import { HttpErrors } from '../types/http-errors.model';

@Component({
  selector: 'app-mailbox-settings',
  templateUrl: './mailbox-settings.component.html',
  styleUrls: ['./mailbox-settings.component.less']
})
export class MailboxSettingsComponent implements OnInit {
  mailbox: string;
  visitorList: VisitorList[];
  error = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private mailboxSettingsService: MailboxSettingsService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.mailbox = params.mailbox;
        this.mailboxSettingsService.getVisitorList(this.mailbox).subscribe({
          next: (res: VisitorList[]) => {
            this.visitorList = res;
          },
          error: (err: HttpErrors) => {
            this.error = true;
          },
        });
      }
    );
  }

  goBack() {
    this.location.back();
  }
}
