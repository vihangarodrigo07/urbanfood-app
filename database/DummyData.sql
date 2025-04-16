INSERT INTO Supplier (Name, Contact, Address) VALUES 
('Fresh Foods Co.', 'John Smith', '123 Market St'),
('Beverage Distributors', 'Sarah Johnson', '456 River Rd');

INSERT INTO Product (Name, Category, Price, Stock, SupplierID) VALUES 
('Organic Apples', 'Fruits', 2.99, 100, 1),
('Mineral Water', 'Beverages', 1.50, 200, 2);

INSERT INTO Customer (Name, Email, Phone, Address) VALUES 
('Saman', 'saman@email.com', '555-0101', '101 Main St'),
('Nimal', 'nimal@email.com', '555-0202', '202 Rose Ave');

INSERT INTO "Order" (CustomerID, OrderDate, TotalAmount) VALUES 
(1, TO_DATE('2023-05-15', 'YYYY-MM-DD'), 15.97),
(2, TO_DATE('2023-05-16', 'YYYY-MM-DD'), 8.50);

INSERT INTO Order_Product (OrderID, ProductID, Quantity) VALUES 
(1, 1, 3),
(1, 2, 2);

INSERT INTO Payment (OrderID, PaymentMethod, Amount, Status) VALUES 
(1, 'Credit Card', 15.97, 'COMPLETED'),
(2, 'PayPal', 8.50, 'COMPLETED');

INSERT INTO Delivery (OrderID, Status, DeliveryDate) VALUES 
(1, 'DELIVERED', TO_DATE('2023-05-17', 'YYYY-MM-DD')),
(2, 'SHIPPED', TO_DATE('2023-05-18', 'YYYY-MM-DD'));