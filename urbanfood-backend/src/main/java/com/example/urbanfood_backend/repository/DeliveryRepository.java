package com.example.urbanfood_backend.repository;

import com.example.urbanfood_backend.model.Delivery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class DeliveryRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public DeliveryRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Get all deliveries
    public List<Delivery> getAllDeliveries() {
        return jdbcTemplate.query("SELECT * FROM Delivery", (rs, rowNum) ->
                new Delivery(
                        rs.getInt("DeliveryID"),
                        rs.getInt("OrderID"),
                        rs.getString("Status"),
                        rs.getDate("DeliveryDate").toLocalDate()
                ));
    }

    // Add delivery using stored procedure
    public void addDelivery(Delivery delivery) {
        jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{ call InsertDelivery(?, ?, ?) }");
            cs.setInt(1, delivery.getOrderId());
            cs.setString(2, delivery.getStatus());
            cs.setDate(3, Date.valueOf(delivery.getDeliveryDate()));
            cs.execute();
            return null;
        });
    }

    // Update delivery using stored procedure
    public void updateDelivery(Delivery delivery) {
        jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{ call UpdateDelivery(?, ?, ?, ?) }");
            cs.setInt(1, delivery.getDeliveryId());
            cs.setInt(2, delivery.getOrderId());
            cs.setString(3, delivery.getStatus());
            cs.setDate(4, Date.valueOf(delivery.getDeliveryDate()));
            cs.execute();
            return null;
        });
    }

    // Delete delivery using stored procedure
    public void deleteDelivery(int deliveryId) {
        jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{ call DeleteDelivery(?) }");
            cs.setInt(1, deliveryId);
            cs.execute();
            return null;
        });
    }
}