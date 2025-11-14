package com.ventas.ventas.DB;

import org.springframework.stereotype.Repository;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

@Repository
public class PedidosEntregadosDB {

    private final DataSource dataSource;

    public PedidosEntregadosDB(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public boolean marcarPedidoComoEntregado(Integer pedidoId) {
        String sql = "UPDATE pedidos SET estado = 'entregado' WHERE id = ? AND estado = 'pendiente'";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, pedidoId);
            int affectedRows = stmt.executeUpdate();

            return affectedRows > 0;

        } catch (SQLException e) {
            System.out.println("Error marcando pedido como entregado: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }
}
