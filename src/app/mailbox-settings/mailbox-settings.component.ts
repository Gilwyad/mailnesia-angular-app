import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-mailbox-settings',
  templateUrl: './mailbox-settings.component.html',
  styleUrls: ['./mailbox-settings.component.less']
})
export class MailboxSettingsComponent implements OnInit {
  mailbox: string;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.mailbox = params.mailbox;
      }
    );
  }

  goBack() {
    this.location.back();
  }
}
