import { TestBed } from '@angular/core/testing';

import { MailboxNameService } from './mailbox-name.service';

describe('MailboxNameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MailboxNameService = TestBed.inject(MailboxNameService);
    expect(service).toBeTruthy();
  });

  it('can save mailbox', done => {
    const name = 'test1';
    const firstService: MailboxNameService = TestBed.inject(MailboxNameService);
    const secondService: MailboxNameService = TestBed.inject(MailboxNameService);
    firstService.changeMailboxName(name);
    secondService.selectedMailboxName.subscribe(result => {
      expect(result).toBe(name);
      expect(firstService.getMailboxName()).toBe(name);
      expect(secondService.getMailboxName()).toBe(name);
      done();
    });
  });

});
