import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailboxDetailViewComponent } from './mailbox-detail-view.component';

describe('MailboxDetailViewComponent', () => {
  let component: MailboxDetailViewComponent;
  let fixture: ComponentFixture<MailboxDetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailboxDetailViewComponent ]
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
});
