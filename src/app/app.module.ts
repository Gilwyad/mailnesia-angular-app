import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MailboxSettingsComponent } from './mailbox-settings/mailbox-settings.component';
import { MailboxListViewComponent } from './mailbox-list-view/mailbox-list-view.component';
import { MailboxDetailViewComponent } from './mailbox-detail-view/mailbox-detail-view.component';

@NgModule({
  declarations: [
    AppComponent,
    MailboxSettingsComponent,
    MailboxListViewComponent,
    MailboxDetailViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
