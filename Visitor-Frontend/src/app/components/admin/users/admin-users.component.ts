import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResidentService, Resident } from '../../../services/resident.service';
import { VisitorService, Visitor } from '../../../services/visitor.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent implements OnInit {
  private residentService = inject(ResidentService);
  private visitorService = inject(VisitorService);

  residents: Resident[] = [];
  searchTerm: string = '';
  selectedResident: any = null;

  get filteredResidents() {
    if (!this.searchTerm) return this.residents;
    const lower = this.searchTerm.toLowerCase();
    return this.residents.filter((r: Resident) => r.name?.toLowerCase().includes(lower));
  }
  isEditMode = false;
  loading = false;
  error: string | null = null;
  success: string | null = null;


  formData = {
    name: '',
    email: '',
    password: '',
    flatNumber: '',
    phoneNumber: ''
  };

  ngOnInit() {
    this.loadResidents();
  }


  loadResidents() {
    this.loading = true;
    this.residentService.getResidents().subscribe({
      next: (data) => {
        this.residents = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load residents.';
        this.loading = false;
      }
    });
  }

  openCreateModal() {
    this.isEditMode = false;
    this.selectedResident = null;
    this.formData = { name: '', email: '', password: '', flatNumber: '', phoneNumber: '' };
    this.error = null;
    this.success = null;
  }

  openEditModal(resident: Resident) {
    this.isEditMode = true;
    this.selectedResident = resident;
    this.formData = {
      name: resident.name,
      email: resident.email,
      password: '',
      flatNumber: resident.flatNumber,
      phoneNumber: resident.phoneNumber
    };
    this.error = null;
    this.success = null;
  }

  onSubmit() {
    this.loading = true;
    this.error = null;
    if (this.isEditMode && this.selectedResident) {
      this.residentService.updateResident(this.selectedResident.id, this.formData).subscribe({
        next: () => {
          this.success = 'Resident updated successfully!';
          this.loadResidents();
          this.loading = false;
        },
        error: () => {
          this.error = 'Update failed.';
          this.loading = false;
        }
      });
    } else {
      this.residentService.createResident(this.formData).subscribe({
        next: () => {
          this.success = 'Resident created successfully!';
          this.loadResidents();
          this.loading = false;
        },
        error: () => {
          this.error = 'Creation failed. Email might exist.';
          this.loading = false;
        }
      });
    }
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this resident?')) {
      this.residentService.deleteResident(id).subscribe({
        next: () => this.loadResidents(),
        error: () => this.error = 'Delete failed.'
      });
    }
  }
}
