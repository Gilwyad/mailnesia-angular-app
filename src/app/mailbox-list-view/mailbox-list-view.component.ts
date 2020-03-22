import { MailboxNameService } from './../services/mailbox-name.service';
import { EmailList } from './../types/email-list.model';
import { EmailListService } from './../services/email-list.service';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrors } from '../types/http-errors.model';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';

@Component({
  selector: 'app-mailbox-list-view',
  templateUrl: './mailbox-list-view.component.html',
  styleUrls: ['./mailbox-list-view.component.less']
})
export class MailboxListViewComponent implements OnInit {
  mailbox: string;
  emailList: EmailList[];     // all emails
  emailListPage: EmailList[]; // emails on one page
  emailListError: HttpErrors;
  isLoading = true;
  numberOfEmailsPerPage: number;
  currentPage: number;

  constructor(
    private route: ActivatedRoute,
    private emailListService: EmailListService,
    private router: Router,
    private nameService: MailboxNameService,
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
            this.emailList = data.sort((a, b) => a.id < b.id ? -1 : 1);
            this.isLoading = false;
            this.emailListError = null;

            this.nameService.selectedEmailListPage.subscribe((page: PageChangedEvent) => {
              this.currentPage = page.page;
              this.numberOfEmailsPerPage = page.itemsPerPage;
              const startItem = (page.page - 1) * page.itemsPerPage;
              const endItem = page.page * page.itemsPerPage;
              this.emailListPage = this.emailList.slice(startItem, endItem);
            });
          },
          error: (err: HttpErrors) => {
            this.emailListError = err;
            this.isLoading = false;
          },
        });
      }
    );

  }

  pageChanged(event: PageChangedEvent): void {
    this.nameService.changeCurrentEmailListPage(event);
  }

  openEmail(email: EmailList): void {
    this.router.navigate(['/mailbox', this.mailbox, email.id]);
  }

}
