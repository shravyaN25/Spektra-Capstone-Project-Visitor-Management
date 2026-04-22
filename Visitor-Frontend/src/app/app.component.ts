//router outlet is a directive like a placeholder or a container where angular inserts components based on routes

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'visitor-frontend';
}















/*1. AppComponent loads
2. Angular sees <router-outlet>
3. Router checks URL
4. Finds matching route
5. Creates that component
6. Inserts it inside router-outlet*/

/*<app-root>
  <router-outlet>
     <!-- Angular injects -->
     <app-landing> ... </app-landing>
  </router-outlet>
</app-root> */


//we need router outlet becz
//Angular is a Single Page Application (SPA) Instead of loading new pages:it replaces content inside router-outlet