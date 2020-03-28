import { Email } from './../types/email.model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { EmailService } from '../services/email.service';
import {Location} from '@angular/common';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-mailbox-detail-view',
  templateUrl: './mailbox-detail-view.component.html',
  styleUrls: ['./mailbox-detail-view.component.less']
})
export class MailboxDetailViewComponent implements OnInit {
  mailbox: string;
  @Input() emailId: number;
  email: Email;
  objectKeys = Object.keys;
  isLoading = true;
  selectedTab = 'text_html';
  emailError: boolean;
  modalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private emailService: EmailService,
    private location: Location,
    private modalService: BsModalService,
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
            if (!data.hasOwnProperty('text_html')) {
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

  // deleteEmail() {

  // }
}
