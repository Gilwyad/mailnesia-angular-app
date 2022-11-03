import { VisitorList } from './../types/mailbox-settings.model';
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
  aliasList = new Set([]);
  aliasesLoading = false;
  subscriptions: Subscription[] = [];

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

  /**
   * Add or modify alias
   *
   * @param oldAlias the alias to modify
   * @param newAlias the new alias to set
   * @returns void
   */
  addOrModifyAlias(oldAlias: string, newAlias: string) {
    this.removeAliasFromSet('');
    if (oldAlias) {
      return this.modifyAlias(oldAlias, newAlias);
    } else {
      return this.addAlias(newAlias);
    }
  }

  removeAlias(alias: string) {
    this.mailboxSettingsService.deleteAlias(this.mailbox, alias).subscribe({
      next: () => {
        this.removeAliasFromSet(alias);
      },
      error: () => {
        //failed to remove alias
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

  private modifyAlias(oldAlias: string, newAlias: string) {
    if (oldAlias !== newAlias) {
      this.mailboxSettingsService.modifyAlias(this.mailbox, oldAlias, newAlias).subscribe({
        next: () => {
          this.removeAliasFromSet(oldAlias);
          this.addAliasToSet(newAlias);
        },
        error: () => {
          // failed to modify alias
        }
      });
    }
  }

  private addAlias(alias: string) {
    this.mailboxSettingsService.addAlias(this.mailbox, alias).subscribe({
      next: () => {
        this.addAliasToSet(alias);
      },
      error: () => {
        //failed to set alias
      }
    });
  }


}
