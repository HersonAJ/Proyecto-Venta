import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  loginData = {
    email: '',
    password: '',
    remember: false
  };

  loading = false;
  errorMessage = '';

  constructor(private router: Router) {}

  onLogin() {
    if (this.loading) return;

    this.loading = true;
    this.errorMessage = '';

    // Simular llamada al API (remplazar con servicio real)
    setTimeout(() => {
      // Validación básica (remplazar con autenticación real)
      if (this.loginData.email === 'cliente@ejemplo.com' && this.loginData.password === '123456') {
        // Login exitoso
        localStorage.setItem('user', JSON.stringify({
          email: this.loginData.email,
          nombre: 'Cliente Ejemplo',
          rol: 'cliente'
        }));
        
        this.router.navigate(['/']);
      } else {
        this.errorMessage = 'Credenciales incorrectas. Intenta nuevamente.';
      }
      
      this.loading = false;
    }, 1500);
  }

  continueAsGuest() {
    localStorage.setItem('guest', 'true');
    this.router.navigate(['/']);
  }
}

