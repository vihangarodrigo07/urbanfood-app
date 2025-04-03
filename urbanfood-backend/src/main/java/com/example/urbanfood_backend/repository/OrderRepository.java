package com.example.urbanfood_backend.repository;

import com.example.urbanfood_backend.model.Order;
import com.example.urbanfood_backend.model.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
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

        List<Order> orders = jdbcTemplate.query(sql, (rs, rowNum) -> {
            Order order = new Order();
            order.setOrderId(rs.getInt("OrderID"));
            order.setCustomerId(rs.getInt("CustomerID"));
            order.setOrderDate(rs.getString("OrderDate"));
            order.setTotalAmount(rs.getDouble("TotalAmount"));
            return order;
        });

        // Fetch items for each order
        for (Order order : orders) {
            String itemsSql = "SELECT ProductID, Quantity, UnitPrice FROM Order_Product WHERE OrderID = ?";
            List<OrderItem> items = jdbcTemplate.query(itemsSql,
                    (rs, rowNum) -> new OrderItem(
                            rs.getInt("ProductID"),
                            rs.getInt("Quantity"),
                            rs.getDouble("UnitPrice")
                    ),
                    order.getOrderId()
            );
            order.setItems(items);
        }

        return orders;
    }

    public int addOrder(Order order) throws SQLException {
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    "INSERT INTO \"Order\" (CustomerID, OrderDate, TotalAmount) VALUES (?, ?, ?)",
                    new String[]{"OrderID"}
            );
            ps.setInt(1, order.getCustomerId());
            ps.setString(2, order.getOrderDate());
            ps.setDouble(3, order.getTotalAmount());
            return ps;
        }, keyHolder);

        return keyHolder.getKey().intValue();
    }

    public void addOrderItems(int orderId, List<OrderItem> items) {
        String sql = "INSERT INTO Order_Product (OrderID, ProductID, Quantity, UnitPrice) VALUES (?, ?, ?, ?)";

        jdbcTemplate.batchUpdate(sql, items, items.size(),
                (ps, item) -> {
                    ps.setInt(1, orderId);
                    ps.setInt(2, item.getProductId());
                    ps.setInt(3, item.getQuantity());
                    ps.setDouble(4, item.getUnitPrice());
                });
    }

    public boolean updateOrder(Order order) throws SQLException {
        // First update the order
        int rowsUpdated = jdbcTemplate.update(
                "UPDATE \"Order\" SET CustomerID = ?, OrderDate = ?, TotalAmount = ? WHERE OrderID = ?",
                order.getCustomerId(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getOrderId()
        );

        if (rowsUpdated > 0) {
            // Delete existing items
            jdbcTemplate.update("DELETE FROM Order_Product WHERE OrderID = ?", order.getOrderId());

            // Add new items
            if (order.getItems() != null && !order.getItems().isEmpty()) {
                addOrderItems(order.getOrderId(), order.getItems());
            }
            return true;
        }
        return false;
    }

    public boolean deleteOrder(int orderId) throws SQLException {
        // First delete order items
        jdbcTemplate.update("DELETE FROM Order_Product WHERE OrderID = ?", orderId);

        // Then delete the order
        int rowsDeleted = jdbcTemplate.update("DELETE FROM \"Order\" WHERE OrderID = ?", orderId);
        return rowsDeleted > 0;
    }
}