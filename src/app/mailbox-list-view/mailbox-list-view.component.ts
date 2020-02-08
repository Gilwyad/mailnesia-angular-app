import { EmailListService } from './../services/email-list.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmailList } from '../types/email-list.model';
import { HttpErrors } from '../types/http-errors.model';

@Component({
  selector: 'app-mailbox-list-view',
  templateUrl: './mailbox-list-view.component.html',
  styleUrls: ['./mailbox-list-view.component.less']
})
export class MailboxListViewComponent implements OnInit {
  mailbox: string;
  emailList: EmailList[];
  emailListError: HttpErrors;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private emailListService: EmailListService
  ) { }

  ngOnInit() {
    // load the mailbox name from the URL into a variable
    // using observable subscription, so the variable is
    // updated when the URL is modified
    this.route.params.subscribe(
      params => {
        this.mailbox = params.mailbox;
        // load list of emails of this mailbox
        this.emailListService.getEmailList(this.mailbox).subscribe({
          next: (data: EmailList[]) => {
            this.emailList = data;
            this.isLoading = false;
          },
          error: (err: HttpErrors) => {
            this.emailListError = err;
            this.isLoading = false;
          },
        });
      }
    );

  }

}
