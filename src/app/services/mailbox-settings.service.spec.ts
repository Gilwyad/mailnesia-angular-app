import { VisitorList } from './../types/mailbox-settings.model';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MailboxSettingsService } from './mailbox-settings.service';
import { HttpErrors } from '../types/http-errors.model';

describe('MailboxSettingsService', () => {
  let httpTestingController: HttpTestingController;
  let service: MailboxSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
    });
    service = TestBed.inject(MailboxSettingsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // assert that there are no outstanding requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of visitors for mailbox test', () => {
    const testData: VisitorList[] = [
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
    service.getVisitorList('test').subscribe({
      next: (data: VisitorList[]) => {
        // When observable resolves, result should match test data
        expect(data).toEqual(testData);
      }
    });

    // The following `expectOne()` will match the request's URL.
    // If no requests or multiple requests matched that URL
    // `expectOne()` would throw.
    const request = httpTestingController.expectOne('/api/visitors/test');

    // Assert that the request is a GET.
    expect(request.request.method).toEqual('GET');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    request.flush(testData);

  });

  it('should return error', () => {
    service.getVisitorList('test').subscribe({
      next: () => fail('this should have been an error'),
      error: (data: HttpErrors) => {
        expect(data.code).toEqual(500);
        expect(data.message).toEqual('error');
        expect(data.serverMessage).toContain('Server Error');
      }
    });
    const request = httpTestingController.expectOne('/api/visitors/test');
    request.flush('error', {
      status: 500,
      statusText: 'Server Error',
    });

  });


});
