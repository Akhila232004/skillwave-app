![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins Assignments

## Inner Join
1. Borrower names with their loan types.
2. Borrower names, loan start dates and terms.
3. Loan IDs with payment dates and amounts.
4. Borrower names, payment dates and payment amounts.
5. Closed loans with borrower names.
6. Loans with any payment > 1000.
7. Borrower contact info with loan details.
8. Loans and their interest rates alongside borrower address.
9. Payments and corresponding borrower names.
10. Loans with principal and count of payments (join only).

## Left Join (Left Outer Join)
1. All borrowers and their loans (if any).
2. All loans with borrower names (including unlinked loans).
3. All borrowers with their payment dates (if any).
4. All loans with payment amounts (if any).
5. All borrowers with loan types (if any).
6. All borrowers with principal amounts of their loans (if any).
7. All loans with interest components of payments (if any).
8. All borrowers with loan start dates (if any).
9. All payments with loan types (if any).
10. All borrowers with payment amounts (if any).

## Right Join (Right Outer Join)
1. All loans and borrower names (including missing borrowers).
2. All payments and loan details (including payments without loans).
3. All loans and payment dates (including loans without payments).
4. All loans and borrower addresses (including orphaned loans).
5. All payments and borrower names via loans.
6. All loans and principal_component of payments.
7. All loans and status of loans, showing loans even if no borrower.
8. All payments and interest rates of their loans.
9. All loans and payment amounts (including loans with no payments).
10. All loans and borrower IDs (including loans without borrowers).

## Full Join (Full Outer Join)
1. All borrowers and loans (including unmatched).
2. All loans and payments (including unmatched).
3. All borrowers and payments via loans.
4. All loans with borrower addresses (including unmatched).
5. All payments and borrower contact info via loans.
6. All borrowers and total payment amounts (showing nulls).
7. All loans and loan types with unmatched.
8. All loans and principal_component (including unmatched).
9. All borrowers and start dates of loans.
10. All payments and interest_component of payments.

## Cross Join
1. Every borrower with every loan type.
2. Every borrower with every payment date.
3. Every loan with every payment amount.
4. Every borrower with every loan status.
5. Every borrower with every principal amount.
6. Every loan with every interest_component.
7. Every borrower with every term_months.
8. Every loan with every contact_info.
9. Every payment with every loan start_date.
10. Every borrower with every payment principal_component.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
