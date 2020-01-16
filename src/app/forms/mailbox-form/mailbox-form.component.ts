import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-mailbox-form',
  templateUrl: './mailbox-form.component.html',
  styleUrls: ['./mailbox-form.component.less']
})
export class MailboxFormComponent implements OnInit {
  mailboxForm = new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.pattern('[a-z0-9.+_-]+')
  ]);

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.mailboxForm.value);
  }
}
