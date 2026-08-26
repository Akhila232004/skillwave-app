![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL Assignments Solutions

## Select
```sql
-- 1. Retrieve all borrowers.
SELECT * FROM loan_management.borrowers;
-- 2. List borrower full names and contact info.
SELECT full_name, contact_info FROM loan_management.borrowers;
-- 3. Retrieve loan IDs with principal and interest rate.
SELECT loan_id, principal, interest_rate FROM loan_management.loans;
-- 4. List all payment IDs with payment date and amount.
SELECT payment_id, payment_date, amount FROM loan_management.loan_payments;
-- 5. Show borrower names alongside their loan types.
SELECT b.full_name, l.loan_type
  FROM loan_management.loans AS l
  JOIN loan_management.borrowers AS b
    ON l.borrower_id = b.borrower_id;
-- 6. Retrieve distinct loan types.
SELECT DISTINCT loan_type FROM loan_management.loans;
-- 7. List distinct borrower IDs who have loans.
SELECT DISTINCT borrower_id FROM loan_management.loans;
-- 8. Select payment_date and interest_component for all payments.
SELECT payment_date, interest_component FROM loan_management.loan_payments;
-- 9. Retrieve loan_id and status for all loans.
SELECT loan_id, status FROM loan_management.loans;
-- 10. List borrower full_name and date_of_birth.
SELECT full_name, date_of_birth FROM loan_management.borrowers;
```

## WHERE
```sql
-- 1. Find all active loans.
SELECT * FROM loan_management.loans
 WHERE status = 'Active';
-- 2. Retrieve loans with principal > 50000.
SELECT * FROM loan_management.loans
 WHERE principal > 50000.00;
-- 3. Get payments made in 2023.
SELECT * FROM loan_management.loan_payments
 WHERE YEAR(payment_date) = 2023;
-- 4. List loans with interest_rate <= 0.05.
SELECT * FROM loan_management.loans
 WHERE interest_rate <= 0.050;
-- 5. Retrieve borrowers born before 1990.
SELECT * FROM loan_management.borrowers
 WHERE date_of_birth < '1990-01-01';
-- 6. Find payments with amount between 200 and 1000.
SELECT * FROM loan_management.loan_payments
 WHERE amount BETWEEN 200.00 AND 1000.00;
-- 7. List loans of type 'Mortgage'.
SELECT * FROM loan_management.loans
 WHERE loan_type = 'Mortgage';
-- 8. Retrieve loans started after January 1, 2022.
SELECT * FROM loan_management.loans
 WHERE start_date > '2022-01-01';
-- 9. Find borrowers with 'St' in their address.
SELECT * FROM loan_management.borrowers
 WHERE address LIKE '%St%';
-- 10. Retrieve payments where interest_component = 41.67.
SELECT * FROM loan_management.loan_payments
 WHERE interest_component = 41.67;
```

## GROUP BY
```sql
-- 1. Count loans per borrower.
SELECT borrower_id, COUNT(*) AS loan_count
  FROM loan_management.loans
 GROUP BY borrower_id;
-- 2. Sum principal by loan type.
SELECT loan_type, SUM(principal) AS total_principal
  FROM loan_management.loans
 GROUP BY loan_type;
-- 3. Average interest_rate per loan_type.
SELECT loan_type, AVG(interest_rate) AS avg_rate
  FROM loan_management.loans
 GROUP BY loan_type;
-- 4. Count payments per loan.
SELECT loan_id, COUNT(*) AS payment_count
  FROM loan_management.loan_payments
 GROUP BY loan_id;
-- 5. Sum payment amounts by payment_date.
SELECT payment_date, SUM(amount) AS daily_total
  FROM loan_management.loan_payments
 GROUP BY payment_date;
-- 6. Average payment amount per loan.
SELECT loan_id, AVG(amount) AS avg_payment
  FROM loan_management.loan_payments
 GROUP BY loan_id;
-- 7. Count loans by status.
SELECT status, COUNT(*) AS count_by_status
  FROM loan_management.loans
 GROUP BY status;
-- 8. Sum principal by status.
SELECT status, SUM(principal) AS principal_sum
  FROM loan_management.loans
 GROUP BY status;
-- 9. Average term_months per loan_type.
SELECT loan_type, AVG(term_months) AS avg_term
  FROM loan_management.loans
 GROUP BY loan_type;
-- 10. Count borrowers by birth year.
SELECT YEAR(date_of_birth) AS birth_year, COUNT(*) AS count_borrowers
  FROM loan_management.borrowers
 GROUP BY YEAR(date_of_birth);
```

## HAVING
```sql
-- 1. Loan types having more than 2 loans.
SELECT loan_type, COUNT(*) AS loan_count
  FROM loan_management.loans
 GROUP BY loan_type
HAVING COUNT(*) > 2;
-- 2. Loan types with total principal > 100000.
SELECT loan_type, SUM(principal) AS total_principal
  FROM loan_management.loans
 GROUP BY loan_type
HAVING SUM(principal) > 100000.00;
-- 3. Borrowers with more than 1 loan.
SELECT borrower_id, COUNT(*) AS num_loans
  FROM loan_management.loans
 GROUP BY borrower_id
HAVING COUNT(*) > 1;
-- 4. Payment dates with total amount > 1000.
SELECT payment_date, SUM(amount) AS total_paid
  FROM loan_management.loan_payments
 GROUP BY payment_date
HAVING SUM(amount) > 1000.00;
-- 5. Statuses with average interest_rate < 0.05.
SELECT status, AVG(interest_rate) AS avg_rate
  FROM loan_management.loans
 GROUP BY status
HAVING AVG(interest_rate) < 0.050;
-- 6. Loan types where max principal > 50000.
SELECT loan_type, MAX(principal) AS max_principal
  FROM loan_management.loans
 GROUP BY loan_type
HAVING MAX(principal) > 50000.00;
-- 7. Birth years with more than 2 borrowers.
SELECT YEAR(date_of_birth) AS birth_year, COUNT(*) AS cnt
  FROM loan_management.borrowers
 GROUP BY YEAR(date_of_birth)
HAVING COUNT(*) > 2;
-- 8. Loans having more than 3 payments.
SELECT loan_id, COUNT(*) AS payment_count
  FROM loan_management.loan_payments
 GROUP BY loan_id
HAVING COUNT(*) > 3;
-- 9. Loan types where average term >= 60.
SELECT loan_type, AVG(term_months) AS avg_term
  FROM loan_management.loans
 GROUP BY loan_type
HAVING AVG(term_months) >= 60;
-- 10. Borrowers with total principal > 20000.
SELECT b.borrower_id, b.full_name, SUM(l.principal) AS sum_principal
  FROM loan_management.loans AS l
  JOIN loan_management.borrowers AS b
    ON l.borrower_id = b.borrower_id
 GROUP BY b.borrower_id, b.full_name
HAVING SUM(l.principal) > 20000.00;
```

## ORDER BY
```sql
-- 1. Loans ordered by start_date ascending.
SELECT * FROM loan_management.loans
 ORDER BY start_date ASC;
-- 2. Borrowers ordered by full_name descending.
SELECT * FROM loan_management.borrowers
 ORDER BY full_name DESC;
-- 3. Loans ordered by principal descending.
SELECT * FROM loan_management.loans
 ORDER BY principal DESC;
-- 4. Payments ordered by payment_date descending.
SELECT * FROM loan_management.loan_payments
 ORDER BY payment_date DESC;
-- 5. Loans ordered by interest_rate ascending.
SELECT * FROM loan_management.loans
 ORDER BY interest_rate ASC;
-- 6. Borrowers ordered by date_of_birth ascending.
SELECT * FROM loan_management.borrowers
 ORDER BY date_of_birth ASC;
-- 7. Loans ordered by term_months descending.
SELECT * FROM loan_management.loans
 ORDER BY term_months DESC;
-- 8. Payments ordered by amount ascending.
SELECT * FROM loan_management.loan_payments
 ORDER BY amount ASC;
-- 9. Loans ordered by status, then start_date.
SELECT * FROM loan_management.loans
 ORDER BY status, start_date;
-- 10. Loans ordered by borrower_id, then loan_type.
SELECT * FROM loan_management.loans
 ORDER BY borrower_id, loan_type;
```

## TOP
```sql
-- 1. Top 5 highest principal loans.
SELECT TOP 5 * FROM loan_management.loans
 ORDER BY principal DESC;
-- 2. Top 3 borrowers by number of loans.
SELECT TOP 3 borrower_id, COUNT(*) AS loan_count
  FROM loan_management.loans
 GROUP BY borrower_id
 ORDER BY loan_count DESC;
-- 3. Top 5 payments by amount.
SELECT TOP 5 * FROM loan_management.loan_payments
 ORDER BY amount DESC;
-- 4. Top 1 loan with highest interest_rate.
SELECT TOP 1 * FROM loan_management.loans
 ORDER BY interest_rate DESC;
-- 5. Top 3 loan types by total principal.
SELECT TOP 3 loan_type, SUM(principal) AS total_principal
  FROM loan_management.loans
 GROUP BY loan_type
 ORDER BY total_principal DESC;
-- 6. Top 10 newest loans by start_date.
SELECT TOP 10 * FROM loan_management.loans
 ORDER BY start_date DESC;
-- 7. Top 5 oldest borrowers by date_of_birth.
SELECT TOP 5 * FROM loan_management.borrowers
 ORDER BY date_of_birth ASC;
-- 8. Top 5 payments with largest interest_component.
SELECT TOP 5 * FROM loan_management.loan_payments
 ORDER BY interest_component DESC;
-- 9. Top 3 loans with longest term.
SELECT TOP 3 * FROM loan_management.loans
 ORDER BY term_months DESC;
-- 10. Top 5 borrowers by total principal borrowed.
SELECT TOP 5 b.full_name, SUM(l.principal) AS total_principal
  FROM loan_management.loans AS l
  JOIN loan_management.borrowers AS b
    ON l.borrower_id = b.borrower_id
 GROUP BY b.full_name
 ORDER BY total_principal DESC;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
