![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments Solutions

## Aggregate Functions
```sql
-- 1. Count loans per borrower (window).
SELECT loan_id, borrower_id,
       COUNT(*) OVER (PARTITION BY borrower_id) AS loans_per_borrower
  FROM loan_management.loans;
-- 2. Sum of payments per loan (window).
SELECT payment_id, loan_id,
       SUM(amount) OVER (PARTITION BY loan_id) AS total_paid
  FROM loan_management.loan_payments;
-- 3. Average payment amount per loan (window).
SELECT payment_id, loan_id,
       AVG(amount) OVER (PARTITION BY loan_id) AS avg_payment
  FROM loan_management.loan_payments;
-- 4. Max payment amount per loan (window).
SELECT payment_id, loan_id,
       MAX(amount) OVER (PARTITION BY loan_id) AS max_payment
  FROM loan_management.loan_payments;
-- 5. Min payment date per loan (window).
SELECT payment_id, loan_id,
       MIN(payment_date) OVER (PARTITION BY loan_id) AS first_payment
  FROM loan_management.loan_payments;
-- 6. Cumulative principal per loan ordered by payment_date.
SELECT payment_id, loan_id,
       SUM(principal_component) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
         ROWS UNBOUNDED PRECEDING
       ) AS cum_principal
  FROM loan_management.loan_payments;
-- 7. Running total of interest_component over all payments.
SELECT payment_id,
       SUM(interest_component) OVER (
         ORDER BY payment_date
         ROWS UNBOUNDED PRECEDING
       ) AS running_interest
  FROM loan_management.loan_payments;
-- 8. Count of payments per borrower using join (window).
SELECT p.payment_id, l.borrower_id,
       COUNT(*) OVER (PARTITION BY l.borrower_id) AS payments_per_borrower
  FROM loan_management.loan_payments AS p
  JOIN loan_management.loans AS l
    ON p.loan_id = l.loan_id;
-- 9. Average term_months by loan_type (window).
SELECT loan_id, loan_type,
       AVG(term_months) OVER (PARTITION BY loan_type) AS avg_term_by_type
  FROM loan_management.loans;
-- 10. Rolling 3-payment average amount per loan.
SELECT payment_id, loan_id,
       AVG(amount) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
         ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
       ) AS rolling_avg_3
  FROM loan_management.loan_payments;
```

## ROW_NUMBER()
```sql
-- 1. Sequence of payments per loan.
SELECT payment_id, loan_id,
       ROW_NUMBER() OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
       ) AS payment_seq
  FROM loan_management.loan_payments;
-- 2. Rank loans by principal per borrower.
SELECT loan_id, borrower_id, principal,
       ROW_NUMBER() OVER (
         PARTITION BY borrower_id
         ORDER BY principal DESC
       ) AS rn_principal
  FROM loan_management.loans;
-- 3. Row number of borrowers by age.
SELECT borrower_id, full_name,
       ROW_NUMBER() OVER (ORDER BY date_of_birth) AS rn_by_age
  FROM loan_management.borrowers;
-- 4. Global payment sequence across all loans.
SELECT payment_id, payment_date,
       ROW_NUMBER() OVER (ORDER BY payment_date) AS global_payment_seq
  FROM loan_management.loan_payments;
-- 5. Loan sequence by start_date.
SELECT loan_id, start_date,
       ROW_NUMBER() OVER (ORDER BY start_date) AS loan_seq_by_date
  FROM loan_management.loans;
-- 6. Row number within birth decade.
SELECT borrower_id, date_of_birth,
       ROW_NUMBER() OVER (
         PARTITION BY DATEPART(year,date_of_birth)/10
         ORDER BY date_of_birth
       ) AS rn_decade
  FROM loan_management.borrowers;
-- 7. Alphabetical row number of loan types.
SELECT DISTINCT loan_type,
       ROW_NUMBER() OVER (ORDER BY loan_type) AS rn_type
  FROM loan_management.loans;
-- 8. Row number of payments by amount descending.
SELECT payment_id, amount,
       ROW_NUMBER() OVER (ORDER BY amount DESC) AS rn_amount_desc
  FROM loan_management.loan_payments;
-- 9. Row number of interest_component per loan.
SELECT payment_id, loan_id, interest_component,
       ROW_NUMBER() OVER (
         PARTITION BY loan_id
         ORDER BY interest_component DESC
       ) AS rn_int_desc
  FROM loan_management.loan_payments;
-- 10. Row number of interest_rate per loan_type.
SELECT loan_id, loan_type, interest_rate,
       ROW_NUMBER() OVER (
         PARTITION BY loan_type
         ORDER BY interest_rate
       ) AS rn_rate
  FROM loan_management.loans;
```

## RANK()
```sql
-- 1. Rank loans by principal descending.
SELECT loan_id, principal,
       RANK() OVER (ORDER BY principal DESC) AS rank_principal
  FROM loan_management.loans;
-- 2. Rank payments by amount within each loan.
SELECT payment_id, loan_id, amount,
       RANK() OVER (
         PARTITION BY loan_id
         ORDER BY amount DESC
       ) AS rank_within_loan
  FROM loan_management.loan_payments;
-- 3. Rank borrowers by oldest age.
SELECT borrower_id, full_name,
       RANK() OVER (ORDER BY date_of_birth) AS rank_by_age
  FROM loan_management.borrowers;
-- 4. Rank loans by term_months within loan_type.
SELECT loan_id, loan_type, term_months,
       RANK() OVER (
         PARTITION BY loan_type
         ORDER BY term_months DESC
       ) AS rank_term_type
  FROM loan_management.loans;
-- 5. Rank payments by interest_component descending.
SELECT payment_id, interest_component,
       RANK() OVER (ORDER BY interest_component DESC) AS rank_interest
  FROM loan_management.loan_payments;
-- 6. Rank borrowers by number of loans.
SELECT borrower_id, loan_count,
       RANK() OVER (ORDER BY loan_count DESC) AS rank_loan_count
  FROM (
    SELECT borrower_id, COUNT(*) AS loan_count
      FROM loan_management.loans
     GROUP BY borrower_id
  ) AS t;
-- 7. Rank loan types by average principal.
SELECT DISTINCT loan_type,
       RANK() OVER (
         ORDER BY AVG(principal) OVER (PARTITION BY loan_type) DESC
       ) AS rank_type_avg
  FROM loan_management.loans;
-- 8. Rank payments by date per loan.
SELECT payment_id, loan_id, payment_date,
       RANK() OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
       ) AS rank_pay_date
  FROM loan_management.loan_payments;
-- 9. Rank loans by interest_rate.
SELECT loan_id, interest_rate,
       RANK() OVER (ORDER BY interest_rate DESC) AS rank_rate
  FROM loan_management.loans;
-- 10. Rank borrowers by earliest loan start.
SELECT borrower_id, first_loan_date,
       RANK() OVER (ORDER BY first_loan_date) AS rank_first_loan
  FROM (
    SELECT borrower_id, MIN(start_date) AS first_loan_date
      FROM loan_management.loans
     GROUP BY borrower_id
  ) AS t;
```

## DENSE_RANK()
```sql
-- 1. Dense rank loans by principal.
SELECT loan_id, principal,
       DENSE_RANK() OVER (ORDER BY principal DESC) AS dense_rank_principal
  FROM loan_management.loans;
-- 2. Dense rank payments by amount per loan.
SELECT payment_id, loan_id, amount,
       DENSE_RANK() OVER (
         PARTITION BY loan_id
         ORDER BY amount DESC
       ) AS dense_rank_pay
  FROM loan_management.loan_payments;
-- 3. Dense rank borrowers by age.
SELECT borrower_id, full_name,
       DENSE_RANK() OVER (ORDER BY date_of_birth) AS dense_rank_age
  FROM loan_management.borrowers;
-- 4. Dense rank loans by term within type.
SELECT loan_id, loan_type, term_months,
       DENSE_RANK() OVER (
         PARTITION BY loan_type
         ORDER BY term_months DESC
       ) AS dense_rank_term
  FROM loan_management.loans;
-- 5. Dense rank payments by interest_component.
SELECT payment_id, interest_component,
       DENSE_RANK() OVER (ORDER BY interest_component DESC) AS dense_rank_int
  FROM loan_management.loan_payments;
-- 6. Dense rank borrowers by loan count.
SELECT borrower_id, loan_count,
       DENSE_RANK() OVER (ORDER BY loan_count DESC) AS dense_rank_loans
  FROM (
    SELECT borrower_id, COUNT(*) AS loan_count
      FROM loan_management.loans
     GROUP BY borrower_id
  ) AS t;
-- 7. Dense rank loan types by avg principal.
SELECT DISTINCT loan_type,
       DENSE_RANK() OVER (
         ORDER BY AVG(principal) OVER (PARTITION BY loan_type) DESC
       ) AS dense_rank_type_avg
  FROM loan_management.loans;
-- 8. Dense rank payments by date per loan.
SELECT payment_id, loan_id, payment_date,
       DENSE_RANK() OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
       ) AS dense_rank_pay_date
  FROM loan_management.loan_payments;
-- 9. Dense rank loans by interest_rate.
SELECT loan_id, interest_rate,
       DENSE_RANK() OVER (ORDER BY interest_rate DESC) AS dense_rank_rate
  FROM loan_management.loans;
-- 10. Dense rank borrowers by first loan date.
SELECT borrower_id, first_loan,
       DENSE_RANK() OVER (ORDER BY first_loan) AS dense_rank_first
  FROM (
    SELECT borrower_id, MIN(start_date) AS first_loan
      FROM loan_management.loans
     GROUP BY borrower_id
  ) AS t;
```

## NTILE(n)
```sql
-- 1. Quartiles of loans by principal.
SELECT loan_id, principal,
       NTILE(4) OVER (ORDER BY principal) AS quartile_principal
  FROM loan_management.loans;
-- 2. Tertiles of payments by amount.
SELECT payment_id, amount,
       NTILE(3) OVER (ORDER BY amount) AS tertile_amount
  FROM loan_management.loan_payments;
-- 3. Deciles of interest_rate.
SELECT loan_id, interest_rate,
       NTILE(10) OVER (ORDER BY interest_rate) AS decile_rate
  FROM loan_management.loans;
-- 4. Quartiles of term_months.
SELECT loan_id, term_months,
       NTILE(4) OVER (ORDER BY term_months) AS quartile_term
  FROM loan_management.loans;
-- 5. Quartiles of payments per loan.
SELECT payment_id, loan_id, amount,
       NTILE(4) OVER (
         PARTITION BY loan_id
         ORDER BY amount
       ) AS quartile_pay
  FROM loan_management.loan_payments;
-- 6. Quartiles of payments per borrower.
SELECT p.payment_id, l.borrower_id, p.amount,
       NTILE(4) OVER (
         PARTITION BY l.borrower_id
         ORDER BY p.amount
       ) AS quartile_borrower_pay
  FROM loan_management.loan_payments p
  JOIN loan_management.loans l ON p.loan_id = l.loan_id;
-- 7. Quintiles of loan start_date.
SELECT loan_id, start_date,
       NTILE(5) OVER (ORDER BY start_date) AS quintile_start
  FROM loan_management.loans;
-- 8. Quartiles of interest_component.
SELECT payment_id, interest_component,
       NTILE(4) OVER (ORDER BY interest_component) AS quartile_interest
  FROM loan_management.loan_payments;
-- 9. Quartiles of principal_component.
SELECT payment_id, principal_component,
       NTILE(4) OVER (ORDER BY principal_component) AS quartile_principal_comp
  FROM loan_management.loan_payments;
-- 10. Quintiles of loan_count per borrower.
SELECT borrower_id, loan_count,
       NTILE(5) OVER (ORDER BY loan_count) AS quintile_loan_count
  FROM (
    SELECT borrower_id, COUNT(*) AS loan_count
      FROM loan_management.loans
     GROUP BY borrower_id
  ) AS t;
```

## LAG()
```sql
-- 1. Previous payment amount per loan.
SELECT payment_id, loan_id, amount,
       LAG(amount) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
       ) AS prev_amount
  FROM loan_management.loan_payments;
-- 2. Previous payment date per loan.
SELECT payment_id, loan_id, payment_date,
       LAG(payment_date) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
       ) AS prev_date
  FROM loan_management.loan_payments;
-- 3. Previous interest_component per loan.
SELECT payment_id, loan_id, interest_component,
       LAG(interest_component) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
       ) AS prev_interest
  FROM loan_management.loan_payments;
-- 4. Previous principal_component per loan.
SELECT payment_id, loan_id, principal_component,
       LAG(principal_component) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
       ) AS prev_principal_comp
  FROM loan_management.loan_payments;
-- 5. Previous loan principal by borrower.
SELECT loan_id, borrower_id, principal,
       LAG(principal) OVER (
         PARTITION BY borrower_id
         ORDER BY start_date
       ) AS prev_loan_principal
  FROM loan_management.loans;
-- 6. Previous term_months by borrower.
SELECT loan_id, borrower_id, term_months,
       LAG(term_months) OVER (
         PARTITION BY borrower_id
         ORDER BY start_date
       ) AS prev_term
  FROM loan_management.loans;
-- 7. Previous interest_rate by borrower.
SELECT loan_id, borrower_id, interest_rate,
       LAG(interest_rate) OVER (
         PARTITION BY borrower_id
         ORDER BY start_date
       ) AS prev_rate
  FROM loan_management.loans;
-- 8. Previous borrower_id for each payment.
SELECT payment_id, loan_id,
       LAG(loan_id) OVER (ORDER BY payment_date) AS prev_loan_id
  FROM loan_management.loan_payments;
-- 9. Two payments ago amount per loan.
SELECT payment_id, loan_id, amount,
       LAG(amount,2) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
       ) AS two_before_amount
  FROM loan_management.loan_payments;
-- 10. Previous start_date per borrower.
SELECT loan_id, borrower_id, start_date,
       LAG(start_date) OVER (
         PARTITION BY borrower_id
         ORDER BY start_date
       ) AS prev_start_date
  FROM loan_management.loans;
```

## LEAD()
```sql
-- 1. Next payment amount per loan.
SELECT payment_id, loan_id, amount,
       LEAD(amount) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
       ) AS next_amount
  FROM loan_management.loan_payments;
-- 2. Next payment date per loan.
SELECT payment_id, loan_id, payment_date,
       LEAD(payment_date) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
       ) AS next_date
  FROM loan_management.loan_payments;
-- 3. Next interest_component per loan.
SELECT payment_id, loan_id, interest_component,
       LEAD(interest_component) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
       ) AS next_interest
  FROM loan_management.loan_payments;
-- 4. Next principal_component per loan.
SELECT payment_id, loan_id, principal_component,
       LEAD(principal_component) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
       ) AS next_principal_comp
  FROM loan_management.loan_payments;
-- 5. Next loan principal by borrower.
SELECT loan_id, borrower_id, principal,
       LEAD(principal) OVER (
         PARTITION BY borrower_id
         ORDER BY start_date
       ) AS next_loan_principal
  FROM loan_management.loans;
-- 6. Next term_months by borrower.
SELECT loan_id, borrower_id, term_months,
       LEAD(term_months) OVER (
         PARTITION BY borrower_id
         ORDER BY start_date
       ) AS next_term
  FROM loan_management.loans;
-- 7. Next interest_rate by borrower.
SELECT loan_id, borrower_id, interest_rate,
       LEAD(interest_rate) OVER (
         PARTITION BY borrower_id
         ORDER BY start_date
       ) AS next_rate
  FROM loan_management.loans;
-- 8. Next borrower_id for each payment.
SELECT payment_id, loan_id,
       LEAD(loan_id) OVER (ORDER BY payment_date) AS next_loan_id
  FROM loan_management.loan_payments;
-- 9. Two payments ahead amount per loan.
SELECT payment_id, loan_id, amount,
       LEAD(amount,2) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
       ) AS two_after_amount
  FROM loan_management.loan_payments;
-- 10. Next start_date per borrower.
SELECT loan_id, borrower_id, start_date,
       LEAD(start_date) OVER (
         PARTITION BY borrower_id
         ORDER BY start_date
       ) AS next_start_date
  FROM loan_management.loans;
```

## FIRST_VALUE()
```sql
-- 1. First payment date per loan.
SELECT payment_id, loan_id, payment_date,
       FIRST_VALUE(payment_date) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
         ROWS UNBOUNDED PRECEDING
       ) AS first_payment_date
  FROM loan_management.loan_payments;
-- 2. First payment amount per loan.
SELECT payment_id, loan_id, amount,
       FIRST_VALUE(amount) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
         ROWS UNBOUNDED PRECEDING
       ) AS first_amount
  FROM loan_management.loan_payments;
-- 3. First loan start_date per borrower.
SELECT loan_id, borrower_id, start_date,
       FIRST_VALUE(start_date) OVER (
         PARTITION BY borrower_id
         ORDER BY start_date
         ROWS UNBOUNDED PRECEDING
       ) AS first_loan_date
  FROM loan_management.loans;
-- 4. First principal_component per loan.
SELECT payment_id, loan_id, principal_component,
       FIRST_VALUE(principal_component) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
         ROWS UNBOUNDED PRECEDING
       ) AS first_principal_comp
  FROM loan_management.loan_payments;
-- 5. First interest_component per loan.
SELECT payment_id, loan_id, interest_component,
       FIRST_VALUE(interest_component) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
         ROWS UNBOUNDED PRECEDING
       ) AS first_interest_comp
  FROM loan_management.loan_payments;
-- 6. First term_months per borrower.
SELECT loan_id, borrower_id, term_months,
       FIRST_VALUE(term_months) OVER (
         PARTITION BY borrower_id
         ORDER BY start_date
         ROWS UNBOUNDED PRECEDING
       ) AS first_term
  FROM loan_management.loans;
-- 7. First interest_rate per borrower.
SELECT loan_id, borrower_id, interest_rate,
       FIRST_VALUE(interest_rate) OVER (
         PARTITION BY borrower_id
         ORDER BY start_date
         ROWS UNBOUNDED PRECEDING
       ) AS first_rate
  FROM loan_management.loans;
-- 8. First borrower_id for payments.
SELECT payment_id, loan_id,
       FIRST_VALUE(loan_id) OVER (
         ORDER BY payment_date
         ROWS UNBOUNDED PRECEDING
       ) AS first_loan_id
  FROM loan_management.loan_payments;
-- 9. First payment_id per loan.
SELECT payment_id, loan_id,
       FIRST_VALUE(payment_id) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
         ROWS UNBOUNDED PRECEDING
       ) AS first_pay_id
  FROM loan_management.loan_payments;
-- 10. First borrower full_name per borrower_id.
SELECT borrower_id, full_name,
       FIRST_VALUE(full_name) OVER (
         PARTITION BY borrower_id
         ORDER BY date_of_birth
         ROWS UNBOUNDED PRECEDING
       ) AS first_name
  FROM loan_management.borrowers;
```

## LAST_VALUE()
```sql
-- 1. Last payment date per loan.
SELECT payment_id, loan_id, payment_date,
       LAST_VALUE(payment_date) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS last_payment_date
  FROM loan_management.loan_payments;
-- 2. Last payment amount per loan.
SELECT payment_id, loan_id, amount,
       LAST_VALUE(amount) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS last_amount
  FROM loan_management.loan_payments;
-- 3. Last loan start_date per borrower.
SELECT loan_id, borrower_id, start_date,
       LAST_VALUE(start_date) OVER (
         PARTITION BY borrower_id
         ORDER BY start_date
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS last_loan_date
  FROM loan_management.loans;
-- 4. Last principal_component per loan.
SELECT payment_id, loan_id, principal_component,
       LAST_VALUE(principal_component) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS last_principal_comp
  FROM loan_management.loan_payments;
-- 5. Last interest_component per loan.
SELECT payment_id, loan_id, interest_component,
       LAST_VALUE(interest_component) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS last_interest_comp
  FROM loan_management.loan_payments;
-- 6. Last term_months per borrower.
SELECT loan_id, borrower_id, term_months,
       LAST_VALUE(term_months) OVER (
         PARTITION BY borrower_id
         ORDER BY start_date
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS last_term
  FROM loan_management.loans;
-- 7. Last interest_rate per borrower.
SELECT loan_id, borrower_id, interest_rate,
       LAST_VALUE(interest_rate) OVER (
         PARTITION BY borrower_id
         ORDER BY start_date
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS last_rate
  FROM loan_management.loans;
-- 8. Last payment_id per loan.
SELECT payment_id, loan_id,
       LAST_VALUE(payment_id) OVER (
         PARTITION BY loan_id
         ORDER BY payment_date
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS last_pay_id
  FROM loan_management.loan_payments;
-- 9. Last borrower full_name per borrower_id.
SELECT borrower_id, full_name,
       LAST_VALUE(full_name) OVER (
         PARTITION BY borrower_id
         ORDER BY date_of_birth
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS last_name
  FROM loan_management.borrowers;
-- 10. Last loan_id per borrower.
SELECT borrower_id, loan_id,
       LAST_VALUE(loan_id) OVER (
         PARTITION BY borrower_id
         ORDER BY start_date
         ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
       ) AS last_loan_id
  FROM loan_management.loans;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
