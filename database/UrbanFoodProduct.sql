CREATE SEQUENCE product_seq
    START WITH 1
    INCREMENT BY 1
    NOCACHE
    NOCYCLE;
    
    SELECT sequence_name FROM user_sequences WHERE sequence_name = 'PRODUCT_SEQ';
    
-- 1. Procedure to add a product
CREATE OR REPLACE PROCEDURE add_product(
    p_name IN VARCHAR2,
    p_category IN VARCHAR2,
    p_price IN NUMBER,
    p_stock IN NUMBER,
    p_supplier_id IN NUMBER
) AS
BEGIN
    INSERT INTO Product (ProductID, Name, Category, Price, Stock, SupplierID)
    VALUES (product_seq.NEXTVAL, p_name, p_category, p_price, p_stock, p_supplier_id);
    COMMIT;
END;
/

-- 2. Procedure to update a product
CREATE OR REPLACE PROCEDURE update_product(
    p_id IN NUMBER,
    p_name IN VARCHAR2,
    p_category IN VARCHAR2,
    p_price IN NUMBER,
    p_stock IN NUMBER,
    p_supplier_id IN NUMBER
) AS
BEGIN
    UPDATE Product
    SET Name = p_name,
        Category = p_category,
        Price = p_price,
        Stock = p_stock,
        SupplierID = p_supplier_Id
    WHERE ProductID = p_id;
    COMMIT;
END;
/

-- 3. Procedure to delete a product
CREATE OR REPLACE PROCEDURE delete_product(p_id IN NUMBER) AS
BEGIN
    DELETE FROM Product WHERE ProductID = p_id;
    COMMIT;
END;
/


BEGIN
    add_product('Test', 'Food', 10.99, 100, 1);
    COMMIT;
END;
/
SELECT * FROM Product;

EXEC update_product(2, 'UpdatedName', 'UpdatedCategory', 15.99, 50, 1);
EXEC delete_product(2);