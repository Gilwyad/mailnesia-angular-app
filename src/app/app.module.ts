import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MailboxSettingsComponent } from './mailbox-settings/mailbox-settings.component';
import { MailboxListViewComponent } from './mailbox-list-view/mailbox-list-view.component';
import { MailboxDetailViewComponent } from './mailbox-detail-view/mailbox-detail-view.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    MailboxSettingsComponent,
    MailboxListViewComponent,
    MailboxDetailViewComponent,
    MainPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      { path: '', component: MainPageComponent },
      { path: 'settings/:mailbox', component: MailboxSettingsComponent },
      { path: 'mailbox/:mailbox', component: MailboxListViewComponent },
      { path: 'mailbox/:mailbox/:emailId', component: MailboxDetailViewComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
