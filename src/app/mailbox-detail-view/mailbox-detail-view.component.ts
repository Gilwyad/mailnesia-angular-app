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
  email: string;

  constructor(
    private route: ActivatedRoute,
    private emailService: EmailService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.mailbox = params.mailbox;
        this.emailId = params.emailId;
        this.emailService.getEmail(this.mailbox, this.emailId).subscribe(
          (data: string) => this.email = data,
          (err: any) => console.error(err)
        );
      }
    );
  }
}
