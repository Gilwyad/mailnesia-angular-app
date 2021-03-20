import { Email } from './../types/email.model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { EmailService } from '../services/email.service';
import {Location} from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { HttpCacheService } from '../services/http-cache.service';

@Component({
  selector: 'app-mailbox-detail-view',
  templateUrl: './mailbox-detail-view.component.html',
  styleUrls: ['./mailbox-detail-view.component.less']
})
export class MailboxDetailViewComponent implements OnInit {
  @Input() emailId: number;
  mailbox: string;
  email: Email;
  objectKeys = Object.keys;
  isLoading = true;
  selectedTab = 'textHtml';
  emailError: boolean;
  modalRef: BsModalRef;
  deleteError = false;

  constructor(
    private route: ActivatedRoute,
    private emailService: EmailService,
    private location: Location,
    private modalService: BsModalService,
    private cacheService: HttpCacheService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.mailbox = params.mailbox;
        if (params.emailId) {
          this.emailId = params.emailId;
        }
        this.emailService.getEmail(this.mailbox, this.emailId).subscribe({
          next: (data: Email) => {
            this.email = data;
            if (!data.hasOwnProperty('textHtml')) {
              this.setSelectedTab(Object.keys(data)[0]);
            }
            this.isLoading = this.emailError = false;
          },
          error: (err: any) => {
            this.isLoading = false;
            this.emailError = true;
            this.email = null;
          }
        });
      }
    );
  }

  setSelectedTab(name: string) {
    this.selectedTab = name;
  }

  goBack() {
    this.location.back();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  invalidateEmailListCache() {
    this.cacheService.delete(`${this.emailService.url}/mailbox/${this.mailbox}`);
  }

  deleteEmail() {
    this.emailService.deleteEmail(this.mailbox, this.emailId).subscribe({
      next: () => {
        this.modalRef.hide();
        this.invalidateEmailListCache();
        this.deleteError = false;
        this.goBack();
      },
      error: (err: any) => {
        this.deleteError = true;
      }
    });
  }
}
