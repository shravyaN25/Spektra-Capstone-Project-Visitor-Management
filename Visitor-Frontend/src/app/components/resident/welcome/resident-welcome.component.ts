import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-resident-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './resident-welcome.component.html',
  styleUrl: './resident-welcome.component.css'
})
export class ResidentWelcomeComponent implements OnInit {
  residentName: string = 'Resident';
  today: Date = new Date();

  ngOnInit() {
    this.residentName = localStorage.getItem('name') || 'Resident';
  }
}
