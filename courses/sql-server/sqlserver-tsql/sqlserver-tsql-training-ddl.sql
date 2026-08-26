/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server - TSQL Tutorial
*  Description  : Training DDL
*  Author       : Team Tinitiate
*******************************************************************************/



-- DDL:
-- Use tinitiate database
USE tinitiate;

-- Invoice Schema
CREATE SCHEMA invoicing authorization dbo;
ALTER AUTHORIZATION ON SCHEMA::invoicing TO tiuser;

-- Products
CREATE TABLE invoicing.products(
    product_id INT NOT NULL,
    product_category VARCHAR(100),
    product_name VARCHAR(25),
    product_unit_price DECIMAL(12,2));
    
ALTER TABLE invoicing.products ADD CONSTRAINT pk_product_id
PRIMARY KEY(product_id);

-- Invoice
CREATE TABLE invoicing.invoice(
    invoice_id INT NOT NULL,
    invoice_date DATE,
    invoice_total DECIMAL(12,2),
    discount DECIMAL(12,2),
    invoice_price DECIMAL(12,2));
    
ALTER TABLE invoicing.invoice ADD CONSTRAINT pk_invoice_id
PRIMARY KEY(invoice_id);

-- Invoice Details
CREATE TABLE invoicing.invoice_items (
    invoice_item_id INT NOT NULL,
    invoice_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity DECIMAL(12,2),
    invoice_item_price DECIMAL(12,2));

ALTER TABLE invoicing.invoice_items ADD CONSTRAINT pk_invoice_item_id
PRIMARY KEY(invoice_item_id);
ALTER TABLE invoicing.invoice_items ADD CONSTRAINT fk_invoice_id
FOREIGN KEY(invoice_id) REFERENCES invoicing.invoice(invoice_id);
ALTER TABLE invoicing.invoice_items ADD CONSTRAINT fk_product_id
FOREIGN KEY(product_id) REFERENCES invoicing.products(product_id);



-- DML:
-- Products
INSERT INTO invoicing.products (product_id, product_category, product_name, product_unit_price)
VALUES
(1, 'Beverages', 'Coffee', 5.50),
(2, 'Kitchen', 'Sugar', 4.15),
(3, 'Beverages', 'Tea', 3.75),
(4, 'Snacks', 'Cookies', 2.50),
(5, 'Kitchen', 'Salt', 1.20);

-- Invoices
INSERT INTO invoicing.invoice (invoice_id, invoice_date, invoice_total, discount, invoice_price)
VALUES
(101, '2025-08-01', 50.00, 5.00, 45.00),
(102, '2025-08-03', 20.00, 0.00, 20.00),
(103, '2025-08-05', 15.50, 1.50, 14.00);

-- Invoice Items
INSERT INTO invoicing.invoice_items (invoice_item_id, invoice_id, product_id, quantity, invoice_item_price)
VALUES
(1001, 101, 1, 5, 27.50),
(1002, 101, 2, 2, 8.30), 
(1003, 102, 3, 4, 15.00),
(1004, 103, 4, 3, 7.50), 
(1005, 103, 5, 2, 2.40); 
