import { VisitorList } from './../types/mailbox-settings.model';
import { MailboxSettingsService } from './../services/mailbox-settings.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-mailbox-settings',
  templateUrl: './mailbox-settings.component.html',
  styleUrls: ['./mailbox-settings.component.less']
})
export class MailboxSettingsComponent implements OnInit {
  mailbox: string;
  visitorList: VisitorList[];
  errorLoadingVisitorList = false;
  errorLoadingAliasList = false;
  aliasList = new Set([]);
  aliasesLoading = false;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private mailboxSettingsService: MailboxSettingsService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe(
      params => {
        this.mailbox = params.mailbox;
        console.log(`got mailbox ${this.mailbox}`)
        this.mailboxSettingsService.getVisitorList(this.mailbox).subscribe({
          next: (res: VisitorList[]) => {
            this.visitorList = res;
          },
          error: () => {
            this.errorLoadingVisitorList = true;
          },
        });

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
    );
  }

  goBack() {
    this.location.back();
  }

  removeAlias(alias: string): boolean {
    return this.aliasList.delete(alias);
  }

  addAlias(alias: string) {
    this.mailboxSettingsService.addAlias(this.mailbox, alias).subscribe({
      next: () => {
        this.aliasList.add(alias);
      }
    });
    console.log(this.aliasList)
  }

  modifyAlias(oldAlias: string, newAlias: string) {
    if (oldAlias !== newAlias) {
      //FIXME: save to backend via API
      console.log(`removing ${oldAlias}, adding ${newAlias}`)
      this.removeAlias(oldAlias);
      this.addAlias(newAlias);
      console.log(this.aliasList)
    }
  }

  addNew() {
    this.aliasList.add('');
    console.log(this.aliasList);
  }

  /**
   * Add or modify alias
   *
   * @param oldAlias the alias to modify
   * @param newAlias the new alias to set
   * @returns void
   */
  selectOperation(oldAlias: string, newAlias: string) {
    this.removeAlias('');
    if (oldAlias) {
      return this.modifyAlias(oldAlias, newAlias);
    } else {
      return this.addAlias(newAlias);
    }
  }
}
