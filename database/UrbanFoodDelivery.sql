CREATE SEQUENCE Delivery_seq START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE PROCEDURE InsertDelivery(
    p_OrderID IN NUMBER,
    p_Status IN VARCHAR2,
    p_DeliveryDate IN DATE
) AS
BEGIN
    INSERT INTO Delivery(OrderID, Status, DeliveryDate)
    VALUES (p_OrderID, p_Status, p_DeliveryDate);
END;
/

CREATE OR REPLACE PROCEDURE UpdateDelivery(
    p_DeliveryID IN NUMBER,
    p_OrderID IN NUMBER,
    p_Status IN VARCHAR2,
    p_DeliveryDate IN DATE
) AS
BEGIN
    UPDATE Delivery
    SET OrderID = p_OrderID, Status = p_Status, DeliveryDate = p_DeliveryDate
    WHERE DeliveryID = p_DeliveryID;
END;
/

CREATE OR REPLACE PROCEDURE DeleteDelivery(
    p_DeliveryID IN NUMBER
) AS
BEGIN
    DELETE FROM Delivery WHERE DeliveryID = p_DeliveryID;
END;
/
