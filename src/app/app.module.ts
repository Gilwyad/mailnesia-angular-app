import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MailboxSettingsComponent } from './mailbox-settings/mailbox-settings.component';
import { MailboxListViewComponent } from './mailbox-list-view/mailbox-list-view.component';
import { MailboxDetailViewComponent } from './mailbox-detail-view/mailbox-detail-view.component';
import { MainPageComponent } from './main-page/main-page.component';
import { RouterModule, Routes } from '@angular/router';
import { MailboxFormComponent } from './forms/mailbox-form/mailbox-form.component';
import { MailboxNavigationFormComponent } from './forms/mailbox-navigation-form/mailbox-navigation-form.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'settings/:mailbox', component: MailboxSettingsComponent },
  { path: 'mailbox/:mailbox', component: MailboxListViewComponent },
  { path: 'mailbox/:mailbox/:emailId', component: MailboxDetailViewComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    MailboxSettingsComponent,
    MailboxListViewComponent,
    MailboxDetailViewComponent,
    MainPageComponent,
    MailboxFormComponent,
    MailboxNavigationFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
