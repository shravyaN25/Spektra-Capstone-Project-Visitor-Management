import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisitorService, Visitor } from '../../../services/visitor.service';

@Component({
  selector: 'app-my-visitors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-visitors.component.html'
})
export class MyVisitorsComponent implements OnInit {
  private visitorService = inject(VisitorService);
  visitors: any[] = [];
  loading = false;

  ngOnInit() {
    this.loadMyVisitors();
  }

  loadMyVisitors() {
    this.loading = true;
    this.visitorService.getMyVisitors().subscribe({
      next: (res) => {
        this.visitors = res.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading visitors:', err);
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Pending': return 'bg-warning text-dark';
      case 'Approved': return 'bg-success';
      case 'Rejected': return 'bg-danger';
      case 'Exited': return 'bg-info text-dark';
      default: return 'bg-secondary';
    }
  }
}
