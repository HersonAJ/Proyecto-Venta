import { Component, ChangeDetectorRef, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../servicios/auth-service';
import { PerfilService, PerfilCompleto } from '../servicios/perfil-service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy {

  private perfilDataSubject = new BehaviorSubject<PerfilCompleto | null>(null);
  perfilData$ = this.perfilDataSubject.asObservable();

  loading = false;
  private subscriptions: Subscription[] = [];

  constructor(
    public authService: AuthService,
    private perfilService: PerfilService,
    private router: Router,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Si ya está logueado, cargar el perfil
    if (this.authService.isLoggedIn()) {
      this.cargarDatosPerfil();
    }

    // Escuchar cambios de login/logout
    const sub = this.authService.loggedIn$
      .pipe(delay(300)) 
      .subscribe((isLoggedIn) => {
        if (isLoggedIn) {
          this.cargarDatosPerfil();
        } else {
          this.perfilDataSubject.next(null);
        }
      });

    this.subscriptions.push(sub);
  }

  cargarDatosPerfil() {
    if (this.authService.isLoggedIn() && !this.loading) {
      this.loading = true;

      this.perfilService.getPerfilCompleto().pipe(take(1)).subscribe({
        next: (data) => {
          this.perfilDataSubject.next(data);
          this.loading = false;
          this.cdRef.detectChanges();
        },
        error: (error) => {
          console.error('Error cargando datos del perfil: ', error);
          this.perfilDataSubject.next(null);
          this.loading = false;
          this.cdRef.detectChanges();
        }
      });
    }
  }

  get perfilData(): PerfilCompleto | null {
    return this.perfilDataSubject.value;
  }

  logout(): void {
    this.authService.logout();
    this.perfilDataSubject.next(null);
    this.router.navigate(['/inicio']);
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions = [];
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}