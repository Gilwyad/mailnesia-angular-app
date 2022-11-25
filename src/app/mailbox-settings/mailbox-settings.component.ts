import { VisitorList } from './../types/mailbox-settings.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MailboxSettingsService } from './../services/mailbox-settings.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mailbox-settings',
  templateUrl: './mailbox-settings.component.html',
  styleUrls: ['./mailbox-settings.component.less']
})
export class MailboxSettingsComponent implements OnInit, OnDestroy {
  mailbox: string;
  visitorList: VisitorList[] = [];
  errorLoadingVisitorList = false;
  errorLoadingAliasList = false;
  aliasError = false;
  aliasList = new Set([]);
  aliasesLoading = false;
  subscriptions: Subscription[] = [];
  mailboxForm: FormGroup;
  deleteLog: string[] = [];

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private mailboxSettingsService: MailboxSettingsService,
  ) { }

  ngOnInit() {
    this.subscriptions.push(this.route.params.subscribe(
      params => {
        this.mailbox = params.mailbox;
        this.getVisitorList();
        this.getAliasList();
      }
    ));
    this.mailboxForm = new FormGroup({
      mailbox: new FormControl('', [
        Validators.required,
        Validators.maxLength(30),
        Validators.pattern('[A-Za-z0-9.+_-]+')
        ])
    });

  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(element => {
      element.unsubscribe();
    });
  }

  goBack() {
    this.location.back();
  }

  removeAliasFromSet(alias: string): boolean {
    return this.aliasList.delete(alias);
  }

  addAliasToSet(alias: string = '') {
    this.aliasList.add(alias);
  }

  disableAddButton(): boolean {
    return this.aliasList.has('');
  }


  removeAlias(alias: string) {
    this.mailboxSettingsService.deleteAlias(this.mailbox, alias).subscribe({
      next: () => {
        this.removeAliasFromSet(alias);
        this.aliasError = false;
        this.deleteLog.push(`Alias ${alias} has been removed.`);
      },
      error: () => {
        //failed to remove alias
        this.aliasError = true;
      }
    });
  }

  addAlias(alias: string) {
    this.mailboxSettingsService.addAlias(this.mailbox, alias).subscribe({
      next: () => {
        this.removeAliasFromSet('');
        this.addAliasToSet(alias);
        this.mailboxForm.reset();
        this.aliasError = false;
      },
      error: () => {
        //failed to set alias
        this.aliasError = true;
      }
    });
  }

  private getVisitorList() {
    this.mailboxSettingsService.getVisitorList(this.mailbox).subscribe({
      next: (res: VisitorList[]) => {
        this.visitorList = res;
      },
      error: () => {
        this.errorLoadingVisitorList = true;
      },
    });
  }

  private getAliasList() {
    this.aliasesLoading = true;
    this.mailboxSettingsService.getAliasList(this.mailbox).subscribe({
      next: (res: string[]) => {
        this.aliasList = new Set(res);
        this.errorLoadingAliasList = false;
      },
      error: () => {
        this.errorLoadingAliasList = true;
      },
      complete: () => {
        this.aliasesLoading = false;
      },
    });
  }

}
