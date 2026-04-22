import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyVisitorsComponent } from './my-visitors.component';

describe('MyVisitorsComponent', () => {
  let component: MyVisitorsComponent;
  let fixture: ComponentFixture<MyVisitorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyVisitorsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyVisitorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
