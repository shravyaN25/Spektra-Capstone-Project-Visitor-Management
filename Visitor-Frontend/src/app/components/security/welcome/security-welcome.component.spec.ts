import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityWelcomeComponent } from './security-welcome.component';

describe('SecurityWelcomeComponent', () => {
  let component: SecurityWelcomeComponent;
  let fixture: ComponentFixture<SecurityWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityWelcomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecurityWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
