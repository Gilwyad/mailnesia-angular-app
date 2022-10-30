import { MailboxSettingsService } from './../services/mailbox-settings.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MailboxSettingsComponent } from './mailbox-settings.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('MailboxSettingsComponent', () => {
  let component: MailboxSettingsComponent;
  let fixture: ComponentFixture<MailboxSettingsComponent>;
  // let getAliasListSpy: jasmine.SpyObj<MailboxSettingsService>;
  // let testAliases: string[] = [];
  let mailboxSettingsServiceMock: jasmine.SpyObj<MailboxSettingsService>;
  const mailboxName = 'test2';

  beforeEach(waitForAsync(() => {

    // Create a fake TwainService object with a `getQuote()` spy
    mailboxSettingsServiceMock = jasmine.createSpyObj(
      'MailboxSettingsService', [
        'getVisitorList', 'getAliasList', 'addAlias',
      ]);
    // Make the spy return a synchronous Observable with the test data
    // getAliasListSpy = mailboxSettingsService.getAliasList.and.returnValue(of(testAliases));

    TestBed.configureTestingModule({
      declarations: [ MailboxSettingsComponent ],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      providers: [
        {provide: MailboxSettingsService, useValue: mailboxSettingsServiceMock},
        {provide: ActivatedRoute, useValue: { params: of({mailbox: mailboxName}) }},
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailboxSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.mailbox).toEqual(mailboxName);
  });

  it('should have aliasList=[]', () => {
    const testAliases = ['test1', 'test2'];
    mailboxSettingsServiceMock.getAliasList.and.returnValue(of(testAliases));
    fixture.detectChanges();  // onInit()
    expect(mailboxSettingsServiceMock.getAliasList).toHaveBeenCalled();
    expect(component.aliasList).toEqual(new Set(testAliases));
    // expect((getAliasListSpy as any).calls.any()).toBe(true);
  });

  // it('should be possible to add alias', () => {
  //   component.addNew();
  //   expect(component.aliasList).toEqual(new Set(['']));
  //   component.selectOperation('', 'test');
  //   expect(component.aliasList).toEqual(new Set(['test']));
  // });

  // it('should be possible to modify alias', () => {
  //   component.aliasList = new Set(['test1', 'test2']);
  //   component.selectOperation('test1', 'test3');
  //   expect(component.aliasList).toEqual(new Set(['test2', 'test3']));
  // });
});
