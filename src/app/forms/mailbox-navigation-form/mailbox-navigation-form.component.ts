import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MailboxNameService } from 'src/app/services/mailbox-name.service';

@Component({
    selector: 'app-mailbox-navigation-form',
    templateUrl: './mailbox-navigation-form.component.html',
    styleUrls: ['./mailbox-navigation-form.component.less'],
    standalone: false
})
export class MailboxNavigationFormComponent implements OnInit {
  mailboxNavigationForm = new UntypedFormGroup({
    mailbox: new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.pattern('[A-Za-z0-9.+_-]+')
      ])
  });

  selectedMailboxName: string;

  constructor(
    private router: Router,
    private mailboxName: MailboxNameService
  ) { }

  ngOnInit() {
    this.mailboxName.selectedMailboxName.subscribe(name => {
      this.selectedMailboxName = name;
      this.mailboxNavigationForm.setValue({mailbox: name});
    });
  }

  onSubmit() {
    this.mailboxName.changeMailboxName(this.mailboxNavigationForm.value.mailbox);
    this.router.navigate(['/mailbox', this.mailboxNavigationForm.value.mailbox]);
  }
}
