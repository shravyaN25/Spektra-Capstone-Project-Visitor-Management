import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SecurityDashboardComponent } from './security-dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SecurityDashboardComponent', () => {
  let component: SecurityDashboardComponent;
  let fixture: ComponentFixture<SecurityDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityDashboardComponent, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
