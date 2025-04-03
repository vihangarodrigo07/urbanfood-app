package com.example.urbanfood_backend.model;

import java.util.List;

public class Order {
    private int orderId;
    private int customerId;
    private String orderDate;
    private double totalAmount;
    private List<OrderItem> items;

    // Getters
    public int getOrderId() { return orderId; }
    public int getCustomerId() { return customerId; }
    public String getOrderDate() { return orderDate; }
    public double getTotalAmount() { return totalAmount; }
    public List<OrderItem> getItems() { return items; }

    // Setters
    public void setOrderId(int orderId) { this.orderId = orderId; }
    public void setCustomerId(int customerId) { this.customerId = customerId; }
    public void setOrderDate(String orderDate) { this.orderDate = orderDate; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
    public void setItems(List<OrderItem> items) { this.items = items; }
}