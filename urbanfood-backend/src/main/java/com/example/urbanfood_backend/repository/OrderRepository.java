package com.example.urbanfood_backend.repository;

import com.example.urbanfood_backend.model.Order;
import com.example.urbanfood_backend.model.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
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
                    (rs, rowNum) -> {
                        OrderItem item = new OrderItem();
                        item.setProductId(rs.getInt("ProductID"));
                        item.setQuantity(rs.getInt("Quantity"));
                        item.setUnitPrice(rs.getDouble("UnitPrice"));
                        return item;
                    },
                    order.getOrderId()
            );
            order.setItems(items);
        }

        return orders;
    }

    public int addOrder(Order order) throws SQLException {
        return jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{ call add_order(?, ?, ?, ?) }");
            cs.setInt(1, order.getCustomerId());
            cs.setString(2, order.getOrderDate());
            cs.setDouble(3, order.getTotalAmount());
            cs.registerOutParameter(4, Types.NUMERIC);
            cs.execute();
            return cs.getInt(4);
        });
    }

    public void addOrderItems(int orderId, List<OrderItem> items) throws SQLException {
        for (OrderItem item : items) {
            jdbcTemplate.update(
                    "{ call add_order_item(?, ?, ?, ?) }",
                    orderId,
                    item.getProductId(),
                    item.getQuantity(),
                    item.getUnitPrice()
            );
        }
    }

    public boolean updateOrder(Order order) throws SQLException {
        // First update the order
        int rowsUpdated = jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{ call update_order(?, ?, ?, ?) }");
            cs.setInt(1, order.getOrderId());
            cs.setInt(2, order.getCustomerId());
            cs.setString(3, order.getOrderDate());
            cs.setDouble(4, order.getTotalAmount());
            return cs.executeUpdate();
        });

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
        int rowsDeleted = jdbcTemplate.execute((Connection conn) -> {
            CallableStatement cs = conn.prepareCall("{ call delete_order(?) }");
            cs.setInt(1, orderId);
            return cs.executeUpdate();
        });
        return rowsDeleted > 0;
    }
}