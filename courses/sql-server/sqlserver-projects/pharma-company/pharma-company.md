![SQL Server Tinitiate Image](../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](../README.md)

# Pharma Company Data Model
This data model supports end-to-end pharmaceutical operations: from raw material sourcing and formulation through manufacturing, quality control, inventory management, and distribution.  
- **Address**, **Supplier**, and **RawMaterial** define lookup data for vendors and inputs.  
- **Product** and **Formulation** capture the bill-of-materials for each drug.  
- **ManufacturingBatch** records each production run, using partitioning for large-scale data.  
- **Equipment** and **QualityTest** list assets and QC procedures.  
- **QCResult** logs pass/fail outcomes per batch.  
- **DistributionCenter**, **Inventory**, and **Shipment** manage where and when product moves.  
- **Customer**, **SalesOrder**, and **RegulatorySubmission** track orders, clients, and compliance filings.

![Pharma Company ER Diagram DBeaver](pharma-company-er-diagram-dbeaver.png)

## Address Table
* **AddressID**: Surrogate key (PK).  
* **Street**, **City**, **State**, **ZIP**, **Country**: Standard address fields.

## Supplier Table
* **SupplierID**: Surrogate key (PK).  
* **Name**, **ContactName**, **Phone**, **Email**: Vendor details.  
* **AddressID**: FK → Address(AddressID).  
* **CreatedAt/By**, **UpdatedAt/By**: Audit columns.

## RawMaterial Table
* **RawMaterialID**: Surrogate key (PK).  
* **Name**, **CASNumber**: Material identifiers.  
* **SupplierID**: FK → Supplier(SupplierID).  
* **CreatedAt/By**: Audit columns.

## Product Table
* **ProductID**: Surrogate key (PK).  
* **Name**, **Strength**, **Formulation**: Drug characteristics.  
* **CreatedAt/By**, **UpdatedAt/By**: Audit columns.

## Formulation Table
* **ProductID**, **RawMaterialID**: Composite PK & FKs → Product, RawMaterial.  
* **Percentage**: % by weight/volume.  
* **CreatedAt**: Timestamp.

## ManufacturingBatch Table
* **BatchID**, **BatchDate**: Composite PK, partitioned by date.  
* **ProductID**: FK → Product(ProductID).  
* **QuantityUnits**, **Status**: Production metrics.  
* **CreatedAt/By**: Audit.  
* **IX_Batch_ProductDate**: Index for fast lookups.

## Equipment Table
* **EquipmentID**: Surrogate key (PK).  
* **Name**, **Type**, **Location**: Asset details.  
* **CreatedAt**: Timestamp.

## QualityTest Table
* **TestID**: Surrogate key (PK).  
* **Name**, **Method**: QC procedure info.  
* **CreatedAt**: Timestamp.

## QCResult Table
* **ResultID**, **TestDate**: Composite PK, partitioned by date.  
* **BatchID**: FK → ManufacturingBatch(BatchID).  
* **TestID**: FK → QualityTest(TestID).  
* **ResultValue**, **PassFail**: Outcome data.  
* **CreatedAt**: Timestamp.  
* **IX_QC_BatchDate**: Index for batch/date queries.

## DistributionCenter Table
* **CenterID**: Surrogate key (PK).  
* **Name**, **AddressID**: FK → Address(AddressID).  
* **CreatedAt**: Timestamp.

## Inventory Table
* **InventoryID**, **SnapshotDate**: Composite PK, partitioned by date.  
* **CenterID**, **ProductID**: FKs → DistributionCenter, Product.  
* **QuantityUnits**: On-hand stock.  
* **CreatedAt**: Timestamp.  
* **IX_Inv_CenterDate**: Index on center/date.

## Shipment Table
* **ShipmentID**, **ShipmentDate**: Composite PK, partitioned by date.  
* **CenterID**, **CustomerID**: FKs → DistributionCenter, Customer.  
* **QuantityUnits**: Shipped volume.  
* **CreatedAt**: Timestamp.  
* **IX_Ship_CenterDate**: Index on center/date.

## Customer Table
* **CustomerID**: Surrogate key (PK).  
* **Name**, **AddressID**: FK → Address(AddressID).  
* **CreatedAt**: Timestamp.

## SalesOrder Table
* **SalesOrderID**, **OrderDate**: Composite PK, partitioned by date.  
* **CustomerID**: FK → Customer(CustomerID).  
* **TotalUnits**, **TotalAmount**, **Status**: Order details.  
* **CreatedAt**: Timestamp.  
* **IX_SO_CustDate**: Index on customer/date.

## RegulatorySubmission Table
* **SubmissionID**: Surrogate key (PK).  
* **ProductID**: FK → Product(ProductID).  
* **SubmissionDate**, **Agency**, **Status**, **DocumentLink**: Compliance filings.  
* **CreatedAt**: Timestamp.

