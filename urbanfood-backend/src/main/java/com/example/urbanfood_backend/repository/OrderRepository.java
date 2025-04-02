package com.example.urbanfood_backend.repository;

import com.example.urbanfood_backend.model.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.sql.*;
import java.util.List;

@Repository
public class OrderRepository {
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    public OrderRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Order> getAllOrders() {
        String sql = "SELECT OrderID, CustomerID, TO_CHAR(OrderDate, 'YYYY-MM-DD') AS OrderDate, TotalAmount FROM \"Order\"";
        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new Order(
                        rs.getInt("OrderID"),
                        rs.getInt("CustomerID"),
                        rs.getString("OrderDate"),
                        rs.getDouble("TotalAmount")
                ));
    }

    public int addOrder(Order order) throws SQLException {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{ call add_order(?, ?, ?, ?) }");
            cs.setInt(1, order.getCustomerId());
            cs.setString(2, order.getOrderDate());
            cs.setDouble(3, order.getTotalAmount());
            cs.registerOutParameter(4, Types.NUMERIC);
            cs.execute();
            return cs.getInt(4); // Returns the generated OrderID
        });
    }

    public boolean updateOrder(Order order) throws SQLException {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{ call update_order(?, ?, ?, ?) }");
            cs.setInt(1, order.getOrderId());
            cs.setInt(2, order.getCustomerId());
            cs.setString(3, order.getOrderDate());
            cs.setDouble(4, order.getTotalAmount());
            return cs.executeUpdate() > 0;
        });
    }

    public boolean deleteOrder(int orderId) throws SQLException {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{ call delete_order(?) }");
            cs.setInt(1, orderId);
            return cs.executeUpdate() > 0;
        });
    }
}