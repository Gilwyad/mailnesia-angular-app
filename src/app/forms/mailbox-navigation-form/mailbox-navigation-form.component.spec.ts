import { ReactiveFormsModule } from '@angular/forms';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MailboxNavigationFormComponent } from './mailbox-navigation-form.component';
import { RouterModule } from '@angular/router';

describe('MailboxNavigationFormComponent', () => {
  let component: MailboxNavigationFormComponent;
  let fixture: ComponentFixture<MailboxNavigationFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterModule.forRoot([
          { path: '', component: MailboxNavigationFormComponent }
        ]),
      ],
      declarations: [ MailboxNavigationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailboxNavigationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