![Pharma Company ER Diagram Mermaid](pharma-company-er-diagram-mermaid.png)

## DDL Syntax
```sql
-- Create 'pharma_company' schema
CREATE SCHEMA pharma_company;

-- Create 'PF_PharmaYear' partition scheme
IF NOT EXISTS (SELECT 1 FROM sys.partition_functions WHERE name = 'PF_PharmaYear')
BEGIN
  EXEC('CREATE PARTITION FUNCTION PF_PharmaYear (date)
        AS RANGE RIGHT FOR VALUES (''2023-01-01'',''2024-01-01'',''2025-01-01'',''2026-01-01'',''2027-01-01'');');
END;
IF NOT EXISTS (SELECT 1 FROM sys.partition_schemes WHERE name = 'PS_PharmaYear')
BEGIN
  EXEC('CREATE PARTITION SCHEME PS_PharmaYear
        AS PARTITION PF_PharmaYear
        ALL TO ([PRIMARY]);');
END;

-- Create 'Address' table
CREATE TABLE pharma_company.Address
(
  AddressID   INT           IDENTITY(1,1),
  Street      NVARCHAR(150) NOT NULL,
  City        NVARCHAR(50)  NOT NULL,
  State       NVARCHAR(50)  NOT NULL,
  ZIP         NVARCHAR(15)  NOT NULL,
  Country     NVARCHAR(50)  NOT NULL
);
ALTER TABLE pharma_company.Address
  ADD CONSTRAINT PK_Address_AddressID
  PRIMARY KEY CLUSTERED (AddressID);

-- Create 'Supplier' table
CREATE TABLE pharma_company.Supplier
(
  SupplierID    INT           IDENTITY(1,1),
  Name          NVARCHAR(150) NOT NULL,
  ContactName   NVARCHAR(100) NULL,
  Phone         VARCHAR(20)   NULL,
  Email         VARCHAR(100)  NULL,
  AddressID     INT           NULL,
  CreatedAt     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
  CreatedBy     SYSNAME       NOT NULL DEFAULT SUSER_SNAME(),
  UpdatedAt     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
  UpdatedBy     SYSNAME       NOT NULL DEFAULT SUSER_SNAME()
);
ALTER TABLE pharma_company.Supplier
  ADD CONSTRAINT PK_Supplier_SupplierID
  PRIMARY KEY CLUSTERED (SupplierID);
ALTER TABLE pharma_company.Supplier
  ADD CONSTRAINT FK_Supplier_Address
  FOREIGN KEY (AddressID)
  REFERENCES pharma_company.Address(AddressID);

-- Create 'RawMaterial' table
CREATE TABLE pharma_company.RawMaterial
(
  RawMaterialID INT           IDENTITY(1,1),
  Name          NVARCHAR(150) NOT NULL,
  CASNumber     VARCHAR(50)   NULL,
  SupplierID    INT           NOT NULL,
  CreatedAt     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
  CreatedBy     SYSNAME       NOT NULL DEFAULT SUSER_SNAME()
);
ALTER TABLE pharma_company.RawMaterial
  ADD CONSTRAINT PK_RawMaterial_RawMaterialID
  PRIMARY KEY CLUSTERED (RawMaterialID);
ALTER TABLE pharma_company.RawMaterial
  ADD CONSTRAINT FK_RawMat_Supplier
  FOREIGN KEY (SupplierID)
  REFERENCES pharma_company.Supplier(SupplierID);

-- Create 'Product' table
CREATE TABLE pharma_company.Product
(
  ProductID     INT           IDENTITY(1,1),
  Name          NVARCHAR(200) NOT NULL,
  Strength      NVARCHAR(50)  NULL,   -- e.g. "500 mg"
  Formulation   NVARCHAR(50)  NULL,   -- e.g. "Tablet", "Capsule"
  CreatedAt     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
  CreatedBy     SYSNAME       NOT NULL DEFAULT SUSER_SNAME(),
  UpdatedAt     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
  UpdatedBy     SYSNAME       NOT NULL DEFAULT SUSER_SNAME()
);
ALTER TABLE pharma_company.Product
  ADD CONSTRAINT PK_Product_ProductID
  PRIMARY KEY CLUSTERED (ProductID);

-- Create 'Formulation' table
CREATE TABLE pharma_company.Formulation
(
  ProductID     INT           NOT NULL,
  RawMaterialID INT           NOT NULL,
  Percentage    DECIMAL(5,2)  NOT NULL,  -- % by weight/volume
  CreatedAt     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);
ALTER TABLE pharma_company.Formulation
  ADD CONSTRAINT PK_Formulation
  PRIMARY KEY CLUSTERED (ProductID, RawMaterialID);
ALTER TABLE pharma_company.Formulation
  ADD CONSTRAINT FK_Formulation_Product
  FOREIGN KEY (ProductID)
  REFERENCES pharma_company.Product(ProductID);
ALTER TABLE pharma_company.Formulation
  ADD CONSTRAINT FK_Formulation_RawMat
  FOREIGN KEY (RawMaterialID)
  REFERENCES pharma_company.RawMaterial(RawMaterialID);

-- Create 'ManufacturingBatch' table
CREATE TABLE pharma_company.ManufacturingBatch
(
  BatchID       BIGINT       NOT NULL,
  ProductID     INT           NOT NULL,
  BatchDate     DATE          NOT NULL,
  QuantityUnits INT           NOT NULL,
  Status        NVARCHAR(20)  NOT NULL,  -- e.g. "Released","Hold"
  CreatedAt     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
  CreatedBy     SYSNAME       NOT NULL DEFAULT SUSER_SNAME()
);
ALTER TABLE pharma_company.ManufacturingBatch
  ADD CONSTRAINT PK_ManufacturingBatch
  PRIMARY KEY CLUSTERED (BatchID, BatchDate)
  ON PS_PharmaYear(BatchDate);
ALTER TABLE pharma_company.ManufacturingBatch
  ADD CONSTRAINT FK_Batch_Product
  FOREIGN KEY (ProductID)
  REFERENCES pharma_company.Product(ProductID);
-- Create an index for 'ManufacturingBatch' table
CREATE INDEX IX_Batch_ProductDate
ON pharma_company.ManufacturingBatch(ProductID, BatchDate DESC);

-- Create 'Equipment' table
CREATE TABLE pharma_company.Equipment
(
  EquipmentID   INT           IDENTITY(1,1),
  Name          NVARCHAR(100) NOT NULL,
  Type          NVARCHAR(50)  NULL,  -- e.g. "Reactor", "Granulator"
  Location      NVARCHAR(100) NULL,
  CreatedAt     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);
ALTER TABLE pharma_company.Equipment
  ADD CONSTRAINT PK_Equipment_EquipmentID
  PRIMARY KEY CLUSTERED (EquipmentID);

-- Create 'QualityTest' table
CREATE TABLE pharma_company.QualityTest
(
  TestID        INT           IDENTITY(1,1),
  Name          NVARCHAR(150) NOT NULL,  -- e.g. "Dissolution", "Purity"
  Method        NVARCHAR(100) NULL,
  CreatedAt     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);
ALTER TABLE pharma_company.QualityTest
  ADD CONSTRAINT PK_QualityTest_TestID
  PRIMARY KEY CLUSTERED (TestID);

-- Create 'QCResult' table
CREATE TABLE pharma_company.QCResult
(
  ResultID      BIGINT       NOT NULL,
  BatchID       BIGINT       NOT NULL,
  BatchDate     DATE         NOT NULL,
  TestID        INT          NOT NULL,
  TestDate      DATE         NOT NULL,
  ResultValue   NVARCHAR(100) NULL,
  PassFail      CHAR(1)      NOT NULL,  -- 'P' or 'F'
  CreatedAt     DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME()
);
ALTER TABLE pharma_company.QCResult
  ADD CONSTRAINT PK_QCResult
  PRIMARY KEY CLUSTERED (ResultID, TestDate)
  ON PS_PharmaYear(TestDate);
ALTER TABLE pharma_company.QCResult
  ADD CONSTRAINT FK_QC_Batch
  FOREIGN KEY (BatchID, BatchDate)
  REFERENCES pharma_company.ManufacturingBatch(BatchID, BatchDate);
ALTER TABLE pharma_company.QCResult
  ADD CONSTRAINT FK_QC_Test
  FOREIGN KEY (TestID)
  REFERENCES pharma_company.QualityTest(TestID);
-- Create an index for 'QCResult' table
CREATE INDEX IX_QC_BatchDate
 ON pharma_company.QCResult(BatchID, TestDate DESC);

-- Create 'DistributionCenter' table
CREATE TABLE pharma_company.DistributionCenter
(
  CenterID      INT           IDENTITY(1,1),
  Name          NVARCHAR(150) NOT NULL,
  AddressID     INT           NULL,
  CreatedAt     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);
ALTER TABLE pharma_company.DistributionCenter
  ADD CONSTRAINT PK_DistributionCenter_CenterID
  PRIMARY KEY CLUSTERED (CenterID);
ALTER TABLE pharma_company.DistributionCenter
  ADD CONSTRAINT FK_DC_Address
  FOREIGN KEY (AddressID)
  REFERENCES pharma_company.Address(AddressID);

-- Create 'Inventory' table
CREATE TABLE pharma_company.Inventory
(
  InventoryID   BIGINT       NOT NULL,
  CenterID      INT          NOT NULL,
  ProductID     INT          NOT NULL,
  SnapshotDate  DATE         NOT NULL,
  QuantityUnits INT          NOT NULL,
  CreatedAt     DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME()
);
ALTER TABLE pharma_company.Inventory
  ADD CONSTRAINT PK_Inventory
  PRIMARY KEY CLUSTERED (InventoryID, SnapshotDate)
  ON PS_PharmaYear(SnapshotDate);
ALTER TABLE pharma_company.Inventory
  ADD CONSTRAINT FK_Inv_Center
  FOREIGN KEY (CenterID)
  REFERENCES pharma_company.DistributionCenter(CenterID);
ALTER TABLE pharma_company.Inventory
  ADD CONSTRAINT FK_Inv_Product
  FOREIGN KEY (ProductID)
  REFERENCES pharma_company.Product(ProductID);
-- Create an index for 'Inventory' table
CREATE INDEX IX_Inv_CenterDate
ON pharma_company.Inventory(CenterID, SnapshotDate DESC);

-- Create 'Customer' table
CREATE TABLE pharma_company.Customer
(
  CustomerID    INT           IDENTITY(1,1),
  Name          NVARCHAR(150) NOT NULL,
  AddressID     INT           NULL,
  CreatedAt     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);
ALTER TABLE pharma_company.Customer
  ADD CONSTRAINT PK_Customer_CustomerID
  PRIMARY KEY CLUSTERED (CustomerID);
ALTER TABLE pharma_company.Customer
  ADD CONSTRAINT FK_Cust_Address
  FOREIGN KEY (AddressID)
  REFERENCES pharma_company.Address(AddressID);

-- Create 'Shipment' table
CREATE TABLE pharma_company.Shipment
(
  ShipmentID    BIGINT       NOT NULL,
  CenterID      INT          NOT NULL,
  CustomerID    INT          NOT NULL,
  ShipmentDate  DATE         NOT NULL,
  QuantityUnits INT          NOT NULL,
  CreatedAt     DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME()
);
ALTER TABLE pharma_company.Shipment
  ADD CONSTRAINT PK_Shipment
  PRIMARY KEY CLUSTERED (ShipmentID, ShipmentDate)
  ON PS_PharmaYear(ShipmentDate);
ALTER TABLE pharma_company.Shipment
  ADD CONSTRAINT FK_Ship_Center
  FOREIGN KEY (CenterID)
  REFERENCES pharma_company.DistributionCenter(CenterID);
ALTER TABLE pharma_company.Shipment
  ADD CONSTRAINT FK_Ship_Cust
  FOREIGN KEY (CustomerID)
  REFERENCES pharma_company.Customer(CustomerID);
-- Create an index for 'Shipment' table
CREATE INDEX IX_Ship_CenterDate
ON pharma_company.Shipment(CenterID, ShipmentDate DESC);

-- Create 'SalesOrder' table
CREATE TABLE pharma_company.SalesOrder
(
  SalesOrderID  BIGINT       NOT NULL,
  CustomerID    INT          NOT NULL,
  OrderDate     DATE         NOT NULL,
  TotalUnits    INT          NOT NULL,
  TotalAmount   DECIMAL(18,2)NOT NULL,
  Status        NVARCHAR(20) NOT NULL,  -- e.g. "Open","Shipped"
  CreatedAt     DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME()
);
ALTER TABLE pharma_company.SalesOrder
  ADD CONSTRAINT PK_SalesOrder
  PRIMARY KEY CLUSTERED (SalesOrderID, OrderDate)
  ON PS_PharmaYear(OrderDate);
ALTER TABLE pharma_company.SalesOrder
  ADD CONSTRAINT FK_SO_Cust
  FOREIGN KEY (CustomerID)
  REFERENCES pharma_company.Customer(CustomerID);
-- Create an index for 'SalesOrder' table
CREATE INDEX IX_SO_CustDate
ON pharma_company.SalesOrder(CustomerID, OrderDate DESC);

-- Create 'RegulatorySubmission' table
CREATE TABLE pharma_company.RegulatorySubmission
(
  SubmissionID  BIGINT       IDENTITY(1,1),
  ProductID     INT          NOT NULL,
  SubmissionDate DATE        NOT NULL,
  Agency        NVARCHAR(100)NOT NULL,  -- e.g. "FDA", "EMA"
  Status        NVARCHAR(50) NOT NULL,  -- e.g. "Pending","Approved"
  DocumentLink  NVARCHAR(255) NULL,
  CreatedAt     DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME()
);
ALTER TABLE pharma_company.RegulatorySubmission
  ADD CONSTRAINT PK_RegulatorySubmission_SubmissionID
  PRIMARY KEY CLUSTERED (SubmissionID);
ALTER TABLE pharma_company.RegulatorySubmission
  ADD CONSTRAINT FK_RS_Product
  FOREIGN KEY (ProductID)
  REFERENCES pharma_company.Product(ProductID);
```

