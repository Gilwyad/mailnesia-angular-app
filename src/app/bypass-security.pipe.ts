import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'bypassSecurity'
})
export class BypassSecurityPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(value: any): any {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }

}
