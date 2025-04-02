package com.example.urbanfood_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {
    private int orderId;
    private int customerId;
    private String orderDate;  // Or use LocalDate if preferred
    private double totalAmount;

    // Getters (matching Product.java style)
    public int getOrderId() { return orderId; }
    public int getCustomerId() { return customerId; }
    public String getOrderDate() { return orderDate; }
    public double getTotalAmount() { return totalAmount; }

    // Setters if needed
    public void setOrderId(int orderId) { this.orderId = orderId; }
}