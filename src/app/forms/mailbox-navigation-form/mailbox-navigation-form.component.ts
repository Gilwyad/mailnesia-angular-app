import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-mailbox-navigation-form',
  templateUrl: './mailbox-navigation-form.component.html',
  styleUrls: ['./mailbox-navigation-form.component.less']
})
export class MailboxNavigationFormComponent implements OnInit {
  mailboxNavigationForm = new FormGroup({
    mailbox: new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.pattern('[a-z0-9.+_-]+')
      ])
  });

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.mailboxNavigationForm.value);
  }
}
