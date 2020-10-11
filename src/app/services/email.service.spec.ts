import { TestBed } from '@angular/core/testing';
import { EmailService } from './email.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Email } from '../types/email.model';
import { HttpErrors } from '../types/http-errors.model';

describe('EmailService', () => {
  let service: EmailService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
    ]});

    service = TestBed.inject(EmailService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Finally, assert that there are no outstanding requests.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an email for mailbox test', () => {
    const testData: Email = {
      text_html: '<b>html test</b>',
      text_plain: 'plain test'
    };
    service.getEmail('test', 22).subscribe({
      next: (data: Email) => {
        // When observable resolves, result should match test data
        expect(data).toEqual(testData);
      }
    });

    // The following `expectOne()` will match the request's URL.
    // If no requests or multiple requests matched that URL
    // `expectOne()` would throw.
    const request = httpTestingController.expectOne('/api/mailbox/test/22');

    // Assert that the request is a GET.
    expect(request.request.method).toEqual('GET');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    request.flush(testData);
  });

  it('should return error', () => {
    service.getEmail('test', 23).subscribe({
      next: (data: Email) => fail('this should have been an error'),
      error: (data: HttpErrors) => {
        expect(data.code).toEqual(500);
        expect(data.message).toEqual('error');
        expect(data.serverMessage).toContain('Server Error');
      }
    });
    const request = httpTestingController.expectOne('/api/mailbox/test/23');
    request.flush('error', {
      status: 500,
      statusText: 'Server Error',
    });

  });

  it('should delete an email', () => {
    service.deleteEmail('test', 22).subscribe({
      next: (data: void) => {
        expect(data).toEqual(null);
      }
    });

    // The following `expectOne()` will match the request's URL.
    // If no requests or multiple requests matched that URL
    // `expectOne()` would throw.
    const request = httpTestingController.expectOne('/api/mailbox/test/22');

    // Assert that the request is a DELETE.
    expect(request.request.method).toEqual('DELETE');

    // Respond with mock data, causing Observable to resolve.
    // Subscribe callback asserts that correct data was returned.
    request.flush(null);
  });

  it('delete an email should return error', () => {
    service.deleteEmail('test', 23).subscribe({
      next: (data: void) => fail('this should have been an error'),
      error: (data: HttpErrors) => {
        expect(data.code).toEqual(500);
        expect(data.message).toEqual('error');
        expect(data.serverMessage).toContain('Server Error');
      }
    });
    const request = httpTestingController.expectOne('/api/mailbox/test/23');
    request.flush('error', {
      status: 500,
      statusText: 'Server Error',
    });

  });

});
