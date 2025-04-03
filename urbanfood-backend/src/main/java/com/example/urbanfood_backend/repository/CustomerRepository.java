package com.example.urbanfood_backend.repository;

import com.example.urbanfood_backend.model.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.List;

@Repository
public class CustomerRepository {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public CustomerRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Customer> getAllCustomers() {
        String sql = "SELECT CustomerID, Name, Email, Phone, Address FROM Customer";
        return jdbcTemplate.query(sql, customerRowMapper());
    }

    public Customer getCustomerById(int customerId) {
        String sql = "SELECT CustomerID, Name, Email, Phone, Address FROM Customer WHERE CustomerID = ?";
        return jdbcTemplate.queryForObject(sql, customerRowMapper(), customerId);
    }

    public int addCustomer(Customer customer) throws SQLException {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{ call add_customer(?, ?, ?, ?, ?) }");
            cs.setString(1, customer.getName());
            cs.setString(2, customer.getEmail());
            cs.setString(3, customer.getPhone());
            cs.setString(4, customer.getAddress());
            cs.registerOutParameter(5, Types.NUMERIC);
            cs.execute();
            return cs.getInt(5);
        });
    }

    public boolean updateCustomer(Customer customer) throws SQLException {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{ call update_customer(?, ?, ?, ?, ?) }");
            cs.setInt(1, customer.getCustomerId());
            cs.setString(2, customer.getName());
            cs.setString(3, customer.getEmail());
            cs.setString(4, customer.getPhone());
            cs.setString(5, customer.getAddress());
            return cs.executeUpdate() > 0;
        });
    }

    public boolean deleteCustomer(int customerId) throws SQLException {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{ call delete_customer(?) }");
            cs.setInt(1, customerId);
            return cs.executeUpdate() > 0;
        });
    }

    private RowMapper<Customer> customerRowMapper() {
        return (rs, rowNum) -> new Customer(
                rs.getInt("CustomerID"),
                rs.getString("Name"),
                rs.getString("Email"),
                rs.getString("Phone"),
                rs.getString("Address")
        );
    }
}