import { TestBed } from '@angular/core/testing';

import { EmailListService } from './email-list.service';

describe('EmailListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmailListService = TestBed.get(EmailListService);
    expect(service).toBeTruthy();
  });
});
