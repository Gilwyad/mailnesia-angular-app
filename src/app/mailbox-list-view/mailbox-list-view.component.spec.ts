import { BypassSecurityPipe } from './../bypass-security.pipe';
import { MailboxDetailViewComponent } from './../mailbox-detail-view/mailbox-detail-view.component';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { MailboxListViewComponent } from './mailbox-list-view.component';
import { HttpClientModule } from '@angular/common/http';
import { EmailList } from '../types/email-list.model';
import { FormsModule } from '@angular/forms';

describe('MailboxListViewComponent', () => {
  let component: MailboxListViewComponent;
  let fixture: ComponentFixture<MailboxListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MailboxListViewComponent,
        MailboxDetailViewComponent,
        BypassSecurityPipe,
      ],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        PaginationModule.forRoot(),
        FormsModule,
      ],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true }
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

    component.emailListError = null;
    fixture.detectChanges();
    expect(nativeElement.querySelector('div#error')).toBeNull('Alert should not show if EmailListError is set to false');
  });

  it(`should show email list from emailList`, () => {
    const testData: EmailList[] = [
      {
        id: 22,
        subject: 'Test Data',
        date: new Date(),
        from: 'sender1',
        to: 'recipient1'
      },
      {
        id: 23,
        subject: 'Test Data 2',
        date: new Date(),
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
  });

  it(`should show no email if empty mailbox (emailList===[])`, () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    component.emailList = [];
    component.noEmail = true;
    fixture.detectChanges();
    expect(nativeElement.querySelector('table#email-list')).toBeNull();
    expect(nativeElement.querySelector('div#no-mail')).toBeTruthy();
  });

  it(`should insert new mail to the top of the list`, () => {
    const testEmail: EmailList[] = [
      {
        id: 22,
        subject: 'Test Data',
        date: new Date(),
        from: 'sender1',
        to: 'recipient1'
      },
      {
        id: 23,
        subject: 'Test Data 2',
        date: new Date(),
        from: 'sender2',
        to: 'recipient2'
      }
    ];

    const newEmail: EmailList[] = [
      {
        id: 24,
        subject: 'Test Data3',
        date: new Date(),
        from: 'sender3',
        to: 'recipient3'
      },
      {
        id: 25,
        subject: 'Test Data 4',
        date: new Date(),
        from: 'sender4',
        to: 'recipient4'
      }
    ];
    const nativeElement: HTMLElement = fixture.nativeElement;
    component.currentPage = 1;
    component.emailList = testEmail;
    component.insertNewMailToTheTopOfTheList(newEmail);

    fixture.detectChanges();
    const emailList = nativeElement.querySelectorAll('table#email-list tbody tr');
    expect(emailList.length).toEqual(4, 'Should list 4 emails');

  });
});
