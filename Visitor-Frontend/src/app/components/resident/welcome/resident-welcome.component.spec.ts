import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResidentWelcomeComponent } from './resident-welcome.component';

describe('ResidentWelcomeComponent', () => {
  let component: ResidentWelcomeComponent;
  let fixture: ComponentFixture<ResidentWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentWelcomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResidentWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
