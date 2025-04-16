CREATE TABLE Supplier (
    SupplierID NUMBER DEFAULT Supplier_seq.NEXTVAL PRIMARY KEY,
    Name VARCHAR2(100) NOT NULL,
    Contact VARCHAR2(50) NOT NULL,
    Address VARCHAR2(255) NOT NULL
);
CREATE TABLE Product (
    ProductID NUMBER PRIMARY KEY,
    Name VARCHAR2(100),
    Category VARCHAR2(50),
    Price NUMBER(10,2),
    Stock NUMBER,
    SupplierID NUMBER,
    FOREIGN KEY (SupplierID) REFERENCES Supplier(SupplierID)
);

CREATE TABLE Customer (
    CustomerID NUMBER PRIMARY KEY,
    Name VARCHAR2(100),
    Email VARCHAR2(100) UNIQUE,
    Phone VARCHAR2(20),
    Address VARCHAR2(255)
);

CREATE TABLE "Order" (
    OrderID NUMBER PRIMARY KEY,
    CustomerID NUMBER,
    OrderDate DATE,
    TotalAmount NUMBER(10,2),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID)
);

CREATE TABLE Order_Product (
    OrderID NUMBER,
    ProductID NUMBER,
    Quantity NUMBER,
    PRIMARY KEY (OrderID, ProductID),
    FOREIGN KEY (OrderID) REFERENCES "Order"(OrderID),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

    
CREATE TABLE Payment (
    PaymentID NUMBER DEFAULT payment_seq.NEXTVAL PRIMARY KEY,
    OrderID NUMBER NOT NULL,
    PaymentMethod VARCHAR2(50) NOT NULL,
    Amount NUMBER(10,2) NOT NULL,
    Status VARCHAR2(20) DEFAULT 'PENDING',
    PaymentDate TIMESTAMP DEFAULT SYSTIMESTAMP,
    CONSTRAINT fk_order FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);


CREATE TABLE Delivery (
    DeliveryID NUMBER DEFAULT Delivery_seq.NEXTVAL PRIMARY KEY,
    OrderID NUMBER NOT NULL,
    Status VARCHAR2(50) NOT NULL,
    DeliveryDate DATE,
    FOREIGN KEY (OrderID) REFERENCES "Order"(OrderID)
);

SELECT * FROM Supplier;
SELECT * FROM Product;
SELECT * FROM Customer;
SELECT * FROM "Order";
SELECT * FROM Order_Product;
SELECT * FROM Payment;
SELECT * FROM Delivery;

SELECT table_name, constraint_name 
FROM user_constraints 
WHERE r_constraint_name IN (
    SELECT constraint_name 
    FROM user_constraints 
    WHERE table_name = 'Order' AND constraint_type = 'P'
);
-- Add the UnitPrice column to your Order_Product table
ALTER TABLE Order_Product ADD UnitPrice NUMBER(10,2);

-- Update existing records if needed (using Product.Price as default)
UPDATE Order_Product op
SET UnitPrice = (
    SELECT p.Price 
    FROM Product p 
    WHERE p.ProductID = op.ProductID
);

