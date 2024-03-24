import { CacheInterceptor } from './interceptors/cache.interceptor';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MailboxSettingsComponent } from './mailbox-settings/mailbox-settings.component';
import { MailboxListViewComponent } from './mailbox-list-view/mailbox-list-view.component';
import { MailboxDetailViewComponent } from './mailbox-detail-view/mailbox-detail-view.component';
import { MainPageComponent } from './main-page/main-page.component';
import { MailboxFormComponent } from './forms/mailbox-form/mailbox-form.component';
import { MailboxNavigationFormComponent } from './forms/mailbox-navigation-form/mailbox-navigation-form.component';
import { BypassSecurityPipe } from './bypass-security.pipe';
import { Router, Scroll } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs/operators';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgDatePipesModule } from 'ngx-pipes';
import { SettingsComponent } from './settings/settings.component';


@NgModule({
  declarations: [
    AppComponent,
    MailboxSettingsComponent,
    MailboxListViewComponent,
    MailboxDetailViewComponent,
    MainPageComponent,
    MailboxFormComponent,
    MailboxNavigationFormComponent,
    BypassSecurityPipe,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    PaginationModule.forRoot(),
    FormsModule,
    ModalModule.forRoot(),
    NgDatePipesModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(router: Router, viewportScroller: ViewportScroller) {
    router.events.pipe(
      filter((e): e is Scroll => e instanceof Scroll)
    ).subscribe(e => {
      if (e instanceof Scroll) {
        if (e.position) {
          // backward navigation
          // ugly hack to scroll to previous position after a delay
          setTimeout(() => viewportScroller.scrollToPosition(e.position), 1);
        } else if (e.anchor) {
          // anchor navigation
          viewportScroller.scrollToAnchor(e.anchor);
        } else {
          // forward navigation
          viewportScroller.scrollToPosition([0, 0]);
        }
      }
    });
  }
}
