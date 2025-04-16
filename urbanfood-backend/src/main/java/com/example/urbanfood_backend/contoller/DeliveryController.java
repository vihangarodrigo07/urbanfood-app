package com.example.urbanfood_backend.contoller;

import com.example.urbanfood_backend.model.Delivery;
import com.example.urbanfood_backend.repository.DeliveryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
public class DeliveryController {

    private final DeliveryRepository deliveryRepository;

    public DeliveryController(DeliveryRepository deliveryRepository) {
        this.deliveryRepository = deliveryRepository;
    }

    @GetMapping
    public List<Delivery> getAllDeliveries() {
        return deliveryRepository.getAllDeliveries();
    }

    @PostMapping
    public ResponseEntity<String> addDelivery(@RequestBody Delivery delivery) {
        deliveryRepository.addDelivery(delivery);
        return ResponseEntity.ok("Delivery created successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateDelivery(
            @PathVariable int id,
            @RequestBody Delivery delivery) {
        delivery.setDeliveryId(id);
        deliveryRepository.updateDelivery(delivery);
        return ResponseEntity.ok("Delivery updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDelivery(@PathVariable int id) {
        deliveryRepository.deleteDelivery(id);
        return ResponseEntity.ok("Delivery deleted successfully");
    }
}