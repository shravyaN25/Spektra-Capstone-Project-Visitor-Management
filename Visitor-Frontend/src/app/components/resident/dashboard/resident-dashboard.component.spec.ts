import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResidentDashboardComponent } from './resident-dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';

describe('ResidentDashboardComponent', () => {
  let component: ResidentDashboardComponent;
  let fixture: ComponentFixture<ResidentDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResidentDashboardComponent, HttpClientTestingModule, FormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResidentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
