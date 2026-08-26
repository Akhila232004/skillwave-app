![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations Assignments Solutions

## Union
```sql
-- 1. Combine loan principal amounts with payment amounts.
SELECT principal AS amount FROM loan_management.loans
UNION
SELECT amount FROM loan_management.loan_payments;

-- 2. Union borrower IDs from borrowers and loans.
SELECT borrower_id FROM loan_management.borrowers
UNION
SELECT borrower_id FROM loan_management.loans;

-- 3. Combine loan IDs and payment IDs into one list.
SELECT CAST(loan_id AS VARCHAR(10)) AS id FROM loan_management.loans
UNION
SELECT CAST(payment_id AS VARCHAR(10)) FROM loan_management.loan_payments;

-- 4. Union loan types and loan statuses.
SELECT loan_type AS category FROM loan_management.loans
UNION
SELECT status FROM loan_management.loans;

-- 5. Combine payment dates and loan start dates.
SELECT payment_date AS date_info FROM loan_management.loan_payments
UNION
SELECT start_date FROM loan_management.loans;

-- 6. Union borrower names and loan types.
SELECT full_name AS info FROM loan_management.borrowers
UNION
SELECT loan_type FROM loan_management.loans;

-- 7. Union borrower IDs from loans and from payments (via join).
SELECT borrower_id FROM loan_management.loans
UNION
SELECT l.borrower_id
  FROM loan_management.loan_payments p
  JOIN loan_management.loans l ON p.loan_id = l.loan_id;

-- 8. Union principal_component and interest_component values.
SELECT principal_component AS component FROM loan_management.loan_payments
UNION
SELECT interest_component FROM loan_management.loan_payments;

-- 9. Union max and min principal per borrower.
SELECT MAX(principal) AS principal_value FROM loan_management.loans GROUP BY borrower_id
UNION
SELECT MIN(principal) FROM loan_management.loans GROUP BY borrower_id;

-- 10. Union average payment amount and average principal_component per loan.
SELECT AVG(amount) AS avg_value FROM loan_management.loan_payments GROUP BY loan_id
UNION
SELECT AVG(principal_component) FROM loan_management.loan_payments GROUP BY loan_id;
```

## Intersect
```sql
-- 1. Borrower IDs present in both borrowers and loans.
SELECT borrower_id FROM loan_management.borrowers
INTERSECT
SELECT borrower_id FROM loan_management.loans;

-- 2. Loan IDs present in loans and loan_payments.
SELECT loan_id FROM loan_management.loans
INTERSECT
SELECT loan_id FROM loan_management.loan_payments;

-- 3. Dates that appear as both start_date and payment_date.
SELECT start_date FROM loan_management.loans
INTERSECT
SELECT payment_date FROM loan_management.loan_payments;

-- 4. Principal amounts matching any payment amount.
SELECT principal FROM loan_management.loans
INTERSECT
SELECT amount FROM loan_management.loan_payments;

-- 5. Loan types that also appear as statuses.
SELECT loan_type FROM loan_management.loans
INTERSECT
SELECT status FROM loan_management.loans;

-- 6. Common values between principal_component and interest_component.
SELECT principal_component FROM loan_management.loan_payments
INTERSECT
SELECT interest_component FROM loan_management.loan_payments;

-- 7. Even loan IDs that have payments.
SELECT loan_id FROM loan_management.loans WHERE loan_id % 2 = 0
INTERSECT
SELECT loan_id FROM loan_management.loan_payments;

-- 8. Borrowers with more than one loan who are valid borrowers.
SELECT borrower_id FROM loan_management.loans GROUP BY borrower_id HAVING COUNT(*) > 1
INTERSECT
SELECT borrower_id FROM loan_management.borrowers;

-- 9. Loan types common to loans started in 2022 and 2023.
SELECT loan_type FROM loan_management.loans WHERE YEAR(start_date) = 2022
INTERSECT
SELECT loan_type FROM loan_management.loans WHERE YEAR(start_date) = 2023;

-- 10. Borrowers having both Personal and Auto loans.
SELECT borrower_id FROM loan_management.loans WHERE loan_type = 'Personal'
INTERSECT
SELECT borrower_id FROM loan_management.loans WHERE loan_type = 'Auto';
```

## Except
```sql
-- 1. Borrowers who have no loans.
SELECT borrower_id FROM loan_management.borrowers
EXCEPT
SELECT borrower_id FROM loan_management.loans;

-- 2. Loans that have never received a payment.
SELECT loan_id FROM loan_management.loans
EXCEPT
SELECT loan_id FROM loan_management.loan_payments;

-- 3. Principal values not matched by any payment amount.
SELECT principal FROM loan_management.loans
EXCEPT
SELECT amount FROM loan_management.loan_payments;

-- 4. Loan types that are not used as statuses.
SELECT loan_type FROM loan_management.loans
EXCEPT
SELECT status FROM loan_management.loans;

-- 5. Payment dates that are not loan start dates.
SELECT payment_date FROM loan_management.loan_payments
EXCEPT
SELECT start_date FROM loan_management.loans;

-- 6. Loan types before 2023 excluding those already closed.
SELECT loan_type FROM loan_management.loans WHERE start_date < '2023-01-01'
EXCEPT
SELECT loan_type FROM loan_management.loans WHERE status = 'Closed';

-- 7. Borrowers with more than one loan except those with more than two.
SELECT borrower_id FROM loan_management.loans GROUP BY borrower_id HAVING COUNT(*) > 1
EXCEPT
SELECT borrower_id FROM loan_management.loans GROUP BY borrower_id HAVING COUNT(*) > 2;

-- 8. Mortgage loans that are not active.
SELECT loan_id FROM loan_management.loans WHERE loan_type = 'Mortgage'
EXCEPT
SELECT loan_id FROM loan_management.loans WHERE status = 'Active';

-- 9. Borrowers with loans >20,000 principal except those >50,000.
SELECT borrower_id FROM loan_management.loans WHERE principal > 20000
EXCEPT
SELECT borrower_id FROM loan_management.loans WHERE principal > 50000;

-- 10. Payments excluding those with interest_component < 50.
SELECT payment_id FROM loan_management.loan_payments
EXCEPT
SELECT payment_id FROM loan_management.loan_payments WHERE interest_component < 50;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
