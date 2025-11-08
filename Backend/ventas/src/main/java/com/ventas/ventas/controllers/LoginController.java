package com.ventas.ventas.controllers;

import com.ventas.ventas.DTOs.Login.LoginRequest;
import com.ventas.ventas.DTOs.Login.LoginResponse;
import com.ventas.ventas.security.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class LoginController {

    private final AuthService authService;

    @Autowired
    public LoginController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        System.out.println("Intento de login recibido:");
        System.out.println("Email: " + loginRequest.getEmail());

        try {
            String jwtToken = authService.autenticarYGenerarToken(loginRequest.getEmail(), loginRequest.getPassword());

            if (jwtToken != null) {
                System.out.println("Login exitoso para: " + loginRequest.getEmail());

                LoginResponse response = new LoginResponse();
                response.setSuccess(true);
                response.setMessage("Autenticacion exitosa");
                response.setToken(jwtToken);

                return ResponseEntity.ok(response);
            } else {
                System.out.println("Credenciales incorrectas para: " + loginRequest.getEmail());

                LoginResponse response = new LoginResponse();
                response.setSuccess(false);
                response.setMessage("Credenciales incorrectas");

                return ResponseEntity.status(401).body(response);
            }

        } catch (Exception e) {
            System.out.println("Error en login: " + e.getMessage());

            LoginResponse response = new LoginResponse();
            response.setSuccess(false);
            response.setMessage("Error del servidor: " + e.getMessage());

            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/test")
    public String test() {
        System.out.println("Test endpoint llamado");
        return "LoginController funcionando correctamente";
    }

    @GetMapping("/test-db")
    public String testDatabase() {
        System.out.println("Probando conexion a base de datos...");
        return "Endpoint temporal - requiere actualizacion";
    }
}