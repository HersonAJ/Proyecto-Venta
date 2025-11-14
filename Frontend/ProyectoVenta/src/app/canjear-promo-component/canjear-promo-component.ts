import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CanjearPromoService, ConsultarPromocionesResponse } from '../servicios/canjear-promo-service';
import { AuthService } from '../servicios/auth-service';

@Component({
  selector: 'app-canjear-promo-component',
  imports: [CommonModule, FormsModule],
  templateUrl: './canjear-promo-component.html',
  styleUrl: './canjear-promo-component.scss'
})
export class CanjearPromoComponent implements OnInit {

  // Búsqueda de usuario
  criterioBusqueda: string = '';
  buscando: boolean = false;
  
  // Resultados de búsqueda
  usuarioEncontrado: any = null;
  errorBusqueda: string = '';
  
  // Canje
  cantidadCanjear: number = 1;
  canjeando: boolean = false;
  mensajeExito: string = '';
  errorCanje: string = '';

  constructor(
    private canjearPromoService: CanjearPromoService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Verificar que el usuario sea trabajador o admin
    if (!this.authService.isTrabajador()) {
      this.router.navigate(['/inicio']);
      return;
    }
  }

  buscarUsuario() {
    if (!this.criterioBusqueda.trim()) {
      this.errorBusqueda = 'Ingresa un ID de usuario';
      return;
    }

    const usuarioId = parseInt(this.criterioBusqueda);
    if (isNaN(usuarioId) || usuarioId <= 0) {
      this.errorBusqueda = 'ID de usuario inválido';
      return;
    }

    this.buscando = true;
    this.errorBusqueda = '';
    this.usuarioEncontrado = null;

    this.canjearPromoService.consultarPromocionesUsuario(usuarioId).subscribe({
      next: (response: ConsultarPromocionesResponse) => {
        this.buscando = false;
        
        if (response.success) {
          this.usuarioEncontrado = {
            id: usuarioId,
            nombre: response.nombre,
            email: response.email,
            promocionesPendientes: response.promocionesPendientes,
            promocionesCanjeadas: response.promocionesCanjeadas,
            promocionActual: response.promocionActual
          };
        } else {
          this.errorBusqueda = response.message || 'Usuario no encontrado';
        }
      },
      error: (error) => {
        this.buscando = false;
        this.errorBusqueda = 'Error de conexión al buscar usuario';
        console.error('Error buscando usuario:', error);
      }
    });
  }

  canjearPromocion() {
    if (!this.usuarioEncontrado) return;

    this.canjeando = true;
    this.mensajeExito = '';
    this.errorCanje = '';

    this.canjearPromoService.canjearPromocion(
      this.usuarioEncontrado.id, 
      this.cantidadCanjear
    ).subscribe({
      next: (response) => {
        this.canjeando = false;
        
        if (response.success) {
          this.mensajeExito = response.message;
          
          // Actualizar datos del usuario
          this.usuarioEncontrado.promocionesPendientes = response.promocionesRestantes;
          this.usuarioEncontrado.promocionesCanjeadas = 
            (this.usuarioEncontrado.promocionesCanjeadas || 0) + this.cantidadCanjear;
          
          // Resetear cantidad
          this.cantidadCanjear = 1;
          
          // Auto-ocultar mensaje después de 5 segundos
          setTimeout(() => {
            this.mensajeExito = '';
          }, 5000);
        } else {
          this.errorCanje = response.message;
        }
      },
      error: (error) => {
        this.canjeando = false;
        this.errorCanje = 'Error de conexión al canjear promoción';
        console.error('Error canjeando promoción:', error);
      }
    });
  }

  limpiarBusqueda() {
    this.criterioBusqueda = '';
    this.usuarioEncontrado = null;
    this.errorBusqueda = '';
    this.mensajeExito = '';
    this.errorCanje = '';
  }

  get puedeCanjear(): boolean {
    return this.usuarioEncontrado && 
           this.usuarioEncontrado.promocionesPendientes >= this.cantidadCanjear &&
           this.cantidadCanjear > 0;
  }

  get opcionesCantidad(): number[] {
    if (!this.usuarioEncontrado) return [1];
    
    const max = this.usuarioEncontrado.promocionesPendientes;
    return Array.from({ length: max }, (_, i) => i + 1);
  }
}