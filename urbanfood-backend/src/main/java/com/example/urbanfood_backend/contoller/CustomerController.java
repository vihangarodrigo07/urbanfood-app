package com.example.urbanfood_backend.contoller;

import com.example.urbanfood_backend.model.Customer;
import com.example.urbanfood_backend.repository.CustomerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {
    private final CustomerRepository customerRepository;

    @Autowired
    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @GetMapping
    public ResponseEntity<?> getAllCustomers() {
        try {
            List<Customer> customers = customerRepository.getAllCustomers();
            return ResponseEntity.ok(customers);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of("error", "Failed to fetch customers", "details", e.getMessage())
            );
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomerById(@PathVariable int id) {
        try {
            Customer customer = customerRepository.getCustomerById(id);
            return ResponseEntity.ok(customer);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(
                    Map.of("error", "Customer not found", "details", e.getMessage())
            );
        }
    }

    @PostMapping
    public ResponseEntity<?> addCustomer(@RequestBody Customer customer) {
        try {
            if (customer.getName() == null || customer.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(
                        Map.of("error", "Customer name is required")
                );
            }

            int customerId = customerRepository.addCustomer(customer);
            return ResponseEntity.ok(Map.of(
                    "message", "Customer added successfully",
                    "customerId", customerId
            ));
        } catch (SQLException e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Database error",
                    "details", e.getMessage(),
                    "sqlState", e.getSQLState()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "error", "Failed to add customer",
                    "details", e.getMessage()
            ));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable int id, @RequestBody Customer customer) {
        try {
            customer.setCustomerId(id);
            boolean success = customerRepository.updateCustomer(customer);
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Customer updated successfully"));
            }
            return ResponseEntity.status(404).body(Map.of("error", "Customer not found"));
        } catch (SQLException e) {
            return ResponseEntity.status(500).body(
                    Map.of("error", "Database error", "details", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of("error", "Failed to update customer", "details", e.getMessage())
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCustomer(@PathVariable int id) {
        try {
            boolean success = customerRepository.deleteCustomer(id);
            if (success) {
                return ResponseEntity.ok(Map.of("message", "Customer deleted successfully"));
            }
            return ResponseEntity.status(404).body(Map.of("error", "Customer not found"));
        } catch (SQLException e) {
            return ResponseEntity.status(500).body(
                    Map.of("error", "Database error", "details", e.getMessage())
            );
        } catch (Exception e) {
            return ResponseEntity.status(500).body(
                    Map.of("error", "Failed to delete customer", "details", e.getMessage())
            );
        }
    }
}