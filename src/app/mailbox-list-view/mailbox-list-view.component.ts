import { HttpCacheService } from './../services/http-cache.service';
import { MailboxNameService } from './../services/mailbox-name.service';
import { EmailList } from './../types/email-list.model';
import { EmailListService } from './../services/email-list.service';
import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrors } from '../types/http-errors.model';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-mailbox-list-view',
  templateUrl: './mailbox-list-view.component.html',
  styleUrls: ['./mailbox-list-view.component.less']
})
export class MailboxListViewComponent implements OnInit, OnDestroy {
  mailbox: string;
  emailList: EmailList[] = [];     // all emails
  emailListPage: EmailList[] = []; // emails on one page
  emailListError: HttpErrors;
  isLoading = true;
  numberOfEmailsPerPage: number;
  currentPage: number;
  pollForNewMailInterval = 60000;
  pollForNewMail;
  noEmail = false;
  modalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private emailListService: EmailListService,
    private router: Router,
    private nameService: MailboxNameService,
    private cacheService: HttpCacheService,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    // load the mailbox name from the URL into a variable
    // using observable subscription, so the variable is
    // updated when the URL is modified
    this.route.params.subscribe(
      params => {
        if (!params.mailbox) {
          return;
        }
        this.mailbox = params.mailbox;
        this.loadEmails(this.mailbox);
        this.startPolling(this.mailbox);
      }
    );

  }

  /** load list of emails of this mailbox */
  private loadEmails(mailbox: string) {
    this.emailListService.getEmailList(mailbox).subscribe({
      next: (data: EmailList[]) => {
        this.emailList = data.sort((a, b) => b.id < a.id ? -1 : 1);
        this.isLoading = false;
        this.emailListError = null;
        this.noEmail = this.emailList.length === 0;
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
        this.noEmail = false;
      },
    });
  }

  private startPolling(mailbox: string) {
    clearInterval(this.pollForNewMail);
    this.pollForNewMail = setInterval(() => {
      const newestEmailId = this.emailList.length ? this.emailList[0].id : 1;
      this.emailListService.pollForNewMail(mailbox, newestEmailId).subscribe({
        next: (data: EmailList[]) => {
          this.emailListError = null;
          if (data) {
            this.insertNewMailToTheTopOfTheList(data);
            this.invalidateEmailListCache();
          }
        },
        error: (err: HttpErrors) => {
          this.emailListError = err;
        },
      });
    }, this.pollForNewMailInterval);
  }

  ngOnDestroy(): void {
    clearInterval(this.pollForNewMail);
  }

  invalidateEmailListCache() {
    this.cacheService.delete(`${this.emailListService.url}/mailbox/${this.mailbox}`);
  }

  insertNewMailToTheTopOfTheList(newestMail: EmailList[]): void {
    if (!newestMail) {
      return;
    }
    this.emailList = [...newestMail, ...this.emailList];
    this.noEmail = false;
    if (this.currentPage === 1) {
      this.emailListPage = this.emailList.slice(0, this.numberOfEmailsPerPage);
    }
  }

  pageChanged(event: PageChangedEvent): void {
    this.nameService.changeCurrentEmailListPage(event);
  }

  openEmail(email: EmailList): void {
    this.router.navigate(['/mailbox', this.mailbox, email.id]);
  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  deleteAllEmails() {
    throw new Error(('not implemented'));
  }
}
