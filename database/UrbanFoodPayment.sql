CREATE SEQUENCE payment_seq
    START WITH 1       -- First ID will be 1
    INCREMENT BY 1     -- Increment by 1 for each new record
    NOCACHE            -- Prevent gaps in numbering
    NOCYCLE;           -- Don't restart after reaching max value

    
CREATE OR REPLACE PROCEDURE process_payment(
    p_order_id          IN NUMBER,
    p_payment_method    IN VARCHAR2,
    p_amount            IN NUMBER,
    p_status            OUT VARCHAR2
) AS
    v_order_amount      NUMBER;
    v_payment_id        NUMBER;
BEGIN
    -- 1. Get order total amount for validation
    SELECT TotalAmount INTO v_order_amount 
    FROM Orders 
    WHERE OrderID = p_order_id;
    
    -- 2. Validate payment amount
    IF p_amount <= 0 THEN
        p_status := 'ERROR: Invalid payment amount';
        RETURN;
    END IF;
    
    -- 3. Generate new PaymentID
    SELECT payment_seq.NEXTVAL INTO v_payment_id FROM dual;
    
    -- 4. Determine payment status
    IF p_amount >= v_order_amount THEN
        p_status := 'COMPLETED';
    ELSE
        p_status := 'PARTIAL';
    END IF;
    
    -- 5. Insert payment record
    INSERT INTO Payment (
        PaymentID,
        OrderID,
        PaymentMethod,
        Amount,
        Status
    ) VALUES (
        v_payment_id,
        p_order_id,
        p_payment_method,
        p_amount,
        p_status
    );
    
    -- 6. Update order status if needed
    IF p_status = 'COMPLETED' THEN
        UPDATE Orders SET Status = 'PAID' WHERE OrderID = p_order_id;
    END IF;
    
    COMMIT;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        ROLLBACK;
        p_status := 'ERROR: Order not found';
    WHEN OTHERS THEN
        ROLLBACK;
        p_status := 'ERROR: ' || SUBSTR(SQLERRM, 1, 200);
END;
/