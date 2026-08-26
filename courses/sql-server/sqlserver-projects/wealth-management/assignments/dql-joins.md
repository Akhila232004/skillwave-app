![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins Assignments

## Inner Join
1. List clients with their accounts.
2. List portfolios with owner names.
3. List transactions with client info.
4. List assets in portfolios.
5. List goals with client email.
6. List portfolio assets with asset and portfolio names.
7. Accounts and their transaction counts.
8. Clients and their goal progress.
9. Accounts linked to portfolios via client.
10. Clients who made withdrawals.

## Left Join (Left Outer Join)
1. All clients and any accounts.
2. Portfolios and asset counts (NULLs allowed).
3. Accounts and transaction counts (zero if none).
4. Clients and goal counts.
5. Assets and portfolio membership count.
6. Clients and last transaction date.
7. Portfolios and owner emails.
8. Goals and client names.
9. Portfolios and total asset quantity.
10. Accounts and max transaction amount.

## Right Join (Right Outer Join)
1. All accounts and any clients.
2. All assets and their portfolio entries.
3. All portfolios and any clients.
4. All transactions and any accounts.
5. All goals and any clients.
6. Assets and portfolios via RIGHT JOIN (inverse of left join).
7. Transactions and deposits count per account.
8. Portfolios and transaction link via accounts.
9. Clients and held assets via portfolios.
10. Goals and transactions via client-account relationship.

## Full Join (Full Outer Join)
1. All clients and all accounts.
2. All portfolios and all portfolio_assets.
3. All assets and all portfolio entries.
4. All accounts and all transactions.
5. All clients and all financial goals.
6. All portfolios and all clients.
7. All accounts and all portfolios via client.
8. All transactions and all goals via client-account.
9. All assets and all transactions via portfolio_assets→accounts.
10. All goals and all portfolio_assets via client→portfolio→assets.

## Cross Join
1. Pair each client with each account type.
2. Pair each portfolio with each asset type.
3. Pair clients and goal names.
4. Pair accounts and transaction types.
5. Pair portfolios and account types.
6. Pair assets and clients.
7. Pair portfolio_assets with goal statuses.
8. Pair clients and target amounts.
9. Pair transactions and portfolios.
10. Pair accounts and portfolios.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
