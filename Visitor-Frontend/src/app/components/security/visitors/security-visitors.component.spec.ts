import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityVisitorsComponent } from './security-visitors.component';

describe('SecurityVisitorsComponent', () => {
  let component: SecurityVisitorsComponent;
  let fixture: ComponentFixture<SecurityVisitorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityVisitorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecurityVisitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
