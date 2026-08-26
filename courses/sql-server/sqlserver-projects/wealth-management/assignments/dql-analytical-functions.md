![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments

## Aggregate Functions
1. Running total of transaction amounts per account.
2. Total portfolios per client.
3. Total assets quantity per portfolio.
4. Cumulative goal progress per client by target_date.
5. Average transaction amount per account.
6. Maximum single transaction per account.
7. Minimum single transaction per account.
8. Average acquisition_price per asset across all portfolios.
9. Moving sum of last 5 transactions globally (by date).
10. Count of goals per status.

## ROW_NUMBER()
1. Sequential number of transactions per account by date.
2. Order portfolios per client by creation date.
3. Number assets per portfolio by acquisition_date.
4. Rank client goals by target_date.
5. Number accounts per client by opened_date.
6. Order clients by join_date.
7. Number assets by symbol alphabetically.
8. Order transactions per client across accounts.
9. Number portfolio_assets by price descending.
10. Order goals per client by current_amount desc.

## RANK()
1. Rank accounts per client by total transaction amount desc.
2. Rank portfolios per client by total asset quantity.
3. Rank clients by total current goal amount.
4. Rank assets by number of portfolios held.
5. Rank goals per client by progress percentage.
6. Rank transactions by amount desc globally.
7. Rank accounts by number of transactions.
8. Rank clients by number of accounts.
9. Rank portfolios by creation date (older = better).
10. Rank assets by symbol.

## DENSE_RANK()
1. Rank accounts per client by total transaction amount desc.
2. Rank portfolios per client by total asset quantity.
3. Rank clients by total current goal amount.
4. Rank assets by number of portfolios held.
5. Rank goals per client by progress percentage.
6. Rank transactions by amount desc globally.
7. Rank accounts by number of transactions.
8. Rank clients by number of accounts.
9. Rank portfolios by creation date (older = better).
10. Rank assets by symbol.

## NTILE(n)
1. Divide clients into 4 quartiles by total_current_amount.
2. Quartile of accounts by total transaction amount.
3. Quartile of portfolios by total asset quantity.
4. Quartile of assets by number of portfolios.
5. Quartile of transactions by amount.
6. Quartile of goals by target_amount.
7. Quartile of portfolios by creation date.
8. Quartile of accounts by opened_date.
9. Quartile of assets by asset_id.
10. Quartile of clients by join_date.

## LAG()
1. Previous transaction amount per account.
2. Previous transaction date per account.
3. Previous goal current_amount per client.
4. Previous acquisition_price per portfolio.
5. Previous opened_date per client.
6. Previous creation date per client’s portfolios.
7. Previous symbol per alphabetic asset list.
8. Previous phone value per client.
9. Previous target_amount per client.
10. Previous quantity per asset across all portfolios.

## LEAD()
1. Next transaction amount per account.
2. Next transaction date per account.
3. Next goal target_date per client.
4. Next acquisition_price per portfolio.
5. Next account opened_date per client.
6. Next portfolio creation date per client.
7. Next symbol per alphabetic asset list.
8. Next phone per client by join_date.
9. Next current_amount per client.
10. Next quantity per asset.

## FIRST_VALUE()
1. First transaction amount per account.
2. First opened_date per client.
3. First goal target_date per client.
4. First portfolio creation date per client.
5. First acquisition_date per portfolio.
6. First client join_date.
7. First asset symbol alphabetically.
8. First current_amount per client.
9. First transaction date globally.
10. First quantity per asset across portfolios.

## LAST_VALUE()
1. Last transaction amount per account.
2. Last opened_date per client.
3. Last goal target_date per client.
4. Last portfolio creation date per client.
5. Last acquisition_date per portfolio.
6. Latest client join_date.
7. Last asset symbol alphabetically.
8. Last current_amount per client.
9. Last transaction date globally.
10. Last quantity per asset across portfolios.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