## DML Syntax
* Run the script in one batch so all variables stay in scope.
```sql
/* ===================================================================
   PHARMA COMPANY – BULK DATA GENERATOR (inline generators)
   Prereq: Tables + PF_PharmaYear/PS_PharmaYear already exist.
   ===================================================================*/
SET NOCOUNT ON;

/* ===================================================================
   Tunables
   ===================================================================*/
DECLARE 
  @addrCount        int = 1000,
  @supplierCount    int = 120,
  @rawMatCount      int = 600,
  @productCount     int = 240,
  @equipCount       int = 120,
  @qualityTestCount int = 12,
  @centerCount      int = 40,
  @customerCount    int = 2500,

  @formulationPerProd int = 3,
  @batchCount       int = 6000,
  @qcTestsPerBatch  int = 3,
  @inventoryDays    int = 20,
  @inventoryProds   int = 120,
  @inventoryCenters int = 25,
  @salesOrderCount  int = 12000,
  @shipmentCount    int = 7000;

DECLARE 
  @startDate date = '2025-07-01',
  @endDate   date = '2025-07-31';

/* ===================================================================
   1) Address
   ===================================================================*/
INSERT INTO pharma_company.Address (Street, City, State, ZIP, Country)
SELECT 
  CONCAT('No.', N.n, ' Main St'),
  CONCAT('City', N.n % 200),
  CONCAT('State', N.n % 50),
  CONCAT('Z', RIGHT('00000'+CONVERT(varchar(8), 10000 + (N.n%90000)), 5)),
  CASE N.n%6 WHEN 0 THEN 'USA' WHEN 1 THEN 'India' WHEN 2 THEN 'UK' 
             WHEN 3 THEN 'Germany' WHEN 4 THEN 'Brazil' ELSE 'Canada' END
FROM (
  SELECT TOP (@addrCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
  FROM sys.all_objects
) AS N;

DECLARE @addrMax int = (SELECT MAX(AddressID) FROM pharma_company.Address);

/* ===================================================================
   2) Supplier
   ===================================================================*/
INSERT INTO pharma_company.Supplier (Name, ContactName, Phone, Email, AddressID)
SELECT
  CONCAT('Supplier ', N.n),
  CONCAT('Contact ', N.n),
  CONCAT('+1-555-', RIGHT('0000'+CONVERT(varchar(10), 2000+(N.n%8000)),4)),
  CONCAT('supplier', N.n, '@example.com'),
  ((N.n-1)%@addrMax)+1
FROM (
  SELECT TOP (@supplierCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
  FROM sys.all_objects
) AS N;

/* ===================================================================
   3) RawMaterial
   ===================================================================*/
DECLARE @supMax int = (SELECT MAX(SupplierID) FROM pharma_company.Supplier);

INSERT INTO pharma_company.RawMaterial (Name, CASNumber, SupplierID)
SELECT
  CONCAT('RawMat-', RIGHT('00000'+CONVERT(varchar(10), N.n),5)),
  CONCAT((N.n%999), '-', RIGHT('00'+CONVERT(varchar(10), N.n%99),2), '-', RIGHT('00'+CONVERT(varchar(10),(N.n*7)%99),2)),
  ((N.n-1)%@supMax)+1
FROM (
  SELECT TOP (@rawMatCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
  FROM sys.all_objects
) AS N;

/* ===================================================================
   4) Product
   ===================================================================*/
INSERT INTO pharma_company.Product (Name, Strength, Formulation)
SELECT
  CONCAT('Product-', RIGHT('0000'+CONVERT(varchar(10), N.n),4)),
  CASE N.n%5 WHEN 0 THEN '250 mg' WHEN 1 THEN '500 mg' WHEN 2 THEN '10 mg' WHEN 3 THEN '20 mg' ELSE '5 mg' END,
  CASE N.n%4 WHEN 0 THEN 'Tablet' WHEN 1 THEN 'Capsule' WHEN 2 THEN 'Syrup' ELSE 'Injection' END
FROM (
  SELECT TOP (@productCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
  FROM sys.all_objects
) AS N;

/* ===================================================================
   5) Formulation (~3 raw materials per product)
   ===================================================================*/
INSERT INTO pharma_company.Formulation (ProductID, RawMaterialID, Percentage)
SELECT P.ProductID, R1.RawMaterialID, 60.00
FROM (SELECT TOP (@productCount) ProductID, ROW_NUMBER() OVER (ORDER BY ProductID) AS rn
      FROM pharma_company.Product ORDER BY ProductID) AS P
JOIN (SELECT RawMaterialID, ROW_NUMBER() OVER (ORDER BY RawMaterialID) AS rn
      FROM pharma_company.RawMaterial) AS R1
  ON R1.rn = ((P.rn*3-2) % (SELECT COUNT(*) FROM pharma_company.RawMaterial)) + 1
UNION ALL
SELECT P.ProductID, R2.RawMaterialID, 30.00
FROM (SELECT TOP (@productCount) ProductID, ROW_NUMBER() OVER (ORDER BY ProductID) AS rn
      FROM pharma_company.Product ORDER BY ProductID) AS P
JOIN (SELECT RawMaterialID, ROW_NUMBER() OVER (ORDER BY RawMaterialID) AS rn
      FROM pharma_company.RawMaterial) AS R2
  ON R2.rn = ((P.rn*3-1) % (SELECT COUNT(*) FROM pharma_company.RawMaterial)) + 1
UNION ALL
SELECT P.ProductID, R3.RawMaterialID, 10.00
FROM (SELECT TOP (@productCount) ProductID, ROW_NUMBER() OVER (ORDER BY ProductID) AS rn
      FROM pharma_company.Product ORDER BY ProductID) AS P
JOIN (SELECT RawMaterialID, ROW_NUMBER() OVER (ORDER BY RawMaterialID) AS rn
      FROM pharma_company.RawMaterial) AS R3
  ON R3.rn = ((P.rn*3-0) % (SELECT COUNT(*) FROM pharma_company.RawMaterial)) + 1;

/* ===================================================================
   6) Equipment
   ===================================================================*/
INSERT INTO pharma_company.Equipment (Name, Type, Location)
SELECT
  CONCAT('Equip-', RIGHT('0000'+CONVERT(varchar(10), N.n),4)),
  CASE N.n%7 WHEN 0 THEN 'Reactor' WHEN 1 THEN 'Granulator' WHEN 2 THEN 'Mixer' 
             WHEN 3 THEN 'Filter' WHEN 4 THEN 'Dryer' WHEN 5 THEN 'Autoclave' ELSE 'Packaging' END,
  CONCAT('Plant-', CHAR(65 + (N.n%5)))
FROM (
  SELECT TOP (@equipCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
  FROM sys.all_objects
) AS N;

/* ===================================================================
   7) QualityTest
   ===================================================================*/
INSERT INTO pharma_company.QualityTest (Name, Method)
SELECT 
  CASE N.n
    WHEN 1 THEN 'Dissolution'
    WHEN 2 THEN 'Purity'
    WHEN 3 THEN 'Moisture'
    WHEN 4 THEN 'Particle Size'
    WHEN 5 THEN 'pH'
    WHEN 6 THEN 'Content Uniformity'
    WHEN 7 THEN 'Stability'
    WHEN 8 THEN 'Sterility'
    WHEN 9 THEN 'Endotoxin'
    WHEN 10 THEN 'Appearance'
    WHEN 11 THEN 'Assay'
    ELSE 'Bioavailability' END,
  CASE N.n%4 WHEN 0 THEN 'HPLC' WHEN 1 THEN 'UV' WHEN 2 THEN 'USP II' ELSE 'KF' END
FROM (
  SELECT TOP (@qualityTestCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
  FROM sys.all_objects
) AS N;

/* ===================================================================
   8) DistributionCenter
   ===================================================================*/
INSERT INTO pharma_company.DistributionCenter (Name, AddressID)
SELECT 
  CONCAT('DC-', RIGHT('000'+CONVERT(varchar(10), N.n),3)),
  ((N.n-1)%@addrMax)+1
FROM (
  SELECT TOP (@centerCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
  FROM sys.all_objects
) AS N;

/* ===================================================================
   9) Customer
   ===================================================================*/
INSERT INTO pharma_company.Customer (Name, AddressID)
SELECT
  CONCAT('Customer-', RIGHT('000000'+CONVERT(varchar(10), N.n),6)),
  ((N.n*3-1)%@addrMax)+1
FROM (
  SELECT TOP (@customerCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
  FROM sys.all_objects
) AS N;

/* ===================================================================
   10) ManufacturingBatch (capture for QCResult)
   ===================================================================*/
IF OBJECT_ID('tempdb..#Batches') IS NOT NULL DROP TABLE #Batches;
CREATE TABLE #Batches
(
  BatchID     bigint PRIMARY KEY,
  ProductID   int     NOT NULL,
  BatchDate   date    NOT NULL
);

DECLARE @prodMax int = (SELECT MAX(ProductID) FROM pharma_company.Product);

INSERT INTO pharma_company.ManufacturingBatch (BatchID, ProductID, BatchDate, QuantityUnits, Status)
OUTPUT INSERTED.BatchID, INSERTED.ProductID, INSERTED.BatchDate INTO #Batches(BatchID, ProductID, BatchDate)
SELECT
  100000 + N.rn,
  ((N.rn-1)%@prodMax)+1,
  DATEADD(DAY, N.rn % DATEDIFF(DAY, @startDate, DATEADD(DAY,1,@endDate)), @startDate),
  5000 + (N.rn % 25000),
  CASE N.rn%7 WHEN 0 THEN 'Hold' ELSE 'Released' END
FROM (
  SELECT TOP (@batchCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn
  FROM sys.all_objects a CROSS JOIN sys.all_objects b
) AS N;

/* ===================================================================
   11) QCResult (3 tests per batch)
   ===================================================================*/
DECLARE @testMax int = (SELECT MAX(TestID) FROM pharma_company.QualityTest);

INSERT INTO pharma_company.QCResult (ResultID, BatchID, BatchDate, TestID, TestDate, ResultValue, PassFail)
SELECT
  2000000 + BT.seq AS ResultID,
  BT.BatchID,
  BT.BatchDate,
  BT.TestID,
  DATEADD(DAY, 1 + (BT.seq % 3), BT.BatchDate),
  CASE BT.seq%5 WHEN 0 THEN '98%' WHEN 1 THEN 'Pass' WHEN 2 THEN '7.1 pH' WHEN 3 THEN '0.1% moisture' ELSE 'Within spec' END,
  CASE BT.seq%17 WHEN 0 THEN 'F' ELSE 'P' END
FROM (
  SELECT B.BatchID,
         B.BatchDate,
         ((B.rn + T.t) % @testMax) + 1 AS TestID,
         ROW_NUMBER() OVER (ORDER BY B.BatchID, T.t) AS seq
  FROM (
    SELECT BatchID, BatchDate, ROW_NUMBER() OVER (ORDER BY BatchID) AS rn
    FROM #Batches
  ) AS B
  CROSS JOIN (
    SELECT TOP (@qcTestsPerBatch) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS t
    FROM sys.all_objects
  ) AS T
) AS BT;

/* ===================================================================
   12) Inventory snapshots (centers × products × days)
   ===================================================================*/
IF OBJECT_ID('tempdb..#Centers') IS NOT NULL DROP TABLE #Centers;
IF OBJECT_ID('tempdb..#InvProducts') IS NOT NULL DROP TABLE #InvProducts;

SELECT TOP (@inventoryCenters) CenterID
INTO #Centers
FROM pharma_company.DistributionCenter
ORDER BY CenterID;

SELECT TOP (@inventoryProds) ProductID
INTO #InvProducts
FROM pharma_company.Product
ORDER BY ProductID;

INSERT INTO pharma_company.Inventory (InventoryID, CenterID, ProductID, SnapshotDate, QuantityUnits)
SELECT
  3000000 + X.rn AS InventoryID,
  X.CenterID,
  X.ProductID,
  X.SnapshotDate,
  1000 + (ABS(CHECKSUM(NEWID())) % 9000)
FROM (
  SELECT c.CenterID, p.ProductID, d.d AS SnapshotDate,
         ROW_NUMBER() OVER (ORDER BY c.CenterID, p.ProductID, d.d) AS rn
  FROM #Centers c
  CROSS JOIN #InvProducts p
  CROSS JOIN (
    SELECT TOP (@inventoryDays) DATEADD(DAY, ROW_NUMBER() OVER (ORDER BY (SELECT NULL))-1, @startDate) AS d
    FROM sys.all_objects
  ) AS d
) AS X;

/* ===================================================================
   13) SalesOrder (composite PK; large volume)
   ===================================================================*/
DECLARE @custMax int = (SELECT MAX(CustomerID) FROM pharma_company.Customer);

INSERT INTO pharma_company.SalesOrder (SalesOrderID, CustomerID, OrderDate, TotalUnits, TotalAmount, Status)
SELECT
  4000000 + N.rn,
  ((N.rn*7-3) % @custMax) + 1,
  DATEADD(DAY, N.rn % DATEDIFF(DAY, @startDate, DATEADD(DAY,1,@endDate)), @startDate),
  50 + (N.rn % 450),
  CAST((50 + (N.rn % 450)) * (5 + (N.rn % 40)) AS decimal(18,2)),
  CASE N.rn%6 WHEN 0 THEN 'Open' WHEN 1 THEN 'Open' WHEN 2 THEN 'Shipped' WHEN 3 THEN 'Shipped' WHEN 4 THEN 'Shipped' ELSE 'Open' END
FROM (
  SELECT TOP (@salesOrderCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn
  FROM sys.all_objects a CROSS JOIN sys.all_objects b
) AS N;

/* ===================================================================
   14) Shipment (composite PK)
   ===================================================================*/
DECLARE @centerActual int = (SELECT COUNT(*) FROM pharma_company.DistributionCenter);

INSERT INTO pharma_company.Shipment (ShipmentID, CenterID, CustomerID, ShipmentDate, QuantityUnits)
SELECT
  5000000 + N.rn,
  C.CenterID,
  ((N.rn*11-5) % @custMax) + 1,
  DATEADD(DAY, N.rn % DATEDIFF(DAY, @startDate, DATEADD(DAY,1,@endDate)), @startDate),
  100 + (N.rn % 900)
FROM (
  SELECT TOP (@shipmentCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn
  FROM sys.all_objects a CROSS JOIN sys.all_objects b
) AS N
JOIN (
  SELECT CenterID, ROW_NUMBER() OVER (ORDER BY CenterID) AS r
  FROM pharma_company.DistributionCenter
) AS C
  ON C.r = ((N.rn-1) % @centerActual) + 1;

/* ===================================================================
   15) RegulatorySubmission (subset of products)
   ===================================================================*/
INSERT INTO pharma_company.RegulatorySubmission (ProductID, SubmissionDate, Agency, Status, DocumentLink)
SELECT
  P.ProductID,
  DATEADD(DAY, P.rn % 28, @startDate),
  CASE P.rn%5 WHEN 0 THEN 'FDA' WHEN 1 THEN 'EMA' WHEN 2 THEN 'PMDA' WHEN 3 THEN 'TGA' ELSE 'ANVISA' END,
  CASE P.rn%3 WHEN 0 THEN 'Pending' WHEN 1 THEN 'Approved' ELSE 'In Review' END,
  CONCAT('/docs/sub_', RIGHT('000000'+CONVERT(varchar(10), P.ProductID),6), '.pdf')
FROM (
  SELECT TOP (@productCount) ProductID, ROW_NUMBER() OVER (ORDER BY ProductID) AS rn
  FROM pharma_company.Product ORDER BY ProductID
) AS P;

/* ===================================================================
   DONE: Quick row counts
   ===================================================================*/
PRINT '=== BULK LOAD COMPLETE ===';
SELECT
  (SELECT COUNT(*) FROM pharma_company.Address)              AS AddressCount,
  (SELECT COUNT(*) FROM pharma_company.Supplier)             AS SupplierCount,
  (SELECT COUNT(*) FROM pharma_company.RawMaterial)          AS RawMaterialCount,
  (SELECT COUNT(*) FROM pharma_company.Product)              AS ProductCount,
  (SELECT COUNT(*) FROM pharma_company.Formulation)          AS FormulationCount,
  (SELECT COUNT(*) FROM pharma_company.Equipment)            AS EquipmentCount,
  (SELECT COUNT(*) FROM pharma_company.QualityTest)          AS QualityTestCount,
  (SELECT COUNT(*) FROM pharma_company.ManufacturingBatch)   AS ManufacturingBatchCount,
  (SELECT COUNT(*) FROM pharma_company.QCResult)             AS QCResultCount,
  (SELECT COUNT(*) FROM pharma_company.DistributionCenter)   AS DistributionCenterCount,
  (SELECT COUNT(*) FROM pharma_company.Inventory)            AS InventoryCount,
  (SELECT COUNT(*) FROM pharma_company.Customer)             AS CustomerCount,
  (SELECT COUNT(*) FROM pharma_company.SalesOrder)           AS SalesOrderCount,
  (SELECT COUNT(*) FROM pharma_company.Shipment)             AS ShipmentCount,
  (SELECT COUNT(*) FROM pharma_company.RegulatorySubmission) AS RegulatorySubmissionCount;
```

