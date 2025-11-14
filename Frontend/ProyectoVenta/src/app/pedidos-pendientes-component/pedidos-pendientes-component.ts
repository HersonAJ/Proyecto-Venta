import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PedidosPendientesService, PedidoPendiente, PedidosPendientesResponse } from '../servicios/pedidos-pendientes-service';
import { AuthService } from '../servicios/auth-service';

@Component({
  selector: 'app-pedidos-pendientes-component',
  imports: [CommonModule],
  templateUrl: './pedidos-pendientes-component.html',
  styleUrl: './pedidos-pendientes-component.scss',
})
export class PedidosPendientesComponent implements OnInit, OnDestroy {

  pedidos: PedidoPendiente[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  private pedidosSubscription!: Subscription;

  constructor(
    private pedidosPendientesService: PedidosPendientesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Verificar que el usuario sea trabajador o admin
    if (!this.authService.isTrabajador()) {
      this.router.navigate(['/inicio']);
      return;
    }

    this.cargarPedidosPendientes();
  }

  cargarPedidosPendientes() {
    this.loading = true;
    this.errorMessage = '';

    this.pedidosPendientesService.obtenerPedidosPendientes().subscribe({
      next: (response: PedidosPendientesResponse) => {
        this.loading = false;
        if (response.success) {
          this.pedidos = response.pedidos;
        } else {
          this.errorMessage = response.message || 'Error al cargar los pedidos pendientes';
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Error de conexión al cargar los pedidos';
        console.error('Error cargando pedidos pendientes:', error);
      }
    });
  }

  getProductosPorTipo(tipo: string, detalles: any[]): any[] {
    return detalles.filter(detalle => detalle.productoTipo === tipo);
  }

  getTiposUnicos(detalles: any[]): string[] {
    return [...new Set(detalles.map(detalle => detalle.productoTipo))];
  }

  getTipoTexto(tipo: string): string {
    const tipos: { [key: string]: string } = {
      'hotdog': '🌭 Hot Dogs',
      'torta': '🥪 Tortas', 
      'taco': '🌮 Tacos'
    };
    return tipos[tipo] || tipo;
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTiempoTranscurrido(fechaPedido: string): string {
    const ahora = new Date();
    const fecha = new Date(fechaPedido);
    const diffMs = ahora.getTime() - fecha.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    return `Hace ${diffHours} h`;
  }

  recargarPedidos() {
    this.cargarPedidosPendientes();
  }

  ngOnDestroy() {
    if (this.pedidosSubscription) {
      this.pedidosSubscription.unsubscribe();
    }
  }
}