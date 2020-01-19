import { TestBed } from '@angular/core/testing';

import { MailboxNameService } from './mailbox-name.service';

describe('MailboxNameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MailboxNameService = TestBed.get(MailboxNameService);
    expect(service).toBeTruthy();
  });
});