## DROP Syntax:
```sql
DROP TABLE IF EXISTS pharma_company.QCResult;
DROP TABLE IF EXISTS pharma_company.Formulation;
DROP TABLE IF EXISTS pharma_company.Inventory;
DROP TABLE IF EXISTS pharma_company.Shipment;
DROP TABLE IF EXISTS pharma_company.SalesOrder;
DROP TABLE IF EXISTS pharma_company.RegulatorySubmission;

DROP TABLE IF EXISTS pharma_company.ManufacturingBatch;
DROP TABLE IF EXISTS pharma_company.RawMaterial;

DROP TABLE IF EXISTS pharma_company.Supplier;
DROP TABLE IF EXISTS pharma_company.Customer;
DROP TABLE IF EXISTS pharma_company.DistributionCenter;

DROP TABLE IF EXISTS pharma_company.Product;
DROP TABLE IF EXISTS pharma_company.QualityTest;
DROP TABLE IF EXISTS pharma_company.Equipment;

DROP TABLE IF EXISTS pharma_company.Address;

DROP PARTITION SCHEME PS_PharmaYear;
DROP PARTITION FUNCTION PF_PharmaYear;

DROP SCHEMA pharma_company;
```

***
### [Assignments](assignments/README.md)
### [Assignments - Solutions](assignments-solutions/README.md)

##### [Back To Contents](../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
