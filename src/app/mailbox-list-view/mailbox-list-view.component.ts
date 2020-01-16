import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-mailbox-list-view',
  templateUrl: './mailbox-list-view.component.html',
  styleUrls: ['./mailbox-list-view.component.less']
})
export class MailboxListViewComponent implements OnInit {
  @Input() mailbox: string;

  constructor() { }

  ngOnInit() {
  }

}
