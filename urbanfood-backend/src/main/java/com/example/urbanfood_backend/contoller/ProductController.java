package com.example.urbanfood_backend.contoller;

import com.example.urbanfood_backend.model.Product;
import com.example.urbanfood_backend.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;

    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Get all products
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.getAllProducts();
    }

    // Add product
    @PostMapping
    public ResponseEntity<String> addProduct(@RequestBody Product product) {
        productRepository.addProduct(product);
        return ResponseEntity.ok("Product added successfully");
    }

    // Update product
    @PutMapping("/{id}")
    public ResponseEntity<String> updateProduct(
            @PathVariable int id,
            @RequestBody Product product
    ) {
        product.setProductId(id);
        productRepository.updateProduct(product);
        return ResponseEntity.ok("Product updated successfully");
    }

    // Delete product
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable int id) {
        productRepository.deleteProduct(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
}
