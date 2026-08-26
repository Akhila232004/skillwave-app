![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Set Operations Assignments

## Union
1. Combine loan principal amounts with payment amounts.
2. Union borrower IDs from borrowers and loans.
3. Combine loan IDs and payment IDs into one list.
4. Union loan types and loan statuses.
5. Combine payment dates and loan start dates.
6. Union borrower names and loan types.
7. Union borrower IDs from loans and from payments (via join).
8. Union principal_component and interest_component values.
9. Union max and min principal per borrower.
10. Union average payment amount and average principal_component per loan.

## Intersect
1. Borrower IDs present in both borrowers and loans.
2. Loan IDs present in loans and loan_payments.
3. Dates that appear as both start_date and payment_date.
4. Principal amounts matching any payment amount.
5. Loan types that also appear as statuses.
6. Common values between principal_component and interest_component.
7. Even loan IDs that have payments.
8. Borrowers with more than one loan who are valid borrowers.
9. Loan types common to loans started in 2022 and 2023.
10. Borrowers having both Personal and Auto loans.

## Except
1. Borrowers who have no loans.
2. Loans that have never received a payment.
3. Principal values not matched by any payment amount.
4. Loan types that are not used as statuses.
5. Payment dates that are not loan start dates.
6. Loan types before 2023 excluding those already closed.
7. Borrowers with more than one loan except those with more than two.
8. Mortgage loans that are not active.
9. Borrowers with loans >20,000 principal except those >50,000.
10. Payments excluding those with interest_component < 50.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
