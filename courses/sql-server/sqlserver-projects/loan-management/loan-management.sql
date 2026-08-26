/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server Tutorial
*  Description  : Loan Management Data Model
*  Author       : Team Tinitiate
*******************************************************************************/



-- DDL Syntax:
-- Create 'loan_management' schema
CREATE SCHEMA loan_management;

-- Create 'borrowers' table
CREATE TABLE loan_management.borrowers (
    borrower_id   INT PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    contact_info  VARCHAR(200),
    address       VARCHAR(200),
    date_of_birth DATE
);

-- Create 'loans' table
CREATE TABLE loan_management.loans (
    loan_id         INT PRIMARY KEY,
    borrower_id     INT NOT NULL,
    loan_type       VARCHAR(50) NOT NULL,       -- e.g. 'Personal', 'Mortgage', 'Auto', 'Student', 'Business'
    principal       DECIMAL(12,2) NOT NULL,
    interest_rate   DECIMAL(5,3)  NOT NULL,      -- annual rate, e.g. 0.050 = 5.0%
    start_date      DATE         NOT NULL,
    term_months     INT          NOT NULL,      -- duration in months
    status          VARCHAR(20)  NOT NULL,      -- e.g. 'Active', 'Closed'
    FOREIGN KEY (borrower_id) REFERENCES loan_management.borrowers(borrower_id)
);

-- Create 'loan_payments' table
CREATE TABLE loan_management.loan_payments (
    payment_id         INT PRIMARY KEY,
    loan_id            INT NOT NULL,
    payment_date       DATE        NOT NULL,
    amount             DECIMAL(12,2) NOT NULL,  -- total payment
    principal_component DECIMAL(12,2) NOT NULL,
    interest_component  DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (loan_id) REFERENCES loan_management.loans(loan_id)
);



-- DML Syntax:
-- Insert records for 'borrowers'
INSERT INTO loan_management.borrowers (borrower_id, full_name, contact_info, address, date_of_birth)
VALUES
  ( 1, 'Alice Johnson',     'alice.johnson@example.com', '12 Oak St, Springfield', '1985-04-12'),
  ( 2, 'Bob Smith',         'bob.smith@example.com',     '34 Maple Ave, Centerville','1978-11-30'),
  ( 3, 'Carol Williams',    'carol.williams@example.com','56 Pine Rd, Lakeview',     '1992-06-15'),
  ( 4, 'David Brown',       'david.brown@example.com',   '78 Cedar Dr, Rivertown',   '1980-02-20'),
  ( 5, 'Eva Davis',         'eva.davis@example.com',     '90 Birch Ln, Hillcrest',   '1990-09-05'),
  ( 6, 'Frank Miller',      'frank.miller@example.com',  '123 Elm St, Brookside',    '1975-12-10'),
  ( 7, 'Grace Wilson',      'grace.wilson@example.com',  '456 Spruce St, Valleyview','1988-07-25'),
  ( 8, 'Henry Moore',       'henry.moore@example.com',   '789 Poplar Ct, Meadowfield','1982-01-18'),
  ( 9, 'Ivy Taylor',        'ivy.taylor@example.com',    '321 Walnut St, Forestville','1995-03-22'),
  (10, 'Jack Anderson',     'jack.anderson@example.com', '654 Chestnut St, Brookdale','1979-10-08'),
  (11, 'Karen Thomas',      'karen.thomas@example.com',  '987 Ash St, Lakeshore',     '1993-05-02'),
  (12, 'Leo Jackson',       'leo.jackson@example.com',   '147 Sycamore Rd, Ridgewood','1987-08-30'),
  (13, 'Mia Martin',        'mia.martin@example.com',    '258 Magnolia Ln, Crestview','1991-12-12'),
  (14, 'Noah Lee',          'noah.lee@example.com',      '369 Cypress Ave, Pinecrest','1984-06-07'),
  (15, 'Olivia Harris',     'olivia.harris@example.com', '159 Dogwood St, Brookhaven','1996-11-11');

