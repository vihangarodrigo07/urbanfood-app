package com.example.urbanfood_backend.repository;

import com.example.urbanfood_backend.model.Supplier;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class SupplierRepository {

    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public SupplierRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Supplier> getAllSuppliers() {
        return jdbcTemplate.query("SELECT * FROM Supplier", (rs, rowNum) ->
                new Supplier(
                        rs.getInt("SupplierID"),
                        rs.getString("Name"),
                        rs.getString("Contact"),
                        rs.getString("Address")
                ));
    }

    public void addSupplier(Supplier supplier) {
        jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{ call InsertSupplier(?, ?, ?) }");
            cs.setString(1, supplier.getName());
            cs.setString(2, supplier.getContact());
            cs.setString(3, supplier.getAddress());
            cs.execute();
            return null;
        });
    }

    public void updateSupplier(Supplier supplier) {
        jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{ call UpdateSupplier(?, ?, ?, ?) }");
            cs.setInt(1, supplier.getSupplierId());
            cs.setString(2, supplier.getName());
            cs.setString(3, supplier.getContact());
            cs.setString(4, supplier.getAddress());
            cs.execute();
            return null;
        });
    }

    public void deleteSupplier(int supplierId) {
        jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{ call DeleteSupplier(?) }");
            cs.setInt(1, supplierId);
            cs.execute();
            return null;
        });
    }
}