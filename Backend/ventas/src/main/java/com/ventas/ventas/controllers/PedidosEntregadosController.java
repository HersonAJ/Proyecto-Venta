package com.ventas.ventas.controllers;

import com.ventas.ventas.DB.PedidosEntregadosDB;
import com.ventas.ventas.DTOs.Login.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/trabajador")
@CrossOrigin(origins = "http://localhost:4200")
public class PedidosEntregadosController {

    private final PedidosEntregadosDB pedidosEntregadosDB;
    private final JwtUtil jwtUtil;

    public PedidosEntregadosController(PedidosEntregadosDB pedidosEntregadosDB, JwtUtil jwtUtil) {
        this.pedidosEntregadosDB = pedidosEntregadosDB;
        this.jwtUtil = jwtUtil;
    }

    @PutMapping("/pedidos/{pedidoId}/entregado")
    public ResponseEntity<?> marcarPedidoComoEntregado(
            @PathVariable Integer pedidoId,
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            // Verificar que el usuario sea trabajador o admin
            if (!esTrabajadorOAdmin(authorizationHeader)) {
                return ResponseEntity.status(403).body(Map.of("success", false, "message", "No tiene permisos para realizar esta acción"));
            }

            // Validar pedidoId
            if (pedidoId == null || pedidoId <= 0) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "ID de pedido inválido"));
            }

            Map<String, Object> resultado = pedidosEntregadosDB.marcarPedidoComoEntregado(pedidoId);

            if ((Boolean) resultado.get("success")) {
                Map<String, Object> response = Map.of(
                        "success", true,
                        "message", resultado.get("message")
                );

                // 🟡 AGREGAR: Información de promociones si las hay
                if (resultado.containsKey("nuevasPromociones")) {
                    response = Map.of(
                            "success", true,
                            "message", resultado.get("message"),
                            "nuevasPromociones", resultado.get("nuevasPromociones"),
                            "mensajePromocion", resultado.get("mensajePromocion"),
                            "clienteNombre", resultado.get("clienteNombre")
                    );
                }

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(404).body(Map.of(
                        "success", false,
                        "message", resultado.get("message")
                ));
            }

        } catch (Exception e) {
            System.out.println("ERROR marcando pedido como entregado: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Error interno del servidor"));
        }
    }

    private boolean esTrabajadorOAdmin(String authorizationHeader) {
        try {
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                String token = authorizationHeader.substring(7);

                if (!jwtUtil.validateToken(token)) {
                    return false;
                }

                String rol = jwtUtil.getRoleFromToken(token);
                return "trabajador".equals(rol) || "admin".equals(rol);
            }
            return false;
        } catch (Exception e) {
            System.out.println("Error verificando rol del usuario: " + e.getMessage());
            return false;
        }
    }
}
