import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MailboxSettingsComponent } from './mailbox-settings/mailbox-settings.component';
import { MailboxListViewComponent } from './mailbox-list-view/mailbox-list-view.component';
import { MailboxDetailViewComponent } from './mailbox-detail-view/mailbox-detail-view.component';
import { MainPageComponent } from './main-page/main-page.component';

const routes: Routes = [
  { path: '', component: MainPageComponent },
  { path: 'settings/:mailbox', component: MailboxSettingsComponent },
  { path: 'mailbox/:mailbox', component: MailboxListViewComponent },
  { path: 'mailbox/:mailbox/:emailId', component: MailboxDetailViewComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      scrollPositionRestoration: 'enabled',
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
