import { MailboxSettingsService } from './../services/mailbox-settings.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MailboxSettingsComponent } from './mailbox-settings.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { VisitorList } from '../types/mailbox-settings.model';

describe('MailboxSettingsComponent', () => {
  let component: MailboxSettingsComponent;
  let fixture: ComponentFixture<MailboxSettingsComponent>;
  let mailboxSettingsServiceMock: jasmine.SpyObj<MailboxSettingsService>;
  const mailboxName = 'test2';
  const testAliases = ['test1', 'test2'];
  const visitorList: VisitorList[] = [
    {
      ip: '1.2.3.4',
      timeStamp: 12314155,
      userAgent: 'cool browser 1.0'
    },
    {
      ip: '5.6.7.8',
      timeStamp: 62343523,
      userAgent: 'awesome browser 2.0'
    },
  ];

  beforeEach(waitForAsync(() => {

    // Create a fake TwainService object with a `getQuote()` spy
    mailboxSettingsServiceMock = jasmine.createSpyObj(
      'MailboxSettingsService', [
        'getVisitorList', 'getAliasList', 'addAlias',
      ]);

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
    mailboxSettingsServiceMock.getAliasList.and.returnValue(of(testAliases));
    mailboxSettingsServiceMock.getVisitorList.and.returnValue(of(visitorList));
    fixture.detectChanges();  // onInit()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.mailbox).toEqual(mailboxName);
  });

  it('should get aliasList on page load', () => {
    expect(mailboxSettingsServiceMock.getAliasList).toHaveBeenCalled();
    expect(component.aliasList).toEqual(new Set(testAliases));
  });

  it('should get visitor list on page load', () => {
    expect(mailboxSettingsServiceMock.getVisitorList).toHaveBeenCalled();
    expect(component.visitorList).toEqual(visitorList);
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
