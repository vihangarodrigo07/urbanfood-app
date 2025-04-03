package com.example.urbanfood_backend.model;

public class OrderItem {
    private int productId;
    private int quantity;
    private double unitPrice;

    // No-arg constructor (required by JPA/JDBC)
    public OrderItem() {}

    // All-args constructor
    public OrderItem(int productId, int quantity, double unitPrice) {
        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }

    // Getters and setters
    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getUnitPrice() { return unitPrice; }
    public void setUnitPrice(double unitPrice) { this.unitPrice = unitPrice; }
}