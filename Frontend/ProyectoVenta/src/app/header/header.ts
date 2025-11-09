import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  constructor(
    public authService: AuthService,
    private router: Router
  ){}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/inicio'])
  }
}
