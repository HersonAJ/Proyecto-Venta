import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CarritoService, ItemCarrito, CarritoState } from '../servicios/carrito-service';
import { AuthService } from '../servicios/auth-service';

@Component({
  selector: 'app-carrito-component',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './carrito-component.html',
  styleUrl: './carrito-component.scss',
})
export class CarritoComponent implements OnInit, OnDestroy {

  carrito: CarritoState = {
    items: [],
    total: 0,
    cantidadTotal: 0
  };
  
  loading: boolean = false;
  private carritoSubscription!: Subscription;

  constructor(
    private carritoService: CarritoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Suscribirse a cambios del carrito
    this.carritoSubscription = this.carritoService.carrito$.subscribe(
      carrito => this.carrito = carrito
    );
  }

  incrementarCantidad(index: number) {
    const nuevaCantidad = this.carrito.items[index].cantidad + 1;
    this.carritoService.actualizarCantidad(index, nuevaCantidad);
  }

  decrementarCantidad(index: number) {
    const nuevaCantidad = this.carrito.items[index].cantidad - 1;
    this.carritoService.actualizarCantidad(index, nuevaCantidad);
  }

  eliminarItem(index: number) {
    this.carritoService.eliminarItem(index);
  }

vaciarCarritoConfirmado() {
  this.carritoService.limpiarCarrito();
}

  confirmarPedido() {
    if (!this.authService.isLoggedIn()) {
      // Redirigir a login si no está autenticado
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/carrito' } 
      });
      return;
    }

    if (this.carrito.items.length === 0) {
      alert('El carrito está vacío');
      return;
    }

    // Navegar a confirmación de pedido
    this.router.navigate(['/confirmar-pedido']);
  }

  getIngredientesQuitados(item: ItemCarrito): string {
    if (!item.personalizacion.ingredientesAQuitar.length) {
      return 'Sin personalizaciones';
    }

    const ingredientesNombres = item.personalizacion.ingredientesAQuitar.map(ingId => {
      const ingrediente = item.producto.ingredientes.find(i => i.id === ingId);
      return ingrediente?.nombre || '';
    }).filter(nombre => nombre !== '');

    return ingredientesNombres.join(', ');
  }

  ngOnDestroy() {
    if (this.carritoSubscription) {
      this.carritoSubscription.unsubscribe();
    }
  }
}