import { Email } from './../types/email.model';
import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';

import { MailboxDetailViewComponent } from './mailbox-detail-view.component';
import { HttpClientModule } from '@angular/common/http';
import { BypassSecurityPipe } from '../bypass-security.pipe';

describe('MailboxDetailViewComponent', () => {
  let component: MailboxDetailViewComponent;
  let fixture: ComponentFixture<MailboxDetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
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
    fixture = TestBed.createComponent(MailboxDetailViewComponent);
    component = fixture.componentInstance;
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
    expect(component.emailError).toBeFalsy('emailListError should be false initially');
    expect(nativeElement.querySelector('div#error')).toBeNull('Alert should not show if EmailListError is false');

    component.emailError = true;
    fixture.detectChanges();

    expect(nativeElement.querySelector('div#error').textContent).toContain('Error', 'page should show alert with error');

    component.emailError = null;
    fixture.detectChanges();
    expect(nativeElement.querySelector('div#error')).toBeNull('Alert should not show if EmailListError is set to false');
  });

  it(`should show email`, () => {
    const testData: Email = {
      text_html: '<b>html test</b>',
      text_plain: 'plain test'
    };
    const nativeElement: HTMLElement = fixture.nativeElement;

    let emailDiv = nativeElement.querySelector('div#mailnesiaHtmlEmailContent');
    expect(emailDiv).toBeNull();

    component.email = testData;
    component.isLoading = false;
    fixture.detectChanges();
    emailDiv = nativeElement.querySelector('div#mailnesiaHtmlEmailContent');
    expect(emailDiv.textContent).toBe('html test');
  });

  it(`should show email tabs and they can be switched`, () => {
    const testData: Email = {
      text_html: '<b>html test</b>',
      text_plain: 'plain test'
    };
    const nativeElement: HTMLElement = fixture.nativeElement;

    component.email = testData;
    component.isLoading = false;
    fixture.detectChanges();
    let emailDiv = nativeElement.querySelector('div#mailnesiaHtmlEmailContent');
    expect(emailDiv.textContent).toBe('html test');

    component.setSelectedTab('text_plain');
    fixture.detectChanges();
    emailDiv = nativeElement.querySelector('div#mailnesiaHtmlEmailContent');
    expect(emailDiv.textContent).toBe('plain test');
  });
});
