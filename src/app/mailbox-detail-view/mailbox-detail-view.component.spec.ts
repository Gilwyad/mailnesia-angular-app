import { Email } from './../types/email.model';
import { waitForAsync, ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MailboxDetailViewComponent } from './mailbox-detail-view.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BypassSecurityPipe } from '../bypass-security.pipe';
import { RouterModule } from '@angular/router';

describe('MailboxDetailViewComponent', () => {
  let component: MailboxDetailViewComponent;
  let fixture: ComponentFixture<MailboxDetailViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [
        MailboxDetailViewComponent,
        BypassSecurityPipe,
    ],
    imports: [RouterModule.forRoot([
            { path: '', component: MailboxDetailViewComponent }
        ]),
        ModalModule.forRoot()],
    providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true },
        provideHttpClient(withInterceptorsFromDi())
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
    expect(nativeElement.querySelector('div.row.icons')).toBeFalsy('page should not show icons if there’s an error');

    component.emailError = null;
    fixture.detectChanges();
    expect(nativeElement.querySelector('div#error')).toBeNull('Alert should not show if EmailListError is set to false');
    expect(nativeElement.querySelector('div.row.icons')).toBeTruthy('page should show icons if there’s no error');
  });

  it(`should show email`, () => {
    const testData: Email = {
      textHtml: '<b>html test</b>',
      textPlain: 'plain test'
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
      textHtml: '<b>html test</b>',
      textPlain: 'plain test'
    };
    const nativeElement: HTMLElement = fixture.nativeElement;

    component.email = testData;
    component.isLoading = false;
    fixture.detectChanges();
    let emailDiv = nativeElement.querySelector('div#mailnesiaHtmlEmailContent');
    expect(emailDiv.textContent).toBe('html test');

    component.setSelectedTab('textPlain');
    fixture.detectChanges();
    emailDiv = nativeElement.querySelector('div#mailnesiaHtmlEmailContent');
    expect(emailDiv.textContent).toBe('plain test');
  });
});
