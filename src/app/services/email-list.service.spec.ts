import { EmailList } from './../types/email-list.model';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EmailListService } from './email-list.service';
import { HttpErrors } from '../types/http-errors.model';

describe('EmailListService', () => {
  let service: EmailListService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [
      ]
    });

    service = TestBed.get(EmailListService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of emails for mailbox test', () => {
    const testData: EmailList[] = [
      {
        id: 22,
        subject: 'Test Data',
        date: new Date(),
        from: 'sender1',
        to: 'recipient1'
      },
      {
        id: 23,
        subject: 'Test Data 2',
        date: new Date(),
        from: 'sender2',
        to: 'recipient2'
      }
    ];
    service.getEmailList('test').subscribe({
      next: (data: EmailList[]) => {
        // When observable resolves, result should match test data
        expect(data).toEqual(testData);
      }
    });

    // The following `expectOne()` will match the request's URL.
    // If no requests or multiple requests matched that URL
    // `expectOne()` would throw.
    const request = httpTestingController.expectOne('http://mailnesia.test/api/mailbox/test');

    // Assert that the request is a GET.
    expect(request.request.method).toEqual('GET');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    request.flush(testData);

  });

  it('should return error', () => {
    service.getEmailList('test').subscribe({
      next: (data: EmailList[]) => fail('this should have been an error'),
      error: (data: HttpErrors) => {
        expect(data.code).toEqual(500);
        expect(data.message).toEqual('error');
        expect(data.serverMessage).toContain('Server Error');
      }
    });
    const request = httpTestingController.expectOne('http://mailnesia.test/api/mailbox/test');
    request.flush('error', {
      status: 500,
      statusText: 'Server Error',
    });

  });
});
