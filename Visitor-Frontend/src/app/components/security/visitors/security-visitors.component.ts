import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VisitorService, Visitor } from '../../../services/visitor.service';

@Component({
  selector: 'app-security-visitors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './security-visitors.component.html'
})
export class SecurityVisitorsComponent implements OnInit {
  private visitorService = inject(VisitorService);
  private router = inject(Router);
  pendingVisitors: any[] = [];
  searchTerm: string = '';
  otpInputs: { [key: number]: string } = {};

  get filteredVisitors() {
    if (!this.searchTerm) {
      return this.pendingVisitors;
    }
    const lowerTerm = this.searchTerm.toLowerCase();
    return this.pendingVisitors.filter(v => v.fullName?.toLowerCase().includes(lowerTerm));
  }
  isLoading = false;
  isProcessing: { [key: number]: boolean } = {};
  successMessage = '';
  errorMessage = '';

  showMessage(msg: string, type: 'success' | 'error') {
    if (type === 'success') {
      this.successMessage = msg;
      setTimeout(() => this.successMessage = '', 4000);
    } else {
      this.errorMessage = msg;
      setTimeout(() => this.errorMessage = '', 5000);
    }
  }

  ngOnInit() {
    this.loadPending();
  }

  loadPending() {
    this.isLoading = true;
    this.visitorService.getPendingVisitors().subscribe({
      next: (res: any) => {
        this.pendingVisitors = res.data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Fetch error:', err);
      }
    });
  }

  isStatus(current: any, target: number): boolean {
    if (current === undefined || current === null) return false;
    
    // Convert current to a numeric status if it's a string
    let numericStatus: number;
    if (typeof current === 'number') {
      numericStatus = current;
    } else {
      const map: { [key: string]: number } = { 'Pending': 0, 'Approved': 1, 'Rejected': 2, 'Entered': 3, 'Exited': 4 };
      numericStatus = map[current] ?? -1;
    }
    
    return numericStatus === target;
  }

  updateStatus(id: number, status: string) {
    const visitor = this.pendingVisitors.find(v => v.id === id);
    const originalStatus = visitor?.status;

    // OPTIMISTIC UPDATE: Transition UI immediately for better feel
    if (visitor) visitor.status = status;
    this.isProcessing[id] = true;

    this.visitorService.updateStatus(id, status).subscribe({
      next: () => {
        this.isProcessing[id] = false;
        // If exited, remove from the queue
        if (status === 'Exited') {
           this.pendingVisitors = this.pendingVisitors.filter(v => v.id !== id);
        }
      },
      error: (err: any) => {
        // ERROR HANDLER: Always resolve the state
        this.isProcessing[id] = false;
        
        // If it was a real failure (not just a minor sync glitch), revert the UI
        const errorMsg = err.error?.message || err.error || 'Server connection error.';
        console.error('Update failed:', err);
        
        // Revert status so user can try again
        if (visitor) visitor.status = originalStatus;
        this.showMessage("Operation Failed: " + errorMsg, 'error');
      }
    });
  }

  verifyOtp(id: number) {
    const otp = this.otpInputs[id];
    if (!otp) return;

    this.isProcessing[id] = true;
    this.visitorService.verifyOtp(id, otp).subscribe({
      next: () => {
        this.isProcessing[id] = false;
        delete this.otpInputs[id];
        // Change state to Entered instead of removing
        const visitor = this.pendingVisitors.find(v => v.id === id);
        if (visitor) visitor.status = 'Entered';
        
        this.showMessage('Visitor verified and marked as Entered!', 'success');
      },
      error: (err: any) => {
        this.isProcessing[id] = false;
        const errorMsg = err.error?.message || err.error || 'Invalid OTP code.';
        this.showMessage(errorMsg, 'error');
      }
    });
  }

  getStatusText(status: any): string {
    if (typeof status === 'string') return status;
    return ['Pending', 'Approved', 'Rejected', 'Entered', 'Exited'][status] || 'Unknown';
  }

  getStatusClass(status: any) {
    const s = typeof status === 'number' ? this.getStatusText(status) : status;
    switch (s) {
      case 'Pending': return 'bg-warning text-dark border-warning-subtle';
      case 'Approved': return 'bg-success text-white shadow-sm';
      case 'Rejected': return 'bg-danger text-white shadow-sm';
      case 'Entered': return 'bg-primary text-white shadow-sm';
      case 'Exited': return 'bg-secondary text-white shadow-sm';
      default: return 'bg-light text-dark border';
    }
  }
}
