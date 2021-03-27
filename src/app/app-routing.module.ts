import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MailboxSettingsComponent } from './mailbox-settings/mailbox-settings.component';
import { MailboxListViewComponent } from './mailbox-list-view/mailbox-list-view.component';
import { MailboxDetailViewComponent } from './mailbox-detail-view/mailbox-detail-view.component';
import { MainPageComponent } from './main-page/main-page.component';
import { Meta, Title, MetaDefinition } from '@angular/platform-browser';
import { filter, map } from 'rxjs/operators';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    data: {
      title: 'Mailnesia - Anonymous Email in Seconds',
      metaDescription:
        'Disposable email at its best. No registration or password. HTML & attachment support. Automatically clicks registration links.',
      noIndex: false
    }
  },
  {
    path: 'settings',
    component: SettingsComponent,
    data: {
      title: 'Mailnesia - Site wide settings',
      metaDescription: 'Mailnesia site wide settings',
      noIndex: true
    }
  },
  {
    path: 'settings/:mailbox',
    component: MailboxSettingsComponent,
    data: {
      title: 'Mailnesia - Anonymous Email in Seconds',
      metaDescription: 'Mailnesia Mailbox settings',
      noIndex: true
    }
  },
  {
    path: 'mailbox/:mailbox',
    component: MailboxListViewComponent,
    data: {
      title: 'Mailnesia - Anonymous Email in Seconds',
      metaDescription: 'Mailnesia Mailbox view',
      noIndex: true
    }
  },
  {
    path: 'mailbox/:mailbox/:emailId',
    component: MailboxDetailViewComponent,
    data: {
      title: 'Mailnesia - Anonymous Email in Seconds',
      metaDescription: 'Mailnesia Email view',
      noIndex: true
    }
  },
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
export class AppRoutingModule {
  constructor(
    private metaService: Meta,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
  ) {
    // Boilerplate code to filter out only important router events and to pull out data object field from each route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
    )
      // Real action starts there
      .subscribe((event) => {
        event.data.subscribe(
          data => {
            // Changing title
            this.titleService.setTitle(data.title);

            if (data.metaDescription) {
              // Changing meta with name="description"
              const description: MetaDefinition = { name: 'description', content: data.metaDescription };
              const attributeSelector = 'name="description"';
              this.metaService.removeTag(attributeSelector);
              this.metaService.addTag(description, false);
            }

            const noIndex: MetaDefinition = { name: 'robots', content: 'noindex' };
            if (data.noIndex) {
              this.metaService.addTag(noIndex, false);
            } else {
              const attributeSelector = 'name="robots"';
              this.metaService.removeTag(attributeSelector);
            }
          }
        );

        event.params.subscribe(
          params => {
            if (params.mailbox) {
              const currentTitle = this.titleService.getTitle();
              this.titleService.setTitle(`${params.mailbox} @ ${currentTitle}`);
            }
          }
        );
      });
  }

}
