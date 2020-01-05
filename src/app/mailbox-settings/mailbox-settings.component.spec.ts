import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailboxSettingsComponent } from './mailbox-settings.component';

describe('MailboxSettingsComponent', () => {
  let component: MailboxSettingsComponent;
  let fixture: ComponentFixture<MailboxSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailboxSettingsComponent ]
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
  });
});
