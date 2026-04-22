import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VisitorService, Visitor } from '../../../services/visitor.service';

@Component({
  selector: 'app-admin-visitors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-visitors.component.html'
})
export class AdminVisitorsComponent implements OnInit {
  private visitorService = inject(VisitorService);
  allVisitors: Visitor[] = [];
  searchTerm: string = '';

  get filteredVisitors() {
    if (!this.searchTerm) return this.allVisitors;
    const lower = this.searchTerm.toLowerCase();
    return this.allVisitors.filter((v: Visitor) => v.fullName?.toLowerCase().includes(lower));
  }

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.visitorService.getAllVisitors().subscribe({
      next: (res) => {
        this.allVisitors = res.data;
      },
      error: (err) => console.error('Error loading logs:', err)
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'Pending': return 'bg-warning text-dark border border-warning-subtle';
      case 'Approved': return 'bg-success text-white shadow-sm';
      case 'Rejected': return 'bg-danger text-white shadow-sm';
      case 'Entered': return 'bg-primary text-white shadow-sm';
      case 'Exited': return 'bg-secondary text-white shadow-sm';
      default: return 'bg-light text-dark border';
    }
  }

  deleteVisitor(id: number) {
    if (confirm('Are you sure you want to permanently delete this visitor? This action cannot be undone.')) {
      this.visitorService.deleteVisitor(id).subscribe({
        next: () => {
          this.allVisitors = this.allVisitors.filter(v => v.id !== id);
        },
        error: (err) => {
          console.error('Delete failed:', err);
          alert('Failed to delete visitor. Please try again.');
        }
      });
    }
  }
}
