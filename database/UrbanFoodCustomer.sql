-- Sequence for auto-incrementing CustomerID
CREATE SEQUENCE customer_seq START WITH 1 INCREMENT BY 1;

-- Add Customer Procedure
CREATE OR REPLACE PROCEDURE add_customer (
    p_name IN VARCHAR2,
    p_email IN VARCHAR2,
    p_phone IN VARCHAR2,
    p_address IN VARCHAR2,
    p_customer_id OUT NUMBER
) AS
BEGIN
    SELECT customer_seq.NEXTVAL INTO p_customer_id FROM dual;
    
    INSERT INTO Customer (CustomerID, Name, Email, Phone, Address)
    VALUES (p_customer_id, p_name, p_email, p_phone, p_address);
    
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
/

-- Update Customer Procedure
CREATE OR REPLACE PROCEDURE update_customer (
    p_customer_id IN NUMBER,
    p_name IN VARCHAR2,
    p_email IN VARCHAR2,
    p_phone IN VARCHAR2,
    p_address IN VARCHAR2
) AS
BEGIN
    UPDATE Customer
    SET Name = p_name,
        Email = p_email,
        Phone = p_phone,
        Address = p_address
    WHERE CustomerID = p_customer_id;
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
/

-- Delete Customer Procedure
CREATE OR REPLACE PROCEDURE delete_customer (
    p_customer_id IN NUMBER
) AS
BEGIN
    DELETE FROM Customer WHERE CustomerID = p_customer_id;
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        ROLLBACK;
        RAISE;
END;
/