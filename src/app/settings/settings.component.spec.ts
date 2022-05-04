import { MailboxNameService } from 'src/app/services/mailbox-name.service';
import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { SettingsComponent } from './settings.component';

@Injectable({
  providedIn: 'root'
})
export class MailboxNameServiceMock {
  getMailboxName(): string {
    return 'test2';
  }
}

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ SettingsComponent ],
      providers: [{provide: MailboxNameService, useClass: MailboxNameServiceMock}]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    const store = Object();

    spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => store[key] = value + '');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggle save works with checked:true', () => {
    component.toggleSaveMailbox(true);
    expect(component.saveLastViewedMailbox).toBe(true);
    expect(localStorage.getItem('saveLastViewedMailbox')).toBe('true');
    expect(localStorage.getItem('mailbox')).toBe('test2');
  });

  it('toggle save works with checked:false', () => {
    component.toggleSaveMailbox(false);
    expect(component.saveLastViewedMailbox).toBe(false);
    expect(localStorage.getItem('saveLastViewedMailbox')).toBe(null);
    expect(localStorage.getItem('mailbox')).toBe(null);
  });
});
