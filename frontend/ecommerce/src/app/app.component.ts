import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ecommerce';

  constructor(private authService: AuthService, private router: Router) { }
  
  getUserName() {
    return this.authService.getFirstName();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  logout() {
    if (confirm("Are you sure to logout?")) {
      alert("Logout Successful!");
      this.authService.clear();
      this.router.navigateByUrl('');
    }
  }
}