CREATE SEQUENCE Supplier_seq 
START WITH 1 
INCREMENT BY 1 
NOCACHE 
NOCYCLE;

CREATE OR REPLACE PROCEDURE InsertSupplier(
    p_Name IN VARCHAR2,
    p_Contact IN VARCHAR2,
    p_Address IN VARCHAR2
) AS
BEGIN
    INSERT INTO Supplier(Name, Contact, Address)
    VALUES (p_Name, p_Contact, p_Address);
END;
/

CREATE OR REPLACE PROCEDURE UpdateSupplier(
    p_SupplierID IN NUMBER,
    p_Name IN VARCHAR2,
    p_Contact IN VARCHAR2,
    p_Address IN VARCHAR2
) AS
BEGIN
    UPDATE Supplier
    SET Name = p_Name, Contact = p_Contact, Address = p_Address
    WHERE SupplierID = p_SupplierID;
END;
/

CREATE OR REPLACE PROCEDURE DeleteSupplier(
    p_SupplierID IN NUMBER
) AS
BEGIN
    DELETE FROM Supplier WHERE SupplierID = p_SupplierID;
END;
/
