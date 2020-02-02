import { TestBed } from '@angular/core/testing';

import { MailboxNameService } from './mailbox-name.service';

describe('MailboxNameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MailboxNameService = TestBed.get(MailboxNameService);
    expect(service).toBeTruthy();
  });

  it('can save mailbox', done => {
    const name = 'test1';
    const service: MailboxNameService = TestBed.get(MailboxNameService);
    service.changeMailboxName(name);
    service.selectedMailboxName.subscribe(result => {
      expect(result).toBe(name);
      done();
    });
  });

});
