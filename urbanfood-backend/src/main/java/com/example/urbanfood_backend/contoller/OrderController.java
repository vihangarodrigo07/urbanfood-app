package com.example.urbanfood_backend.controller;

import com.example.urbanfood_backend.model.Order;
import com.example.urbanfood_backend.model.OrderItem;
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
            // Validate the order
            if (order.getCustomerId() <= 0) {
                return ResponseEntity.badRequest().body(
                        Map.of("error", "Invalid Customer ID")
                );
            }
            if (order.getItems() == null || order.getItems().isEmpty()) {
                return ResponseEntity.badRequest().body(
                        Map.of("error", "Order must contain at least one item")
                );
            }

            // Calculate total amount
            double totalAmount = order.getItems().stream()
                    .mapToDouble(item -> item.getUnitPrice() * item.getQuantity())
                    .sum();
            order.setTotalAmount(totalAmount);

            // Save the order
            int orderId = orderRepository.addOrder(order);
            orderRepository.addOrderItems(orderId, order.getItems());

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

            // Validate the order
            if (order.getCustomerId() <= 0) {
                return ResponseEntity.badRequest().body(
                        Map.of("error", "Invalid Customer ID")
                );
            }
            if (order.getItems() == null || order.getItems().isEmpty()) {
                return ResponseEntity.badRequest().body(
                        Map.of("error", "Order must contain at least one item")
                );
            }

            // Calculate total amount
            double totalAmount = order.getItems().stream()
                    .mapToDouble(item -> item.getUnitPrice() * item.getQuantity())
                    .sum();
            order.setTotalAmount(totalAmount);

            boolean success = orderRepository.updateOrder(order);
            if (success) {
                return ResponseEntity.ok(Map.of(
                        "message", "Order updated successfully"
                ));
            }
            return ResponseEntity.status(404).body(
                    Map.of("error", "Order not found")
            );
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
            return ResponseEntity.status(404).body(
                    Map.of("error", "Order not found")
            );
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