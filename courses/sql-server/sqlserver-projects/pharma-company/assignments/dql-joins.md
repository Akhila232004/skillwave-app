![SQL Server Tinitiate Image](../../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](./README.md)

# DQL - Joins Assignments

## Inner Join
1. Customer with mailing city/state (Customer ↔ Address)
2. Supplier contact and city (Supplier ↔ Address)
3. Distribution centers with city/state (DC ↔ Address)
4. Sales orders with customer name (SalesOrder ↔ Customer)
5. Shipments with center & customer names (Shipment ↔ DC ↔ Customer)
6. Batches with product info (ManufacturingBatch ↔ Product)
7. QC results with batch & product (QCResult ↔ Batch ↔ Product)
8. Formulation lines with product & raw material (Formulation ↔ Product ↔ RawMaterial)
9. Inventory snapshot with product & center names (Inventory ↔ Product ↔ DC)
10. Regulatory submissions with product info (RegSubmission ↔ Product)
11. Raw materials with their supplier name (RawMaterial ↔ Supplier)
12. Quality tests executed per batch (QCResult ↔ QualityTest)

## Left Join (Left Outer Join)
1. All customers and their mailing city (null if no address)
2. All suppliers and their address (allowing missing AddressID)
3. All distribution centers with city (including centers without address)
4. All products with any regulatory submission (nulls for no submission)
5. All products with last inventory on 2025-07-31 (may be null)
6. All batches with QC results (show nulls if none)
7. All customers with July-2025 orders (nulls if none)
8. All centers with shipments on 2025-07-31 (nulls if none that day)
9. All products and their formulation lines (null if none)
10. All equipment with location's address city (equipment has only Location text; demo null join)
11. All suppliers with any raw materials supplied
12. All quality tests with July-2025 execution examples

## Right Join (Right Outer Join)
1. Orders (preserved) with customer names (null if missing customer)
2. Shipments (preserved) with center names
3. Shipments (preserved) with customer names
4. Inventory (preserved) with product names
5. QC results (preserved) with test names
6. Batches (preserved) with product names
7. Formulation (preserved) with product names
8. Raw materials (preserved) with supplier names
9. DCs' addresses (addresses preserved) – demo: show any addresses linked to DCs
10. Customers' addresses (addresses preserved)

## Full Join (Full Outer Join)
1. All cities used by customers or suppliers with who uses them
2. Days with orders or shipments (all days, marked)
3. Products that appear in batches or inventory on 2025-07-31
4. Customers who ordered or received shipments in July-2025
5. Centers with inventory on 2025-07-31 or shipments the same day
6. QC tests that passed or failed in July-2025
7. Products with regulatory submissions or batches
8. Addresses used by either customers or suppliers (one list)
9. Days with QC tests or inventory snapshots (all unique dates)
10. Suppliers or raw materials having associations
11. Centers or equipment locations (textual match demo; yields mostly nulls)
12. Products appearing in inventory last 5 days of July or having July batches

## Cross Join
1. Generate a small calendar for last 5 days of July (derived list) × a sample product set
2. Cartesian of 3 agencies × 3 statuses (reference lists)
3. Prototype daily center-product grid (TOP to limit)
4. Price tiers × strength variants (synthetic lists)
5. QA matrix: subset of tests × subset of products
6. Shipment planning slots: 3 time windows × 5 centers
7. Batch QC run schedule seeds: 2 offset days × 5 batches
8. Label templates: 4 locales × 5 products
9. Demand scenarios: 3 multipliers × 5 customers' July totals
10. Inventory drain tests: 3 daily decrements × 5 product-center pairs

##### [Back To Contents](./README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
