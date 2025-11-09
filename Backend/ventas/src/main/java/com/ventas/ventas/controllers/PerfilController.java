package com.ventas.ventas.controllers;


import com.ventas.ventas.DB.PerfilDB;
import com.ventas.ventas.DTOs.Perfil.PerfilCompletoResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/usuario")
@CrossOrigin(origins = "http://localhost:4200")
public class PerfilController {

    private final PerfilDB perfilDB;

    public PerfilController(PerfilDB perfilDB) {
        this.perfilDB = perfilDB;
    }

    @GetMapping("/perfil-completo")
    public ResponseEntity<?> getPerfilCompleto(Authentication authentication) {
        try {
            String email = authentication.getName();
            PerfilCompletoResponse perfil = perfilDB.obtenerPerfilCompleto(email);

            if (perfil != null) {
                return ResponseEntity.ok(perfil);
            } else {
                return ResponseEntity.status(404).body("Usuario no encontrado");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al obtener perfil");
        }
    }
}