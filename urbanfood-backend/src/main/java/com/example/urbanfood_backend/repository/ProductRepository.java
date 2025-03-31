package com.example.urbanfood_backend.repository;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;  // Add this import
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import com.example.urbanfood_backend.model.Product; // Add this import

@Repository
public class ProductRepository {
    private final JdbcTemplate jdbcTemplate;

    @Autowired  // Add this annotation
    public ProductRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Product> getAllProducts() {
        String sql = "SELECT p.*, s.Name as SupplierName FROM Product p JOIN Supplier s ON p.SupplierID = s.SupplierID";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Product(
                        rs.getInt("ProductID"),
                        rs.getString("Name"),
                        rs.getString("Category"),
                        rs.getDouble("Price"),
                        rs.getInt("Stock"),
                        rs.getInt("SupplierID")  // Add this line
                ));
    }
}