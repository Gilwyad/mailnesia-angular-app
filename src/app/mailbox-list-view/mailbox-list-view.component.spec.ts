import { BypassSecurityPipe } from './../bypass-security.pipe';
import { MailboxDetailViewComponent } from './../mailbox-detail-view/mailbox-detail-view.component';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';

import { MailboxListViewComponent } from './mailbox-list-view.component';
import { HttpClientModule } from '@angular/common/http';
import { EmailList } from '../types/email-list.model';

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
        HttpClientModule
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

    component.emailList = testData;
    fixture.detectChanges();
    expect(nativeElement.querySelector('table#email-list tbody tr td')).toBeDefined();
  });

  it(`should show no email if empty mailbox (emailList===[])`, () => {
    const nativeElement: HTMLElement = fixture.nativeElement;
    component.emailList = [];
    fixture.detectChanges();
    expect(nativeElement.querySelector('table#email-list')).toBeNull();
    expect(nativeElement.querySelector('div#no-mail')).toBeTruthy();
  });
});
