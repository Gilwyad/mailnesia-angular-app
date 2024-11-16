import { NgDatePipesModule } from 'ngx-pipes';
import { BypassSecurityPipe } from './../bypass-security.pipe';
import { MailboxDetailViewComponent } from './../mailbox-detail-view/mailbox-detail-view.component';
import { waitForAsync, ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MailboxListViewComponent } from './mailbox-list-view.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { EmailList } from '../types/email-list.model';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

describe('MailboxListViewComponent', () => {
  let component: MailboxListViewComponent;
  let fixture: ComponentFixture<MailboxListViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [
        MailboxListViewComponent,
        MailboxDetailViewComponent,
        BypassSecurityPipe,
    ],
    imports: [RouterModule.forRoot([
            { path: '', component: MailboxListViewComponent }
        ]),
        PaginationModule.forRoot(),
        FormsModule,
        ModalModule.forRoot(),
        NgDatePipesModule],
    providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        provideHttpClient(withInterceptorsFromDi())
    ]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailboxListViewComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should show loading depending on isLoading`, () => {
    const nativeElement: HTMLElement = fixture.debugElement.nativeElement;
    expect(component.isLoading).toBeTruthy();
    expect(nativeElement.querySelector('div#loading').textContent).toContain('Loading');

    component.isLoading = false;
    fixture.detectChanges();
    expect(nativeElement.querySelector('div#loading')).toBeNull();

    component.isLoading = true;
    fixture.detectChanges();
    expect(nativeElement.querySelector('div#loading').textContent).toContain('Loading');
  });

  it(`should show error depending on emailListError`, () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(component.emailListError).toBeFalsy('emailListError should be false initially');
    expect(nativeElement.querySelector('div#error')).toBeNull('Alert should not show if EmailListError is false');

    component.emailListError = {
      code: 44,
      message: 'error',
      serverMessage: 'http error 99'
    };
    fixture.detectChanges();

    expect(nativeElement.querySelector('div#error').textContent).toContain('Error', 'page should show alert with error');
    expect(nativeElement.querySelector('div.row.icons')).toBeFalsy('page should not show icons if there’s an error');

    component.emailListError = null;
    fixture.detectChanges();
    expect(nativeElement.querySelector('div#error')).toBeNull('Alert should not show if EmailListError is set to false');
    expect(nativeElement.querySelector('div.row.icons')).toBeTruthy('page should show icons if there’s no error');
  });

  it(`should show error depending on emailListErrorSubject`, () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    expect(component.emailListError).toBeFalsy('emailListError should be false initially');
    expect(nativeElement.querySelector('div#error')).toBeNull('Alert should not show initially');

    component.emailListErrorSubject.next({
      code: 44,
      message: 'error',
      serverMessage: 'http error 99'
    });
    fixture.detectChanges();

    expect(nativeElement.querySelector('div#error').textContent).toContain('Error', 'page should show alert with error');
    expect(nativeElement.querySelector('div.row.icons')).toBeFalsy('page should not show icons if there’s an error');

    component.emailListErrorSubject.next(null);
    fixture.detectChanges();
    expect(nativeElement.querySelector('div#error')).toBeNull('Alert should not show if emailListErrorSubject is set to null');
    expect(nativeElement.querySelector('div.row.icons')).toBeTruthy('page should show icons if there’s no error');
  });

  it(`should show email list from emailList`, () => {
    const testData: EmailList[] = [
      {
        id: 22,
        subject: 'Test Data',
        date: '2011-01-01 11:11:11+00:00',
        from: 'sender1',
        to: 'recipient1'
      },
      {
        id: 23,
        subject: 'Test Data 2',
        date: '2011-01-01 11:11:11+00:00',
        from: 'sender2',
        to: 'recipient2'
      }
    ];
    const nativeElement: HTMLElement = fixture.nativeElement;

    expect(nativeElement.querySelector('table#email-list')).toBeNull();

    component.emailListPage = testData;
    fixture.detectChanges();
    const emailList = nativeElement.querySelectorAll('table#email-list tbody tr');
    expect(emailList.length).toEqual(2, 'Should list 2 emails');
    expect(nativeElement.querySelector('div#error')).toBeNull('Alert should not show if emailListErrorSubject is set to null');
  });

  it(`should show email list from emailListSubject`, () => {
    const testData: EmailList[] = [
      {
        id: 22,
        subject: 'Test Data',
        date: '2011-01-01 11:11:11+00:00',
        from: 'sender1',
        to: 'recipient1'
      },
      {
        id: 23,
        subject: 'Test Data 2',
        date: '2011-01-01 11:11:11+00:00',
        from: 'sender2',
        to: 'recipient2'
      }
    ];
    const nativeElement: HTMLElement = fixture.nativeElement;

    expect(nativeElement.querySelector('table#email-list')).toBeNull();

    component.emailListSubject.next(testData);
    fixture.detectChanges();
    const emailList = nativeElement.querySelectorAll('table#email-list tbody tr');
    expect(emailList.length).toEqual(2, 'Should list 2 emails');
    expect(nativeElement.querySelector('div#error')).toBeNull('Alert should not show if emailListErrorSubject is set to null');
  });

  it(`should show no email if empty mailbox (emailList===[])`, () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    component.emailListSubject.next([]);
    fixture.detectChanges();
    expect(nativeElement.querySelector('table#email-list')).toBeNull();
    expect(nativeElement.querySelector('div#no-mail')).toBeTruthy();
    expect(nativeElement.querySelector('div#error')).toBeNull('Alert should not show if emailListErrorSubject is set to null');
  });

  it(`should insert new mail to the top of the list if we are on the first page`, () => {
    const testEmail: EmailList[] = [
      {
        id: 22,
        subject: 'Test Data',
        date: '2011-01-01 11:11:11+00:00',
        from: 'sender1',
        to: 'recipient1'
      },
      {
        id: 23,
        subject: 'Test Data 2',
        date: '2011-01-01 11:11:11+00:00',
        from: 'sender2',
        to: 'recipient2'
      }
    ];

    const newEmail: EmailList[] = [
      {
        id: 24,
        subject: 'Test Data3',
        date: '2011-01-01 11:11:11+00:00',
        from: 'sender3',
        to: 'recipient3'
      },
      {
        id: 25,
        subject: 'Test Data 4',
        date: '2011-01-01 11:11:11+00:00',
        from: 'sender4',
        to: 'recipient4'
      }
    ];
    const nativeElement: HTMLElement = fixture.nativeElement;
    component.setEmailListPage({page: 1, itemsPerPage: 10});
    component.emailListSubject.next(testEmail);
    fixture.detectChanges();

    let emailList = nativeElement.querySelectorAll('table#email-list tbody tr');
    expect(emailList.length).toEqual(2, 'Should list 2 emails');
    expect(nativeElement.querySelector('div#error')).toBeNull('Alert should not show if emailListErrorSubject is set to null');

    component.insertNewMailToTheTopOfTheList(newEmail);
    fixture.detectChanges();

    emailList = nativeElement.querySelectorAll('table#email-list tbody tr');
    expect(emailList.length).toEqual(4, 'Should list 4 emails');
    expect(nativeElement.querySelector('div#error')).toBeNull('Alert should not show if emailListErrorSubject is set to null');

  });

  it(`should not insert new mail to the top of the list if we are not on the first page`, () => {
    const testEmail: EmailList[] = [
      {
        id: 22,
        subject: 'Test Data',
        date: '2011-01-01 11:11:11+00:00',
        from: 'sender1',
        to: 'recipient1'
      },
      {
        id: 23,
        subject: 'Test Data 2',
        date: '2011-01-01 11:11:11+00:00',
        from: 'sender2',
        to: 'recipient2'
      },
      {
        id: 24,
        subject: 'Test Data 3',
        date: '2011-01-01 11:11:11+00:00',
        from: 'sender3',
        to: 'recipient3'
      }
    ];

    const newEmail: EmailList[] = [
      {
        id: 25,
        subject: 'Test Data4',
        date: '2011-01-01 11:11:11+00:00',
        from: 'sender4',
        to: 'recipient4'
      },
      {
        id: 26,
        subject: 'Test Data 5',
        date: '2011-01-01 11:11:11+00:00',
        from: 'sender5',
        to: 'recipient5'
      }
    ];
    const itemsPerPage = 2;
    const nativeElement: HTMLElement = fixture.nativeElement;

    component.emailListSubject.next(testEmail);
    component.setEmailListPage({page: 2, itemsPerPage});

    expect(component.currentPage).toBe(2);
    expect(component.numberOfEmailsPerPage).toBe(itemsPerPage);
    expect(component.emailList.length).toEqual(3, `component.emailList should contain 3 emails`);
    expect(component.emailListPage.length).toEqual(1, `component.emailList should contain 1 email`);

    fixture.detectChanges();

    let emailList = nativeElement.querySelectorAll('table#email-list tbody tr');
    expect(emailList.length).toEqual(1, `Should list 1 email`);
    expect(nativeElement.querySelector('div#error')).toBeNull('Alert should not show if emailListErrorSubject is set to null');

    component.insertNewMailToTheTopOfTheList(newEmail);

    expect(component.emailList.length).toEqual(5, `component.emailList should contain 5 emails`);
    expect(component.emailListPage.length).toEqual(1, `component.emailList should contain 1 email`);

    fixture.detectChanges();

    emailList = nativeElement.querySelectorAll('table#email-list tbody tr');
    expect(emailList.length).toEqual(1, `Should list 1 email`);
    expect(nativeElement.querySelector('div#error')).toBeNull('Alert should not show if emailListErrorSubject is set to null');

  });

});
