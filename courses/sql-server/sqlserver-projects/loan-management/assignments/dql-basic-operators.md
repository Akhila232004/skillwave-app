![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Basic Operators Assignments

## Equality Operator (=)
1. Find loans where status = 'Closed'.
2. List borrowers with full_name = 'Alice Johnson'.
3. Get payments where amount = 458.34.
4. Retrieve loans where loan_type = 'Personal'.
5. Retrieve borrowers where date_of_birth = '1990-09-05'.
6. Get loans where term_months = 60.
7. Find payments where principal_component = 416.67.
8. List loans where interest_rate = 0.050.
9. Retrieve borrower with borrower_id = 5.
10. Get payments where interest_component = 66.67.

## Inequality Operator (<>)
1. Find loans where status <> 'Active'.
2. List borrowers with full_name <> 'Bob Smith'.
3. Retrieve loans where loan_type <> 'Mortgage'.
4. Get payments where amount <> 612.50.
5. Find loans where term_months <> 48.
6. List borrowers where date_of_birth <> '1985-04-12'.
7. Retrieve payments where interest_component <> 41.67.
8. Find loans where interest_rate <> 0.045.
9. List borrowers where borrower_id <> 10.
10. Get payments where principal_component <> 166.67.

## IN Operator
1. Retrieve loans where status IN ('Active', 'Closed').
2. Find loans where loan_type IN ('Personal', 'Auto').
3. List borrowers with borrower_id IN (1,2,3).
4. Get payments where payment_id IN (1,2,3).
5. Retrieve loans where term_months IN (12,24,36).
6. Find borrowers where date_of_birth IN ('1985-04-12','1992-06-15').
7. List loans where interest_rate IN (0.035,0.045).
8. Get payments where amount IN (458.34,612.50).
9. Retrieve loans where loan_id IN (4,7,10).
10. Find payments where principal_component IN (520.83,833.33).

## NOT IN Operator
1. Retrieve loans where status NOT IN ('Closed').
2. List borrowers with borrower_id NOT IN (1,5,9).
3. Find loans where loan_type NOT IN ('Business','Mortgage').
4. Get payments where payment_id NOT IN (1,5,10).
5. Retrieve loans where term_months NOT IN (120,360).
6. List borrowers where full_name NOT IN ('Carol Williams','David Brown').
7. Find loans where interest_rate NOT IN (0.050,0.058).
8. Get payments where amount NOT IN (1736.11,1404.17).
9. Retrieve loans where loan_id NOT IN (2,8,12).
10. Find payments where principal_component NOT IN (416.67,1041.67).

## LIKE Operator
1. Find borrowers where full_name LIKE 'A%'.
2. Retrieve borrowers where address LIKE '%St%'.
3. Find loans where loan_type LIKE '%o%'.
4. List loans where status LIKE '_ctive'.
5. Retrieve payments where CONVERT(VARCHAR(10),payment_date,120) LIKE '2023-%'.
6. Find borrowers where contact_info LIKE '%@example.com'.
7. List loans where loan_type LIKE '%ness'.
8. Retrieve borrowers where full_name LIKE '%son'.
9. Find payments where CAST(amount AS VARCHAR(12)) LIKE '4%'.
10. List loans where CAST(principal AS VARCHAR(12)) LIKE '%000'.

## NOT LIKE Operator
1. Find borrowers where address NOT LIKE '%Ave%'.
2. Retrieve loans where loan_type NOT LIKE 'S%'.
3. Find borrowers where full_name NOT LIKE '%son'.
4. List loans where status NOT LIKE 'A%'.
5. Retrieve payments where CONVERT(VARCHAR(10),payment_date,120) NOT LIKE '2021-%'.
6. Find borrowers where contact_info NOT LIKE '%brookside%'.
7. List loans where loan_type NOT LIKE '%tude%'.
8. Retrieve borrowers where address NOT LIKE '%Rd%'.
9. Find payments where CAST(amount AS VARCHAR(12)) NOT LIKE '1%'.
10. List loans where CAST(interest_rate AS VARCHAR(6)) NOT LIKE '0.0%'.

## BETWEEN Operator
1. Find loans with principal BETWEEN 10000 AND 50000.
2. Retrieve payments where payment_date BETWEEN '2023-01-01' AND '2023-12-31'.
3. List loans where term_months BETWEEN 12 AND 48.
4. Get payments where amount BETWEEN 200 AND 1000.
5. Find loans where interest_rate BETWEEN 0.04 AND 0.06.
6. Retrieve borrowers where date_of_birth BETWEEN '1980-01-01' AND '1990-12-31'.
7. List loan_payments where interest_component BETWEEN 50 AND 200.
8. Retrieve loans where start_date BETWEEN '2022-01-01' AND '2024-12-31'.
9. Find borrowers where borrower_id BETWEEN 5 AND 15.
10. List loans where loan_id BETWEEN 3 AND 8.

## Greater Than (>)
1. Find loans with principal > 50000.
2. Retrieve payments where amount > 1000.
3. List loans where term_months > 60.
4. Get loans where interest_rate > 0.05.
5. Find borrowers where borrower_id > 10.
6. Retrieve loan_payments where interest_component > 100.
7. List loans where start_date > '2023-01-01'.
8. Find borrowers where date_of_birth > '1990-01-01'.
9. Retrieve payments where principal_component > 500.
10. List loans where loan_id > 5.

## Greater Than or Equal To (>=)
1. Find loans with principal >= 50000.
2. Retrieve payments where amount >= 1000.
3. List loans where term_months >= 48.
4. Get loans where interest_rate >= 0.05.
5. Find borrowers where borrower_id >= 5.
6. Retrieve loan_payments where interest_component >= 41.67.
7. List loans where start_date >= '2022-06-01'.
8. Find borrowers where date_of_birth >= '1990-01-01'.
9. Retrieve payments where principal_component >= 41667.
10. List loans where loan_id >= 10.

## Less Than (<)
1. Find loans with principal < 20000.
2. Retrieve payments where amount < 500.
3. List loans where term_months < 24.
4. Get loans where interest_rate < 0.045.
5. Find borrowers where borrower_id < 5.
6. Retrieve loan_payments where interest_component < 50.
7. List loans where start_date < '2022-01-01'.
8. Find borrowers where date_of_birth < '1985-01-01'.
9. Retrieve payments where principal_component < 200.
10. List loans where loan_id < 5.

## Less Than or Equal To (<=)
1. Find loans with principal <= 20000.
2. Retrieve payments where amount <= 458.34.
3. List loans where term_months <= 36.
4. Get loans where interest_rate <= 0.045.
5. Find borrowers where borrower_id <= 3.
6. Retrieve loan_payments where interest_component <= 66.67.
7. List loans where start_date <= '2023-01-15'.
8. Find borrowers where date_of_birth <= '1990-01-01'.
9. Retrieve payments where principal_component <= 416.67.
10. List loans where loan_id <= 8.

## EXISTS Operator
1. List borrowers who have at least one loan.
2. Find loans that have any payments.
3. Retrieve loans where there exists a payment with amount > 1000.
4. List borrowers where there exists a loan with principal > 50000.
5. Find loans with payments on '2023-08-01'.
6. Retrieve borrowers with at least one closed loan.
7. List loans where there exists a payment with interest_component < 100.
8. Find borrowers with loans longer than 60 months.
9. Retrieve loans with a principal exactly 15000 if any payment exists.
10. List borrowers with at least one loan starting in 2024.

## NOT EXISTS Operator
1. List borrowers who have no loans.
2. Find loans without any payments.
3. Retrieve borrowers with no closed loans.
4. List loans where there is no payment greater than 1000.
5. Find borrowers without any 'Business' loans.
6. Retrieve loans with no payments on '2021-01-01'.
7. List borrowers with no active loans.
8. Find loans with no payments having interest_component < 50.
9. Retrieve borrowers with no loans longer than 120 months.
10. List loans that have no payment where principal_component = 833.33.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
