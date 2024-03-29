import { MailboxSettingsService } from './../services/mailbox-settings.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MailboxSettingsComponent } from './mailbox-settings.component';
import { of } from 'rxjs';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
        'getVisitorList', 'getAliasList', 'addAlias', 'deleteAlias',
      ]);

    TestBed.configureTestingModule({
      declarations: [ MailboxSettingsComponent ],
      imports: [
        RouterModule.forRoot([
          { path: '', component: MailboxSettingsComponent }
        ]),
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



  it('should be possible to add alias', () => {
    mailboxSettingsServiceMock.addAlias.and.returnValue(of(null));
    expect(component.aliasList).toEqual(new Set(testAliases));
    component.addAlias('test');
    const expectedSet = new Set(testAliases);
    expectedSet.add('test');
    expect(component.aliasList).toEqual(expectedSet);
  });

  it('should be possible to delete alias', () => {
    mailboxSettingsServiceMock.deleteAlias.and.returnValue(of(null));
    expect(component.aliasList).toEqual(new Set(testAliases));
    component.removeAlias('test1');
    const expectedSet = new Set(testAliases);
    expectedSet.delete('test1');
    expect(component.aliasList).toEqual(expectedSet);
  });
});
