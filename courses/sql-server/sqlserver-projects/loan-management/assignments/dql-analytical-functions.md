![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments

## Aggregate Functions
1. Count loans per borrower (window).
2. Sum of payments per loan (window).
3. Average payment amount per loan (window).
4. Max payment amount per loan (window).
5. Min payment date per loan (window).
6. Cumulative principal per loan ordered by payment_date.
7. Running total of interest_component over all payments.
8. Count of payments per borrower using join (window).
9. Average term_months by loan_type (window).
10. Rolling 3-payment average amount per loan.

## ROW_NUMBER()
1. Sequence of payments per loan.
2. Rank loans by principal per borrower.
3. Row number of borrowers by age.
4. Global payment sequence across all loans.
5. Loan sequence by start_date.
6. Row number within birth decade.
7. Alphabetical row number of loan types.
8. Row number of payments by amount descending.
9. Row number of interest_component per loan.
10. Row number of interest_rate per loan_type.

## RANK()
1. Rank loans by principal descending.
2. Rank payments by amount within each loan.
3. Rank borrowers by oldest age.
4. Rank loans by term_months within loan_type.
5. Rank payments by interest_component descending.
6. Rank borrowers by number of loans.
7. Rank loan types by average principal.
8. Rank payments by date per loan.
9. Rank loans by interest_rate.
10. Rank borrowers by earliest loan start.

## DENSE_RANK()
1. Dense rank loans by principal.
2. Dense rank payments by amount per loan.
3. Dense rank borrowers by age.
4. Dense rank loans by term within type.
5. Dense rank payments by interest_component.
6. Dense rank borrowers by loan count.
7. Dense rank loan types by avg principal.
8. Dense rank payments by date per loan.
9. Dense rank loans by interest_rate.
10. Dense rank borrowers by first loan date.

## NTILE(n)
1. Quartiles of loans by principal.
2. Tertiles of payments by amount.
3. Deciles of interest_rate.
4. Quartiles of term_months.
5. Quartiles of payments per loan.
6. Quartiles of payments per borrower.
7. Quintiles of loan start_date.
8. Quartiles of interest_component.
9. Quartiles of principal_component.
10. Quintiles of loan_count per borrower.

## LAG()
1. Previous payment amount per loan.
2. Previous payment date per loan.
3. Previous interest_component per loan.
4. Previous principal_component per loan.
5. Previous loan principal by borrower.
6. Previous term_months by borrower.
7. Previous interest_rate by borrower.
8. Previous borrower_id for each payment.
9. Two payments ago amount per loan.
10. Previous start_date per borrower.

## LEAD()
1. Next payment amount per loan.
2. Next payment date per loan.
3. Next interest_component per loan.
4. Next principal_component per loan.
5. Next loan principal by borrower.
6. Next term_months by borrower.
7. Next interest_rate by borrower.
8. Next borrower_id for each payment.
9. Two payments ahead amount per loan.
10. Next start_date per borrower.

## FIRST_VALUE()
1. First payment date per loan.
2. First payment amount per loan.
3. First loan start_date per borrower.
4. First principal_component per loan.
5. First interest_component per loan.
6. First term_months per borrower.
7. First interest_rate per borrower.
8. First borrower_id for payments.
9. First payment_id per loan.
10. First borrower full_name per borrower_id.

## LAST_VALUE()
1. Last payment date per loan.
2. Last payment amount per loan.
3. Last loan start_date per borrower.
4. Last principal_component per loan.
5. Last interest_component per loan.
6. Last term_months per borrower.
7. Last interest_rate per borrower.
8. Last payment_id per loan.
9. Last borrower full_name per borrower_id.
10. Last loan_id per borrower.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
