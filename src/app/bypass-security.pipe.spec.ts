import { TestBed } from '@angular/core/testing';
import { DomSanitizer, BrowserModule } from '@angular/platform-browser';
import { BypassSecurityPipe } from './bypass-security.pipe';
import { inject } from '@angular/core/testing';

describe('BypassSecurityPipe', () => {

  // beforeEach(() => {
  //   TestBed
  //     .configureTestingModule({
  //       imports: [
  //         BrowserModule
  //       ]
  //     });
  // });

  it('create an instance', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
    const pipe = new BypassSecurityPipe(domSanitizer);
    expect(pipe).toBeTruthy();
  }));

  // it('doesnt modify safe html', inject([DomSanitizer], (domSanitizer: DomSanitizer) => {
  //   const htmlVariable = '<p>unsafe html</p>';
  //   const testHtml = '<div [innerHTML]="htmlVariable"></div>';
  //   const pipe = new BypassSecurityPipe(domSanitizer);
  //   expect(pipe).toBeTruthy();
  //   expect(pipe.transform(testHtml)).toEqual(testHtml);
  // }));

});
