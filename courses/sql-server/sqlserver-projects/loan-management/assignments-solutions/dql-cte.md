![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Common Table Expressions (CTEs) Assignments Solutions

## CTE
```sql
-- 1. Use a CTE to list loans with principal > 20000.
WITH HighLoans AS (
  SELECT * FROM loan_management.loans
  WHERE principal > 20000
)
SELECT * FROM HighLoans;

-- 2. Use a CTE to compute total payments per loan.
WITH PaymentTotals AS (
  SELECT loan_id, SUM(amount) AS total_paid
    FROM loan_management.loan_payments
   GROUP BY loan_id
)
SELECT * FROM PaymentTotals;

-- 3. Use a CTE to find average payment per loan.
WITH AvgPayments AS (
  SELECT loan_id, AVG(amount) AS avg_payment
    FROM loan_management.loan_payments
   GROUP BY loan_id
)
SELECT * FROM AvgPayments;

-- 4. Use a CTE to list active loans with borrower names.
WITH ActiveLoans AS (
  SELECT l.loan_id, l.principal, l.status, b.full_name
    FROM loan_management.loans AS l
    JOIN loan_management.borrowers AS b
      ON l.borrower_id = b.borrower_id
   WHERE l.status = 'Active'
)
SELECT * FROM ActiveLoans;

-- 5. Use a CTE to compute loan duration in days.
WITH LoanDurations AS (
  SELECT loan_id,
         DATEDIFF(day, start_date, DATEADD(month, term_months, start_date)) AS duration_days
    FROM loan_management.loans
)
SELECT * FROM LoanDurations;

-- 6. Use a CTE to find borrowers with more than one loan.
WITH LoanCounts AS (
  SELECT borrower_id, COUNT(*) AS cnt
    FROM loan_management.loans
   GROUP BY borrower_id
)
SELECT b.borrower_id, b.full_name, lc.cnt
  FROM loan_management.borrowers AS b
  JOIN LoanCounts AS lc
    ON b.borrower_id = lc.borrower_id
 WHERE lc.cnt > 1;

-- 7. Use a CTE to list loans started this year.
WITH ThisYearLoans AS (
  SELECT * FROM loan_management.loans
   WHERE YEAR(start_date) = YEAR(GETDATE())
)
SELECT * FROM ThisYearLoans;

-- 8. Use a CTE to find late payments (payment_date > loan end date).
WITH LatePayments AS (
  SELECT p.payment_id, p.loan_id, p.payment_date,
         DATEADD(month, l.term_months, l.start_date) AS loan_end
    FROM loan_management.loan_payments AS p
    JOIN loan_management.loans AS l
      ON p.loan_id = l.loan_id
)
SELECT payment_id, loan_id, payment_date
  FROM LatePayments
 WHERE payment_date > loan_end;

-- 9. Use a CTE to find high‐interest loans (>5%).
WITH HighRateLoans AS (
  SELECT * FROM loan_management.loans
   WHERE interest_rate > 0.05
)
SELECT * FROM HighRateLoans;

-- 10. Use a CTE to list payments with principal ratio.
WITH PaymentRatio AS (
  SELECT payment_id, loan_id, amount,
         principal_component * 1.0 / amount AS principal_ratio
    FROM loan_management.loan_payments
)
SELECT * FROM PaymentRatio;
```

## Using Multiple CTEs
```sql
-- 1. Loan summary and payment summary joined.
WITH LoanSummary AS (
  SELECT loan_id, principal, interest_rate, term_months
    FROM loan_management.loans
),
PaymentSummary AS (
  SELECT loan_id, COUNT(*) AS num_payments, SUM(amount) AS total_paid
    FROM loan_management.loan_payments
   GROUP BY loan_id
)
SELECT ls.*, ps.num_payments, ps.total_paid
  FROM LoanSummary AS ls
  LEFT JOIN PaymentSummary AS ps
    ON ls.loan_id = ps.loan_id;

-- 2. Loans in 2023 and payments in 2023.
WITH Loans2023 AS (
  SELECT * FROM loan_management.loans
   WHERE YEAR(start_date) = 2023
),
Pays2023 AS (
  SELECT * FROM loan_management.loan_payments
   WHERE YEAR(payment_date) = 2023
)
SELECT l.loan_id, l.borrower_id, p.payment_id, p.amount
  FROM Loans2023 AS l
  JOIN Pays2023 AS p
    ON l.loan_id = p.loan_id;

-- 3. Borrower loan counts and payment counts.
WITH BorrowerLoans AS (
  SELECT borrower_id, COUNT(*) AS loan_count
    FROM loan_management.loans
   GROUP BY borrower_id
),
BorrowerPayments AS (
  SELECT l.borrower_id, COUNT(*) AS pay_count
    FROM loan_management.loan_payments AS p
    JOIN loan_management.loans      AS l ON p.loan_id = l.loan_id
   GROUP BY l.borrower_id
)
SELECT bl.borrower_id, b.full_name, bl.loan_count, bp.pay_count
  FROM BorrowerLoans AS bl
  JOIN loan_management.borrowers AS b ON bl.borrower_id = b.borrower_id
  LEFT JOIN BorrowerPayments    AS bp ON bl.borrower_id = bp.borrower_id;

-- 4. Monthly payment sums and interest sums.
WITH MonthlyPays AS (
  SELECT YEAR(payment_date) AS yr,
         MONTH(payment_date) AS mo,
         SUM(amount) AS total_amt
    FROM loan_management.loan_payments
   GROUP BY YEAR(payment_date), MONTH(payment_date)
),
MonthlyInterest AS (
  SELECT YEAR(payment_date) AS yr,
         MONTH(payment_date) AS mo,
         SUM(interest_component) AS total_int
    FROM loan_management.loan_payments
   GROUP BY YEAR(payment_date), MONTH(payment_date)
)
SELECT mp.yr, mp.mo, mp.total_amt, mi.total_int
  FROM MonthlyPays     AS mp
  LEFT JOIN MonthlyInterest AS mi
    ON mp.yr = mi.yr AND mp.mo = mi.mo;

-- 5. Active vs closed loan counts.
WITH Active AS (
  SELECT COUNT(*) AS cnt_active FROM loan_management.loans WHERE status = 'Active'
),
Closed AS (
  SELECT COUNT(*) AS cnt_closed FROM loan_management.loans WHERE status = 'Closed'
)
SELECT a.cnt_active, c.cnt_closed
  FROM Active AS a, Closed AS c;

-- 6. CTE for borrowers and CTE for their oldest loan.
WITH BorrowersCTE AS (
  SELECT borrower_id, full_name FROM loan_management.borrowers
),
OldestLoan AS (
  SELECT borrower_id, MIN(start_date) AS first_loan
    FROM loan_management.loans
   GROUP BY borrower_id
)
SELECT b.borrower_id, b.full_name, ol.first_loan
  FROM BorrowersCTE AS b
  JOIN OldestLoan   AS ol ON b.borrower_id = ol.borrower_id;

-- 7. Upcoming due loans and last payment dates.
WITH LastPayment AS (
  SELECT loan_id, MAX(payment_date) AS last_pay
    FROM loan_management.loan_payments
   GROUP BY loan_id
),
UpcomingDue AS (
  SELECT loan_id, DATEADD(month,1,last_pay) AS next_due
    FROM LastPayment
)
SELECT u.loan_id, u.next_due, l.term_months
  FROM UpcomingDue AS u
  JOIN loan_management.loans AS l ON u.loan_id = l.loan_id;

-- 8. Combine loan and borrower info.
WITH LoanInfo AS (
  SELECT loan_id, borrower_id, principal, status FROM loan_management.loans
),
BorrowerInfo AS (
  SELECT borrower_id, full_name, contact_info FROM loan_management.borrowers
)
SELECT li.loan_id, bi.full_name, bi.contact_info, li.principal, li.status
  FROM LoanInfo     AS li
  JOIN BorrowerInfo AS bi ON li.borrower_id = bi.borrower_id;

-- 9. Loans paid off vs outstanding balance.
WITH Paid AS (
  SELECT loan_id, SUM(principal_component) AS prin_paid
    FROM loan_management.loan_payments
   GROUP BY loan_id
),
Balance AS (
  SELECT l.loan_id, l.principal - p.prin_paid AS remaining
    FROM loan_management.loans   AS l
    JOIN Paid                    AS p ON l.loan_id = p.loan_id
)
SELECT * FROM Balance;

-- 10. CTE chain: borrower loan count → filter → details.
WITH LoanCount AS (
  SELECT borrower_id, COUNT(*) AS cnt_loans
    FROM loan_management.loans
   GROUP BY borrower_id
),
MultiLoaners AS (
  SELECT borrower_id FROM LoanCount WHERE cnt_loans > 1
),
Details AS (
  SELECT b.full_name, lc.cnt_loans
    FROM MultiLoaners AS m
    JOIN loan_management.borrowers AS b ON m.borrower_id = b.borrower_id
    JOIN LoanCount               AS lc ON m.borrower_id = lc.borrower_id
)
SELECT * FROM Details;
```

## Recursive CTEs
```sql
-- 1. Generate numbers 1 to 12.
WITH Numbers AS (
  SELECT 1 AS n
  UNION ALL
  SELECT n + 1 FROM Numbers WHERE n < 12
)
SELECT n FROM Numbers;

-- 2. Generate years from 2000 to current year.
WITH Bound AS (
  SELECT 2000 AS yr, YEAR(GETDATE()) AS maxYr
),
Years AS (
  SELECT yr FROM Bound
  UNION ALL
  SELECT yr + 1 FROM Years JOIN Bound ON yr + 1 <= Bound.maxYr
)
SELECT yr FROM Years;

-- 3. Monthly payment dates for loan_id = 1.
WITH PayDates AS (
  SELECT CAST(start_date AS DATE) AS pay_date,
         term_months
    FROM loan_management.loans
   WHERE loan_id = 1
  UNION ALL
  SELECT DATEADD(month,1,pay_date), term_months
    FROM PayDates
   WHERE pay_date < DATEADD(month, term_months-1, (SELECT start_date FROM loan_management.loans WHERE loan_id = 1))
)
SELECT pay_date FROM PayDates;

-- 4. Running remaining principal for loan_id = 1.
WITH RecBalance AS (
  SELECT p.payment_id, p.loan_id, p.payment_date, p.principal_component,
         (SELECT principal FROM loan_management.loans WHERE loan_id = 1) - p.principal_component AS remaining
    FROM loan_management.loan_payments p
   WHERE p.loan_id = 1 AND p.payment_date = (SELECT MIN(payment_date) FROM loan_management.loan_payments WHERE loan_id = 1)
  UNION ALL
  SELECT p.payment_id, p.loan_id, p.payment_date, p.principal_component,
         rb.remaining - p.principal_component
    FROM loan_management.loan_payments p
    JOIN RecBalance rb
      ON p.loan_id = rb.loan_id
     AND p.payment_date = DATEADD(month,1,rb.payment_date)
)
SELECT payment_id, payment_date, remaining FROM RecBalance;

-- 5. Date dimension from earliest start to latest payment.
WITH Bounds AS (
  SELECT MIN(start_date) AS minDate, MAX(payment_date) AS maxDate
    FROM loan_management.loans l
    JOIN loan_management.loan_payments p ON l.loan_id = p.loan_id
),
DateDim AS (
  SELECT minDate AS d FROM Bounds
  UNION ALL
  SELECT DATEADD(day,1,d) FROM DateDim JOIN Bounds ON DATEADD(day,1,d) <= Bounds.maxDate
)
SELECT d FROM DateDim;

-- 6. Cumulative payments for loan_id = 2.
WITH CumPay AS (
  SELECT p.payment_id, p.loan_id, p.payment_date, p.amount, p.amount AS cum_amount
    FROM loan_management.loan_payments p
   WHERE p.loan_id = 2
     AND p.payment_date = (SELECT MIN(payment_date) FROM loan_management.loan_payments WHERE loan_id = 2)
  UNION ALL
  SELECT p.payment_id, p.loan_id, p.payment_date, p.amount, cp.cum_amount + p.amount
    FROM loan_management.loan_payments p
    JOIN CumPay cp
      ON p.loan_id = cp.loan_id
     AND p.payment_date = (
           SELECT MIN(p2.payment_date)
             FROM loan_management.loan_payments p2
            WHERE p2.loan_id = p.loan_id AND p2.payment_date > cp.payment_date
         )
)
SELECT payment_id, cum_amount FROM CumPay;

-- 7. Sequence of months up to term_months for loan_id = 6.
WITH Months AS (
  SELECT 1 AS m, (SELECT term_months FROM loan_management.loans WHERE loan_id = 6) AS maxM
  UNION ALL
  SELECT m + 1, maxM FROM Months WHERE m < maxM
)
SELECT m FROM Months;

-- 8. Payment schedule for loan_id = 9 between first and last payments.
WITH PaySched AS (
  SELECT MIN(payment_date) AS pd, MAX(payment_date) AS maxPd, loan_id
    FROM loan_management.loan_payments
   WHERE loan_id = 9
   GROUP BY loan_id
  UNION ALL
  SELECT DATEADD(month,1,pd), maxPd, loan_id
    FROM PaySched
   WHERE DATEADD(month,1,pd) <= maxPd
)
SELECT pd FROM PaySched;

-- 9. Generate sequence 1 to 10.
WITH Seq AS (
  SELECT 1 AS v
  UNION ALL
  SELECT v + 1 FROM Seq WHERE v < 10
)
SELECT v FROM Seq;

-- 10. List borrower birth years using a recursive CTE.
WITH YearBounds AS (
  SELECT YEAR(MIN(date_of_birth)) AS minY, YEAR(MAX(date_of_birth)) AS maxY
    FROM loan_management.borrowers
),
BirthYears AS (
  SELECT minY AS yr FROM YearBounds
  UNION ALL
  SELECT yr + 1 FROM BirthYears JOIN YearBounds ON yr + 1 <= YearBounds.maxY
)
SELECT yr FROM BirthYears;
```

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
