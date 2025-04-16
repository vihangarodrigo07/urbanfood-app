CREATE SEQUENCE order_seq START WITH 1 INCREMENT BY 1;
-- Drop and recreate the procedure to ensure it's correct
CREATE OR REPLACE PROCEDURE add_order (
    p_customer_id IN NUMBER,
    p_order_date IN VARCHAR2,
    p_total_amount IN NUMBER,
    p_order_id OUT NUMBER
) AS
BEGIN
    -- Get next sequence value
    SELECT order_seq.NEXTVAL INTO p_order_id FROM dual;
    
    -- Explicitly insert with the generated ID
    INSERT INTO "Order" (OrderID, CustomerID, OrderDate, TotalAmount)
    VALUES (p_order_id, p_customer_id, TO_DATE(p_order_date, 'YYYY-MM-DD'), p_total_amount);
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
/

-- 2. UPDATE_ORDER
CREATE OR REPLACE PROCEDURE update_order (
    p_order_id IN NUMBER,
    p_customer_id IN NUMBER,
    p_order_date IN VARCHAR2,
    p_total_amount IN NUMBER
) AS
BEGIN
    UPDATE "Order"
    SET CustomerID = p_customer_id,
        OrderDate = TO_DATE(p_order_date, 'YYYY-MM-DD'),
        TotalAmount = p_total_amount
    WHERE OrderID = p_order_id;
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
/

-- 3. DELETE_ORDER
CREATE OR REPLACE PROCEDURE delete_order (
    p_order_id IN NUMBER
) AS
BEGIN
    DELETE FROM "Order" WHERE OrderID = p_order_id;
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
/

CREATE OR REPLACE PROCEDURE add_order_item(
    p_order_id IN NUMBER,
    p_product_id IN NUMBER,
    p_quantity IN NUMBER,
    p_unit_price IN NUMBER
) AS
BEGIN
    INSERT INTO Order_Product(OrderID, ProductID, Quantity, UnitPrice)
    VALUES (p_order_id, p_product_id, p_quantity, p_unit_price);
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
/