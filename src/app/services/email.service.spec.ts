import { TestBed } from '@angular/core/testing';

import { EmailService } from './email.service';
import { HttpClientModule } from '@angular/common/http';

describe('EmailService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule,
    ]
  }));

  it('should be created', () => {
    const service: EmailService = TestBed.get(EmailService);
    expect(service).toBeTruthy();
  });
});
