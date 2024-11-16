import { EmailList } from './../types/email-list.model';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { EmailListService } from './email-list.service';
import { HttpErrors } from '../types/http-errors.model';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('EmailListService', () => {
  let service: EmailListService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});

    service = TestBed.inject(EmailListService);
    httpTestingController = TestBed.inject(HttpTestingController);
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
        date: '2011-01-01 11:11:11+00:00',
        from: 'sender1',
        to: 'recipient1'
      },
      {
        id: 23,
        subject: 'Test Data 2',
        date: '2011-01-01 11:11:11+00:00',
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
    const request = httpTestingController.expectOne('/api/mailbox/test');

    // Assert that the request is a GET.
    expect(request.request.method).toEqual('GET');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    request.flush(testData);

  });

  it('should return error', () => {
    service.getEmailList('test').subscribe({
      next: () => fail('this should have been an error'),
      error: (data: HttpErrors) => {
        expect(data.code).toEqual(500);
        expect(data.message).toEqual('error');
        expect(data.serverMessage).toContain('Server Error');
      }
    });
    const request = httpTestingController.expectOne('/api/mailbox/test');
    request.flush('error', {
      status: 500,
      statusText: 'Server Error',
    });

  });


  it('should return a list of emails for mailbox poll test', () => {
    const testData: EmailList[] = [
      {
        id: 22,
        subject: 'Test Data',
        date: '2011-01-01 11:11:11+00:00',
        from: 'sender1',
        to: 'recipient1'
      },
      {
        id: 23,
        subject: 'Test Data 2',
        date: '2011-01-01 11:11:11+00:00',
        from: 'sender2',
        to: 'recipient2'
      }
    ];
    service.pollForNewMail('test', 21).subscribe({
      next: (data: EmailList[]) => {
        // When observable resolves, result should match test data
        expect(data).toEqual(testData);
      }
    });

    // The following `expectOne()` will match the request's URL.
    // If no requests or multiple requests matched that URL
    // `expectOne()` would throw.
    const request = httpTestingController.expectOne('/api/mailbox/test?newerthan=21');

    // Assert that the request is a GET.
    expect(request.request.method).toEqual('GET');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    request.flush(testData);

  });

  it('should return error for email poll', () => {
    service.pollForNewMail('test', 21).subscribe({
      next: () => fail('this should have been an error'),
      error: (data: HttpErrors) => {
        expect(data.code).toEqual(500);
        expect(data.message).toEqual('error');
        expect(data.serverMessage).toContain('Server Error');
      }
    });
    const request = httpTestingController.expectOne('/api/mailbox/test?newerthan=21');
    request.flush('error', {
      status: 500,
      statusText: 'Server Error',
    });
  });

  it('should do nothing if no new email at polling', () => {
    service.pollForNewMail('test', 21).subscribe({
      next: (data: string) => {
        expect(data).toEqual('');
      }
    });
    const request = httpTestingController.expectOne('/api/mailbox/test?newerthan=21');
    request.flush('', {
      status: 204,
      statusText: '',
    });
  });

  it('should wipe a mailbox', () => {
    service.wipeMailbox('test').subscribe({
      next: (data: void) => {
        expect(data).toEqual(null);
      }
    });

    // The following `expectOne()` will match the request's URL.
    // If no requests or multiple requests matched that URL
    // `expectOne()` would throw.
    const request = httpTestingController.expectOne('/api/mailbox/test');

    // Assert that the request is a DELETE.
    expect(request.request.method).toEqual('DELETE');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    request.flush(null);
  });

  it('wipe mailbox error', () => {
    service.wipeMailbox('test').subscribe({
      next: () => fail('this should have been an error'),
      error: (data: HttpErrors) => {
        expect(data.code).toEqual(500);
        expect(data.message).toEqual('error');
        expect(data.serverMessage).toContain('Server Error');
      }
    });
    const request = httpTestingController.expectOne('/api/mailbox/test');
    request.flush('error', {
      status: 500,
      statusText: 'Server Error',
    });

  });

});
