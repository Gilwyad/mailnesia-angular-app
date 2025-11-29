import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';

@Component({
    selector: 'app-mailbox-form',
    templateUrl: './mailbox-form.component.html',
    styleUrls: ['./mailbox-form.component.less'],
    standalone: false
})
export class MailboxFormComponent implements OnInit {
  mailboxForm = new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.pattern('[A-Za-z0-9.+_-]+')
  ]);

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.mailboxForm.value);
  }
}
