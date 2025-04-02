package com.example.urbanfood_backend.contoller;

import com.example.urbanfood_backend.model.Order;
import com.example.urbanfood_backend.repository.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderRepository orderRepository;

    @Autowired
    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllOrders() {
        try {
            List<Order> orders = orderRepository.getAllOrders();
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of("error", "Failed to fetch orders",
                            "details", e.getMessage())
            );
        }
    }

    @PostMapping
    public ResponseEntity<?> addOrder(@RequestBody Order order) {
        try {
            int orderId = orderRepository.addOrder(order);
            return ResponseEntity.ok(Map.of(
                    "message", "Order added successfully",
                    "orderId", orderId
            ));
        } catch (SQLException e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Database error",
                    "details", e.getMessage(),
                    "sqlState", e.getSQLState()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Failed to add order",
                    "details", e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable int id, @RequestBody Order order) {
        try {
            order.setOrderId(id);
            boolean success = orderRepository.updateOrder(order);
            if (success) {
                return ResponseEntity.ok(Map.of(
                        "message", "Order updated successfully"
                ));
            }
            throw new RuntimeException("Failed to update order");
        } catch (SQLException e) {
            return ResponseEntity.status(500).body(
                    Map.of("error", "Database error",
                            "details", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of("error", "Failed to update order",
                            "details", e.getMessage())
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable int id) {
        try {
            boolean success = orderRepository.deleteOrder(id);
            if (success) {
                return ResponseEntity.ok(Map.of(
                        "message", "Order deleted successfully"
                ));
            }
            throw new RuntimeException("Failed to delete order");
        } catch (SQLException e) {
            return ResponseEntity.status(500).body(
                    Map.of("error", "Database error",
                            "details", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of("error", "Failed to delete order",
                            "details", e.getMessage())
            );
        }
    }
}