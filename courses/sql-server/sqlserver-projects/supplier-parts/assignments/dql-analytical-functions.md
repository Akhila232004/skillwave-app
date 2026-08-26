![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Analytical Functions Assignments

## Aggregate Functions
1. Show part count per supplier alongside each part.
2. Show average unit_price across all parts.
3. Show total value of parts per supplier.
4. Show min and max price across all parts.
5. Show running total of prices ordered by part_id.
6. Show cumulative average price ordered by part_id.
7. Show each part’s percentage of total inventory value.
8. Show difference between each part’s price and its supplier’s average price.
9. Show for each part the max price within its supplier.
10. Show for each part the count of parts priced above it.

## ROW_NUMBER()
1. Assign a global row number to parts by price ascending.
2. Assign row numbers per supplier by descending price.
3. Assign row numbers to suppliers by name.
4. Assign row numbers per first-letter-of-part partition.
5. Assign row numbers per price range partition.
6. Assign row numbers per supplier ordered by part_id.
7. Assign row numbers to suppliers with email sorted by email.
8. Assign row numbers per city extracted from address.
9. Assign row numbers per descending description length.
10. Assign row numbers to parts by part_name ascending.

## RANK()
1. Rank parts by price descending.
2. Rank parts per supplier by price.
3. Rank suppliers by name.
4. Rank parts by description length ascending.
5. Rank parts by unit_price, with ties.
6. Rank suppliers by number of parts.
7. Rank parts per price range partition.
8. Rank suppliers by address alphabetically.
9. Rank parts per first-letter-of-name.
10. Rank parts by unit_price descending showing gaps.

## DENSE_RANK()
1. Dense rank parts by price descending.
2. Dense rank per supplier by price.
3. Dense rank suppliers by name.
4. Dense rank parts by description length.
5. Dense rank parts by price with no gaps.
6. Dense rank parts per price range.
7. Dense rank suppliers by contact_name.
8. Dense rank parts per first-letter partition.
9. Dense rank parts by unit_price descending.
10. Dense rank suppliers by phone_number.

## NTILE(n)
1. Divide parts into 4 quartiles by price.
2. Divide parts into 3 groups by price.
3. Divide parts per supplier into 2 halves by price.
4. Divide suppliers into 4 groups by name.
5. Divide parts into 5 groups by description length.
6. Divide parts into 10 groups by part_id.
7. Divide parts per price range into 4 tiles.
8. Divide suppliers into 2 groups by email presence.
9. Divide parts into 3 groups by supplier count size.
10. Divide parts into 4 groups by unit_price descending.

## LAG()
1. Show previous part’s price ordered by part_id.
2. Show previous part name and price.
3. Show previous price within each supplier.
4. Show two rows back price.
5. Show previous part_id within supplier.
6. Show previous supplier’s name ordered by supplier_id.
7. Show previous description within each supplier.
8. Show previous unit_price, default 0 if none.
9. Show previous contact_email for suppliers.
10. Show previous price when price >5.

## LEAD()
1. Show next part’s price ordered by part_id.
2. Show next part name.
3. Show next price within each supplier.
4. Show two rows ahead part_name.
5. Show next part_id within supplier.
6. Show next supplier_name.
7. Show next description per supplier.
8. Show next unit_price, default NULL.
9. Show next contact_email.
10. Show next high-priced part’s price.

## FIRST_VALUE()
1. Show first part price overall.
2. Show first part_name per supplier.
3. Show first supplier_name overall.
4. Show first price in each price range.
5. Show first contact_email ordered by supplier_name.
6. Show first part_description per supplier.
7. Show first high-priced part overall.
8. Show first supplier_address overall.
9. Show first part_id per supplier.
10. Show first unit_price per description length group.

## LAST_VALUE()
1. Show last part price overall.
2. Show last part_name per supplier.
3. Show last supplier_name overall.
4. Show last price in each price range.
5. Show last contact_email ordered by supplier_name.
6. Show last part_description per supplier.
7. Show last high-priced part overall.
8. Show last supplier_address overall.
9. Show last part_id per supplier.
10. Show last unit_price per description length group.

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
