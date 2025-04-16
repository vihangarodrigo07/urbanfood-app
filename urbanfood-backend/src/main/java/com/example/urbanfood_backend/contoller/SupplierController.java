package com.example.urbanfood_backend.contoller;

import com.example.urbanfood_backend.model.Supplier;
import com.example.urbanfood_backend.repository.SupplierRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierRepository supplierRepository;

    public SupplierController(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.getAllSuppliers();
    }

    @PostMapping
    public ResponseEntity<String> addSupplier(@RequestBody Supplier supplier) {
        supplierRepository.addSupplier(supplier);
        return ResponseEntity.ok("Supplier added successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateSupplier(
            @PathVariable int id,
            @RequestBody Supplier supplier) {
        supplier.setSupplierId(id);
        supplierRepository.updateSupplier(supplier);
        return ResponseEntity.ok("Supplier updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteSupplier(@PathVariable int id) {
        supplierRepository.deleteSupplier(id);
        return ResponseEntity.ok("Supplier deleted successfully");
    }
}