-- Insert records for 'loans'
INSERT INTO loan_management.loans (loan_id, borrower_id, loan_type, principal, interest_rate, start_date, term_months, status)
VALUES
  ( 1,  1, 'Personal',   10000.00, 0.050, '2023-01-15',  24, 'Active'),
  ( 2,  2, 'Mortgage',  250000.00, 0.035, '2022-06-01', 360, 'Active'),
  ( 3,  3, 'Auto',       30000.00, 0.045, '2024-03-10',  60, 'Active'),
  ( 4,  4, 'Student',    20000.00, 0.040, '2021-08-01', 120, 'Closed'),
  ( 5,  5, 'Business',   50000.00, 0.060, '2020-11-15',  60, 'Active'),
  ( 6,  6, 'Personal',   15000.00, 0.055, '2023-05-20',  36, 'Active'),
  ( 7,  7, 'Auto',       25000.00, 0.042, '2022-09-10',  48, 'Closed'),
  ( 8,  8, 'Mortgage',  180000.00, 0.038, '2020-12-01', 240, 'Active'),
  ( 9,  9, 'Student',    15000.00, 0.043, '2023-07-01', 120, 'Active'),
  (10, 10, 'Business',   75000.00, 0.058, '2021-04-15',  72, 'Closed'),
  (11, 11, 'Personal',    8000.00, 0.050, '2024-01-01',  12, 'Active'),
  (12, 12, 'Auto',       18000.00, 0.047, '2024-02-15',  48, 'Active');

-- Insert records for 'loan_payments'
INSERT INTO loan_management.loan_payments (payment_id, loan_id, payment_date, amount, principal_component, interest_component)
VALUES
  (  1,  1, '2023-01-15', 458.34, 416.67,  41.67),
  (  2,  1, '2023-02-15', 458.34, 416.67,  41.67),
  (  3,  1, '2023-03-15', 458.34, 416.67,  41.67),
  (  4,  1, '2023-04-15', 458.34, 416.67,  41.67),
  (  5,  1, '2023-05-15', 458.34, 416.67,  41.67),
  (  6,  2, '2022-07-01',1736.11, 694.44,1041.67),
  (  7,  2, '2022-08-01',1736.11, 694.44,1041.67),
  (  8,  2, '2022-09-01',1736.11, 694.44,1041.67),
  (  9,  2, '2022-10-01',1736.11, 694.44,1041.67),
  ( 10,  2, '2022-11-01',1736.11, 694.44,1041.67),
  ( 11,  2, '2022-12-01',1736.11, 694.44,1041.67),
  ( 12,  3, '2024-04-10',612.50, 500.00,112.50),
  ( 13,  3, '2024-05-10',612.50, 500.00,112.50),
  ( 14,  3, '2024-06-10',612.50, 500.00,112.50),
  ( 15,  4, '2021-09-01',233.34,166.67, 66.67),
  ( 16,  4, '2021-10-01',233.34,166.67, 66.67),
  ( 17,  4, '2021-11-01',233.34,166.67, 66.67),
  ( 18,  4, '2021-12-01',233.34,166.67, 66.67),
  ( 19,  5, '2020-12-15',1083.33,833.33,250.00),
  ( 20,  5, '2021-01-15',1083.33,833.33,250.00),
  ( 21,  5, '2021-02-15',1083.33,833.33,250.00),
  ( 22,  6, '2023-06-20',485.42,416.67, 68.75),
  ( 23,  6, '2023-07-20',485.42,416.67, 68.75),
  ( 24,  6, '2023-08-20',485.42,416.67, 68.75),
  ( 25,  7, '2022-10-10',608.33,520.83, 87.50),
  ( 26,  7, '2022-11-10',608.33,520.83, 87.50),
  ( 27,  8, '2021-01-01',1320.00, 750.00,570.00),
  ( 28,  8, '2021-02-01',1320.00, 750.00,570.00),
  ( 29,  8, '2021-03-01',1320.00, 750.00,570.00),
  ( 30,  8, '2021-04-01',1320.00, 750.00,570.00),
  ( 31,  9, '2023-08-01',178.75,125.00,53.75),
  ( 32,  9, '2023-09-01',178.75,125.00,53.75),
  ( 33,  9, '2023-10-01',178.75,125.00,53.75),
  ( 34, 10, '2021-05-15',1404.17,1041.67,362.50),
  ( 35, 10, '2021-06-15',1404.17,1041.67,362.50);
