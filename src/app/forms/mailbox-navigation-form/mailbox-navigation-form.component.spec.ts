import { ReactiveFormsModule } from '@angular/forms';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MailboxNavigationFormComponent } from './mailbox-navigation-form.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('MailboxNavigationFormComponent', () => {
  let component: MailboxNavigationFormComponent;
  let fixture: ComponentFixture<MailboxNavigationFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
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
