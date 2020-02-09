import { Email } from './../types/email.model';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { EmailService } from '../services/email.service';

@Component({
  selector: 'app-mailbox-detail-view',
  templateUrl: './mailbox-detail-view.component.html',
  styleUrls: ['./mailbox-detail-view.component.less']
})
export class MailboxDetailViewComponent implements OnInit {
  mailbox: string;
  emailId: number;
  email: Email;
  objectKeys = Object.keys;
  isLoading = true;
  selectedTab = 'text_html';
  emailError: boolean;
  // TODO: emailId input parameter

  constructor(
    private route: ActivatedRoute,
    private emailService: EmailService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.mailbox = params.mailbox;
        this.emailId = params.emailId;
        this.emailService.getEmail(this.mailbox, this.emailId).subscribe({
          next: (data: Email) => {
            this.email = data;
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
}
