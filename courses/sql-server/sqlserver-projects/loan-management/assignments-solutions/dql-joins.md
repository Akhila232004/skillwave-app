![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins Assignments Solutions

## Inner Join
```sql
-- 1. Borrower names with their loan types.
SELECT b.full_name, l.loan_type
  FROM loan_management.borrowers AS b
  INNER JOIN loan_management.loans AS l
    ON b.borrower_id = l.borrower_id;
-- 2. Borrower names, loan start dates and terms.
SELECT b.full_name, l.start_date, l.term_months
  FROM loan_management.borrowers AS b
  INNER JOIN loan_management.loans AS l
    ON b.borrower_id = l.borrower_id;
-- 3. Loan IDs with payment dates and amounts.
SELECT l.loan_id, p.payment_date, p.amount
  FROM loan_management.loans AS l
  INNER JOIN loan_management.loan_payments AS p
    ON l.loan_id = p.loan_id;
-- 4. Borrower names, payment dates and payment amounts.
SELECT b.full_name, p.payment_date, p.amount
  FROM loan_management.borrowers AS b
  INNER JOIN loan_management.loans AS l
    ON b.borrower_id = l.borrower_id
  INNER JOIN loan_management.loan_payments AS p
    ON l.loan_id = p.loan_id;
-- 5. Closed loans with borrower names.
SELECT b.full_name, l.loan_id, l.status
  FROM loan_management.borrowers AS b
  INNER JOIN loan_management.loans AS l
    ON b.borrower_id = l.borrower_id
 WHERE l.status = 'Closed';
-- 6. Loans with any payment > 1000.
SELECT DISTINCT l.loan_id, l.principal
  FROM loan_management.loans AS l
  INNER JOIN loan_management.loan_payments AS p
    ON l.loan_id = p.loan_id
 WHERE p.amount > 1000.00;
-- 7. Borrower contact info with loan details.
SELECT b.full_name, b.contact_info, l.loan_id, l.principal
  FROM loan_management.borrowers AS b
  INNER JOIN loan_management.loans AS l
    ON b.borrower_id = l.borrower_id;
-- 8. Loans and their interest rates alongside borrower address.
SELECT l.loan_id, l.interest_rate, b.address
  FROM loan_management.loans AS l
  INNER JOIN loan_management.borrowers AS b
    ON l.borrower_id = b.borrower_id;
-- 9. Payments and corresponding borrower names.
SELECT p.payment_id, p.amount, b.full_name
  FROM loan_management.loan_payments AS p
  INNER JOIN loan_management.loans AS l
    ON p.loan_id = l.loan_id
  INNER JOIN loan_management.borrowers AS b
    ON l.borrower_id = b.borrower_id;
-- 10. Loans with principal and count of payments (join only).
SELECT l.loan_id, l.principal, COUNT(p.payment_id) AS payment_count
  FROM loan_management.loans AS l
  INNER JOIN loan_management.loan_payments AS p
    ON l.loan_id = p.loan_id
 GROUP BY l.loan_id, l.principal;
```

## Left Join (Left Outer Join)
```sql
-- 1. All borrowers and their loans (if any).
SELECT b.full_name, l.loan_id
  FROM loan_management.borrowers AS b
  LEFT JOIN loan_management.loans AS l
    ON b.borrower_id = l.borrower_id;
-- 2. All loans with borrower names (including unlinked loans).
SELECT l.loan_id, b.full_name
  FROM loan_management.loans AS l
  LEFT JOIN loan_management.borrowers AS b
    ON l.borrower_id = b.borrower_id;
-- 3. All borrowers with their payment dates (if any).
SELECT b.full_name, p.payment_date
  FROM loan_management.borrowers AS b
  LEFT JOIN loan_management.loans AS l
    ON b.borrower_id = l.borrower_id
  LEFT JOIN loan_management.loan_payments AS p
    ON l.loan_id = p.loan_id;
-- 4. All loans with payment amounts (if any).
SELECT l.loan_id, p.amount
  FROM loan_management.loans AS l
  LEFT JOIN loan_management.loan_payments AS p
    ON l.loan_id = p.loan_id;
-- 5. All borrowers with loan types (if any).
SELECT b.full_name, l.loan_type
  FROM loan_management.borrowers AS b
  LEFT JOIN loan_management.loans AS l
    ON b.borrower_id = l.borrower_id;
-- 6. All borrowers with principal amounts of their loans (if any).
SELECT b.full_name, l.principal
  FROM loan_management.borrowers AS b
  LEFT JOIN loan_management.loans AS l
    ON b.borrower_id = l.borrower_id;
-- 7. All loans with interest components of payments (if any).
SELECT l.loan_id, p.interest_component
  FROM loan_management.loans AS l
  LEFT JOIN loan_management.loan_payments AS p
    ON l.loan_id = p.loan_id;
-- 8. All borrowers with loan start dates (if any).
SELECT b.full_name, l.start_date
  FROM loan_management.borrowers AS b
  LEFT JOIN loan_management.loans AS l
    ON b.borrower_id = l.borrower_id;
-- 9. All payments with loan types (if any).
SELECT p.payment_id, l.loan_type
  FROM loan_management.loan_payments AS p
  LEFT JOIN loan_management.loans AS l
    ON p.loan_id = l.loan_id;
-- 10. All borrowers with payment amounts (if any).
SELECT b.full_name, p.amount
  FROM loan_management.borrowers AS b
  LEFT JOIN loan_management.loans AS l
    ON b.borrower_id = l.borrower_id
  LEFT JOIN loan_management.loan_payments AS p
    ON l.loan_id = p.loan_id;
```

## Right Join (Right Outer Join)
```sql
-- 1. All loans and borrower names (including missing borrowers).
SELECT l.loan_id, b.full_name
  FROM loan_management.borrowers AS b
  RIGHT JOIN loan_management.loans AS l
    ON b.borrower_id = l.borrower_id;
-- 2. All payments and loan details (including payments without loans).
SELECT p.payment_id, l.loan_type
  FROM loan_management.loan_payments AS p
  RIGHT JOIN loan_management.loans AS l
    ON p.loan_id = l.loan_id;
-- 3. All loans and payment dates (including loans without payments).
SELECT l.loan_id, p.payment_date
  FROM loan_management.loans AS l
  RIGHT JOIN loan_management.loan_payments AS p
    ON l.loan_id = p.loan_id;
-- 4. All loans and borrower addresses (including orphaned loans).
SELECT l.loan_id, b.address
  FROM loan_management.borrowers AS b
  RIGHT JOIN loan_management.loans AS l
    ON b.borrower_id = l.borrower_id;
-- 5. All payments and borrower names via loans.
SELECT p.payment_id, b.full_name
  FROM loan_management.loan_payments AS p
  RIGHT JOIN loan_management.loans AS l
    ON p.loan_id = l.loan_id
  LEFT JOIN loan_management.borrowers AS b
    ON l.borrower_id = b.borrower_id;
-- 6. All loans and principal_component of payments.
SELECT l.loan_id, p.principal_component
  FROM loan_management.loan_payments AS p
  RIGHT JOIN loan_management.loans AS l
    ON p.loan_id = l.loan_id;
-- 7. All loans and status of loans, showing loans even if no borrower.
SELECT l.loan_id, l.status
  FROM loan_management.borrowers AS b
  RIGHT JOIN loan_management.loans AS l
    ON b.borrower_id = l.borrower_id;
-- 8. All payments and interest rates of their loans.
SELECT p.payment_id, l.interest_rate
  FROM loan_management.loan_payments AS p
  RIGHT JOIN loan_management.loans AS l
    ON p.loan_id = l.loan_id;
-- 9. All loans and payment amounts (including loans with no payments).
SELECT l.loan_id, p.amount
  FROM loan_management.loan_payments AS p
  RIGHT JOIN loan_management.loans AS l
    ON p.loan_id = l.loan_id;
-- 10. All loans and borrower IDs (including loans without borrowers).
SELECT l.loan_id, b.borrower_id
  FROM loan_management.borrowers AS b
  RIGHT JOIN loan_management.loans AS l
    ON b.borrower_id = l.borrower_id;
```

## Full Join (Full Outer Join)
```sql
-- 1. All borrowers and loans (including unmatched).
SELECT b.full_name, l.loan_id
  FROM loan_management.borrowers AS b
  FULL JOIN loan_management.loans AS l
    ON b.borrower_id = l.borrower_id;
-- 2. All loans and payments (including unmatched).
SELECT l.loan_id, p.payment_id
  FROM loan_management.loans AS l
  FULL JOIN loan_management.loan_payments AS p
    ON l.loan_id = p.loan_id;
-- 3. All borrowers and payments via loans.
SELECT b.full_name, p.payment_date
  FROM loan_management.borrowers AS b
  FULL JOIN loan_management.loans AS l
    ON b.borrower_id = l.borrower_id
  FULL JOIN loan_management.loan_payments AS p
    ON l.loan_id = p.loan_id;
-- 4. All loans with borrower addresses (including unmatched).
SELECT l.loan_id, b.address
  FROM loan_management.borrowers AS b
  FULL JOIN loan_management.loans AS l
    ON b.borrower_id = l.borrower_id;
-- 5. All payments and borrower contact info via loans.
SELECT p.payment_id, b.contact_info
  FROM loan_management.loan_payments AS p
  FULL JOIN loan_management.loans AS l
    ON p.loan_id = l.loan_id
  FULL JOIN loan_management.borrowers AS b
    ON l.borrower_id = b.borrower_id;
-- 6. All borrowers and total payment amounts (showing nulls).
SELECT b.full_name, p.amount
  FROM loan_management.borrowers AS b
  FULL JOIN loan_management.loan_payments AS p
    ON b.borrower_id = (SELECT borrower_id FROM loan_management.loans WHERE loan_id = p.loan_id);
-- 7. All loans and loan types with unmatched.
SELECT l.loan_id, l.loan_type
  FROM loan_management.borrowers AS b
  FULL JOIN loan_management.loans AS l
    ON b.borrower_id = l.borrower_id;
-- 8. All loans and principal_component (including unmatched).
SELECT l.loan_id, p.principal_component
  FROM loan_management.loans AS l
  FULL JOIN loan_management.loan_payments AS p
    ON l.loan_id = p.loan_id;
-- 9. All borrowers and start dates of loans.
SELECT b.full_name, l.start_date
  FROM loan_management.borrowers AS b
  FULL JOIN loan_management.loans AS l
    ON b.borrower_id = l.borrower_id;
-- 10. All payments and interest_component of payments.
SELECT p.payment_id, p.interest_component
  FROM loan_management.loan_payments AS p
  FULL JOIN loan_management.loans AS l
    ON p.loan_id = l.loan_id;
```

## Cross Join
```sql
-- 1. Every borrower with every loan type.
SELECT b.full_name, l.loan_type
  FROM loan_management.borrowers AS b
  CROSS JOIN loan_management.loans AS l;
-- 2. Every borrower with every payment date.
SELECT b.full_name, p.payment_date
  FROM loan_management.borrowers AS b
  CROSS JOIN loan_management.loan_payments AS p;
-- 3. Every loan with every payment amount.
SELECT l.loan_id, p.amount
  FROM loan_management.loans AS l
  CROSS JOIN loan_management.loan_payments AS p;
-- 4. Every borrower with every loan status.
SELECT b.full_name, l.status
  FROM loan_management.borrowers AS b
  CROSS JOIN loan_management.loans AS l;
-- 5. Every borrower with every principal amount.
SELECT b.full_name, l.principal
  FROM loan_management.borrowers AS b
  CROSS JOIN loan_management.loans AS l;
-- 6. Every loan with every interest_component.
SELECT l.loan_id, p.interest_component
  FROM loan_management.loans AS l
  CROSS JOIN loan_management.loan_payments AS p;
-- 7. Every borrower with every term_months.
SELECT b.full_name, l.term_months
  FROM loan_management.borrowers AS b
  CROSS JOIN loan_management.loans AS l;
-- 8. Every loan with every contact_info.
SELECT l.loan_id, b.contact_info
  FROM loan_management.loans AS l
  CROSS JOIN loan_management.borrowers AS b;
-- 9. Every payment with every loan start_date.
SELECT p.payment_id, l.start_date
  FROM loan_management.loan_payments AS p
  CROSS JOIN loan_management.loans AS l;
-- 10. Every borrower with every payment principal_component.
SELECT b.full_name, p.principal_component
  FROM loan_management.borrowers AS b
  CROSS JOIN loan_management.loan_payments AS p;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
