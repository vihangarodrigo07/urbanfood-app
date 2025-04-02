package com.example.urbanfood_backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {
    private int productId;
    private String name;
    private String category;
    private double price;
    private int stock;
    private int supplierId;

    // Getters and Setters
    public int getProductId() {
        return productId;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public double getPrice() {
        return price;
    }

    public int getStock() {
        return stock;
    }

    public int getSupplierId() {
        return supplierId;
    }

    // Setters if needed
    public void setProductId(int productId) {
        this.productId = productId;
    }
}
