package com.example.urbanfood_backend.repository;

import java.util.List;
import com.example.urbanfood_backend.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.sql.Connection;
import java.sql.CallableStatement;

@Repository
public class ProductRepository {

    private final JdbcTemplate jdbcTemplate;

    public ProductRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Get all products
    public List<Product> getAllProducts() {
        String sql = "SELECT * FROM Product";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Product(
                        rs.getInt("ProductID"),
                        rs.getString("Name"),
                        rs.getString("Category"),
                        rs.getDouble("Price"),
                        rs.getInt("Stock"),
                        rs.getInt("SupplierID")
                ));
    }

    // Add product (using PL/SQL)
    public void addProduct(Product product) {
        jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{ call add_product(?, ?, ?, ?, ?) }");
            cs.setString(1, product.getName());
            cs.setString(2, product.getCategory());
            cs.setDouble(3, product.getPrice());
            cs.setInt(4, product.getStock());
            cs.setInt(5, product.getSupplierId());
            cs.execute();
            return null;
        });
    }

    // Update product (using PL/SQL)
    public void updateProduct(Product product) {
        jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{ call update_product(?, ?, ?, ?, ?, ?) }");
            cs.setInt(1, product.getProductId());
            cs.setString(2, product.getName());
            cs.setString(3, product.getCategory());
            cs.setDouble(4, product.getPrice());
            cs.setInt(5, product.getStock());
            cs.setInt(6, product.getSupplierId());
            cs.execute();
            return null;
        });
    }

    // Delete product (using PL/SQL)
    public void deleteProduct(int productId) {
        jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{ call delete_product(?) }");
            cs.setInt(1, productId);
            cs.execute();
            return null;
        });
    }
}