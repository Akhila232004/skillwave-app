![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Aggregate Functions Assignments Solutions

## Count
```sql
-- 1. Total number of borrowers.
SELECT COUNT(*) AS total_borrowers FROM loan_management.borrowers;
-- 2. Total number of loans.
SELECT COUNT(*) AS total_loans FROM loan_management.loans;
-- 3. Total number of payments.
SELECT COUNT(*) AS total_payments FROM loan_management.loan_payments;
-- 4. Number of active loans.
SELECT COUNT(*) AS active_loans FROM loan_management.loans WHERE status = 'Active';
-- 5. Number of closed loans.
SELECT COUNT(*) AS closed_loans FROM loan_management.loans WHERE status = 'Closed';
-- 6. Number of loans per loan_type.
SELECT loan_type, COUNT(*) AS loan_count FROM loan_management.loans GROUP BY loan_type;
-- 7. Number of payments per loan.
SELECT loan_id, COUNT(*) AS payment_count FROM loan_management.loan_payments GROUP BY loan_id;
-- 8. Number of borrowers born before 1990.
SELECT COUNT(*) AS born_before_1990 FROM loan_management.borrowers WHERE date_of_birth < '1990-01-01';
-- 9. Number of loans started in 2023.
SELECT COUNT(*) AS loans_2023 FROM loan_management.loans WHERE YEAR(start_date) = 2023;
-- 10. Number of payments made in March.
SELECT COUNT(*) AS mar_payments FROM loan_management.loan_payments WHERE MONTH(payment_date) = 3;
```

## Sum
```sql
-- 1. Total principal across all loans.
SELECT SUM(principal) AS total_principal FROM loan_management.loans;
-- 2. Total payment amount.
SELECT SUM(amount) AS total_paid FROM loan_management.loan_payments;
-- 3. Total interest_component across all payments.
SELECT SUM(interest_component) AS total_interest FROM loan_management.loan_payments;
-- 4. Total principal_component across all payments.
SELECT SUM(principal_component) AS total_principal_paid FROM loan_management.loan_payments;
-- 5. Total principal for active loans.
SELECT SUM(principal) AS active_principal FROM loan_management.loans WHERE status = 'Active';
-- 6. Total principal for closed loans.
SELECT SUM(principal) AS closed_principal FROM loan_management.loans WHERE status = 'Closed';
-- 7. Total payments per loan.
SELECT loan_id, SUM(amount) AS total_paid_per_loan FROM loan_management.loan_payments GROUP BY loan_id;
-- 8. Total principal per borrower.
SELECT borrower_id, SUM(principal) AS total_principal_per_borrower FROM loan_management.loans GROUP BY borrower_id;
-- 9. Total payments in 2023.
SELECT SUM(amount) AS total_paid_2023 FROM loan_management.loan_payments WHERE YEAR(payment_date) = 2023;
-- 10. Total interest paid per loan.
SELECT loan_id, SUM(interest_component) AS interest_paid FROM loan_management.loan_payments GROUP BY loan_id;
```

## Avg
```sql
-- 1. Average principal amount of all loans.
SELECT AVG(principal) AS avg_principal FROM loan_management.loans;
-- 2. Average interest_rate across all loans.
SELECT AVG(interest_rate) AS avg_rate FROM loan_management.loans;
-- 3. Average payment amount.
SELECT AVG(amount) AS avg_payment FROM loan_management.loan_payments;
-- 4. Average term_months of loans.
SELECT AVG(term_months) AS avg_term FROM loan_management.loans;
-- 5. Average payment amount per loan.
SELECT loan_id, AVG(amount) AS avg_paid_per_loan FROM loan_management.loan_payments GROUP BY loan_id;
-- 6. Average principal_component per payment.
SELECT AVG(principal_component) AS avg_principal_comp FROM loan_management.loan_payments;
-- 7. Average interest_component per payment.
SELECT AVG(interest_component) AS avg_interest_comp FROM loan_management.loan_payments;
-- 8. Average principal per loan_type.
SELECT loan_type, AVG(principal) AS avg_principal_by_type FROM loan_management.loans GROUP BY loan_type;
-- 9. Average payment amount in 2023.
SELECT AVG(amount) AS avg_paid_2023 FROM loan_management.loan_payments WHERE YEAR(payment_date) = 2023;
-- 10. Average interest_rate for active loans.
SELECT AVG(interest_rate) AS avg_rate_active FROM loan_management.loans WHERE status = 'Active';
```

## Max
```sql
-- 1. Maximum principal among all loans.
SELECT MAX(principal) AS max_principal FROM loan_management.loans;
-- 2. Maximum payment amount.
SELECT MAX(amount) AS max_payment FROM loan_management.loan_payments;
-- 3. Maximum interest_rate.
SELECT MAX(interest_rate) AS max_rate FROM loan_management.loans;
-- 4. Maximum term_months.
SELECT MAX(term_months) AS max_term FROM loan_management.loans;
-- 5. Latest payment_date.
SELECT MAX(payment_date) AS latest_payment FROM loan_management.loan_payments;
-- 6. Maximum borrower_id.
SELECT MAX(borrower_id) AS max_borrower_id FROM loan_management.borrowers;
-- 7. Maximum interest_component.
SELECT MAX(interest_component) AS max_interest_comp FROM loan_management.loan_payments;
-- 8. Maximum principal_component.
SELECT MAX(principal_component) AS max_principal_comp FROM loan_management.loan_payments;
-- 9. Maximum principal per loan_type.
SELECT loan_type, MAX(principal) AS max_principal_by_type FROM loan_management.loans GROUP BY loan_type;
-- 10. Most recent loan start_date.
SELECT MAX(start_date) AS latest_loan_start FROM loan_management.loans;
```

## Min
```sql
-- 1. Minimum principal among all loans.
SELECT MIN(principal) AS min_principal FROM loan_management.loans;
-- 2. Minimum payment amount.
SELECT MIN(amount) AS min_payment FROM loan_management.loan_payments;
-- 3. Minimum interest_rate.
SELECT MIN(interest_rate) AS min_rate FROM loan_management.loans;
-- 4. Minimum term_months.
SELECT MIN(term_months) AS min_term FROM loan_management.loans;
-- 5. Earliest payment_date.
SELECT MIN(payment_date) AS earliest_payment FROM loan_management.loan_payments;
-- 6. Earliest date_of_birth.
SELECT MIN(date_of_birth) AS earliest_dob FROM loan_management.borrowers;
-- 7. Minimum interest_component.
SELECT MIN(interest_component) AS min_interest_comp FROM loan_management.loan_payments;
-- 8. Minimum principal_component.
SELECT MIN(principal_component) AS min_principal_comp FROM loan_management.loan_payments;
-- 9. Minimum principal per loan_type.
SELECT loan_type, MIN(principal) AS min_principal_by_type FROM loan_management.loans GROUP BY loan_type;
-- 10. Oldest loan start_date.
SELECT MIN(start_date) AS earliest_loan_start FROM loan_management.loans;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
