![SQL Server Tinitiate Image](../../sqlserver-sql/sqlserver.png)

# SQL Server Tutorial
&copy; TINITIATE.COM

##### [Back To Contents](../README.md)

# Oil & Gas Company Data Model
This model spans upstream (regions, fields, wells, drilling), midstream (pipelines and flows), and downstream/commercial (facilities, products, inventory, shipments, contracts, invoices, payments), plus cross-cutting maintenance.  
- **Region → Field → Well** form the exploration/production hierarchy.  
- **DrillingOperation** captures well activity timelines.  
- **Production** stores daily well outputs (oil, gas, water) as a partitioned time-series.  
- **Pipeline / PipelineFlow** model midstream transport and volumes (partitioned).  
- **Facility / Product / Inventory / Shipment** manage refined products and movements.  
- **Customer / SalesContract / Invoice / Payment** cover commercial agreements and cashflow (invoices are partitioned).  
- **AssetMaintenance** records O&M events across wells, pipelines, and facilities.

## Region
* **RegionID**: Surrogate key (PK).  
* **Name, Country**: Geographic grouping (e.g., Basin, State/Country).

## Field
* **FieldID**: Surrogate key (PK).  
* **RegionID**: FK → `Region(RegionID)`.  
* **Name, DiscoveryDate, Status**: Field identity and lifecycle.

## Well
* **WellID**: Surrogate key (PK).  
* **FieldID**: FK → `Field(FieldID)`.  
* **Name, WellType (Oil/Gas/Injector), SpudDate, Status**: Well metadata.

## DrillingOperation
* **OperationID**: Surrogate key (PK).  
* **WellID**: FK → `Well(WellID)`.  
* **StartDate, EndDate, RigName, Status**: Drilling timeline.  
* **IX_Drill_WellDate**: Speeds queries by well and recent start dates.

## Production (Partitioned)
* **ProductionID, ProductionDate**: Composite PK; partitioned by `ProductionDate` (e.g., `PS_OilGasYear`).  
* **WellID**: FK → `Well(WellID)`.  
* **Oil_bbl, Gas_mcf, Water_bbl**: Daily volumes.  
* **CreatedAt/By**: Audit columns.  
* **IX_Prod_WellDate**: Fast lookups by well and date.

## Pipeline
* **PipelineID**: Surrogate key (PK).  
* **Name, FromFacility, ToFacility**: Endpoint IDs (facility references).  
* **CapacityBbl**: Rated capacity.  
* **CreatedAt**: Audit column.

## PipelineFlow (Partitioned)
* **FlowID, FlowDate**: Composite PK; partitioned by `FlowDate`.  
* **PipelineID**: FK → `Pipeline(PipelineID)`.  
* **Volume_bbl**: Daily transported volume.  
* **CreatedAt**: Audit column.  
* **IX_PFlow_PipeDate**: Pipeline/date queries.

## Facility
* **FacilityID**: Surrogate key (PK).  
* **Name, FacilityType (Refinery/Terminal/Storage), Location**: Downstream nodes.  
* **CreatedAt**: Audit column.

## Product
* **ProductID**: Surrogate key (PK).  
* **Name**: Refined product (e.g., Gasoline, Diesel).  
* **APIGravity, SulfurPct**: Quality specs.

## Inventory
* **InventoryID**: Surrogate key (PK).  
* **FacilityID**: FK → `Facility(FacilityID)`.  
* **ProductID**: FK → `Product(ProductID)`.  
* **SnapshotDate, Quantity_bbl, CreatedAt**: Stock position by day.  
* **IX_Inv_FacDate**: Facility/date lookups.

## Shipment (Partitioned)
* **ShipmentID, ShipDate**: Composite PK; partitioned by `ShipDate`.  
* **FromFacility**: FK → `Facility(FacilityID)`.  
* **ToCustomer**: FK → `Customer(CustomerID)`.  
* **ProductID**: FK → `Product(ProductID)`.  
* **Volume_bbl, RatePerBbl, CreatedAt**: Movement and pricing.  
* **IX_Shp_FromDate**: Facility/date queries.

## Customer
* **CustomerID**: Surrogate key (PK).  
* **Name**: Buyer (trader, distributor, refinery).  
* **AddressID**: FK → `Address(AddressID)` if address table exists.  
* **CreatedAt**: Audit column.

## SalesContract
* **ContractID**: Surrogate key (PK).  
* **CustomerID**: FK → `Customer(CustomerID)`.  
* **ProductID**: FK → `Product(ProductID)`.  
* **StartDate, EndDate, VolumeCommit_bbl, PricePerBbl**: Commercial terms.  
* **CreatedAt**: Audit column.

## Invoice (Partitioned)
* **InvoiceID, InvoiceDate**: Composite PK; partitioned by `InvoiceDate`.  
* **CustomerID**: FK → `Customer(CustomerID)`.  
* **AmountDue, Status, CreatedAt**: Billing lifecycle.  
* **IX_Inv_Status**: Filters by status (includes `AmountDue`).

## Payment
* **PaymentID**: Surrogate key (PK).  
* **InvoiceID**: FK → `Invoice(InvoiceID)`.  
* **PaymentDate, AmountPaid, CreatedAt**: Remittance details.

## AssetMaintenance
* **MaintenanceID**: Surrogate key (PK).  
* **AssetType, AssetID**: Logical reference to the maintained asset (well/pipeline/facility).  
* **MaintDate, Description, CostUSD, CreatedAt**: Work log and cost.  
* **IX_AM_Date**: Recent maintenance by date; **IX_AM_Asset (unique)** ensures one record per asset/day.

## DDL Syntax
```sql
-- Create 'oil_n_gas_company' schema
CREATE SCHEMA oil_n_gas_company;

-- Create 'PS_OilGasYear' partition scheme
IF NOT EXISTS (SELECT 1 FROM sys.partition_functions WHERE name = 'PS_OilGasYear')
BEGIN
  EXEC('CREATE PARTITION FUNCTION PS_OilGasYear (date)
        AS RANGE RIGHT FOR VALUES (''2023-01-01'',''2024-01-01'',''2025-01-01'',''2026-01-01'',''2027-01-01'');');
END;
IF NOT EXISTS (SELECT 1 FROM sys.partition_schemes WHERE name = 'PS_OilGasYear')
BEGIN
  EXEC('CREATE PARTITION SCHEME PS_OilGasYear
        AS PARTITION PS_OilGasYear
        ALL TO ([PRIMARY]);');
END;

-- Create 'Region' table
CREATE TABLE oil_n_gas_company.Region
(
  RegionID     INT           IDENTITY(1,1),
  Name         NVARCHAR(100) NOT NULL,
  Country      NVARCHAR(50)  NOT NULL
);
ALTER TABLE oil_n_gas_company.Region
  ADD CONSTRAINT PK_Region PRIMARY KEY CLUSTERED (RegionID);

-- Create 'Field' table
CREATE TABLE oil_n_gas_company.Field
(
  FieldID      INT           IDENTITY(1,1),
  RegionID     INT           NOT NULL,
  Name         NVARCHAR(150) NOT NULL,
  DiscoveryDate DATE         NULL,
  Status       NVARCHAR(50)  NOT NULL DEFAULT 'Active'
);
ALTER TABLE oil_n_gas_company.Field
  ADD CONSTRAINT PK_Field PRIMARY KEY CLUSTERED (FieldID);
ALTER TABLE oil_n_gas_company.Field
  ADD CONSTRAINT FK_Field_Region FOREIGN KEY (RegionID)
      REFERENCES oil_n_gas_company.Region(RegionID);

-- Create 'Well' table
CREATE TABLE oil_n_gas_company.Well
(
  WellID       BIGINT        IDENTITY(1,1),
  FieldID      INT           NOT NULL,
  Name         NVARCHAR(150) NOT NULL,
  WellType     NVARCHAR(50)  NULL,
  SpudDate     DATE          NULL,
  Status       NVARCHAR(50)  NOT NULL DEFAULT 'Drilling'
);
ALTER TABLE oil_n_gas_company.Well
  ADD CONSTRAINT PK_Well PRIMARY KEY CLUSTERED (WellID);
ALTER TABLE oil_n_gas_company.Well
  ADD CONSTRAINT FK_Well_Field FOREIGN KEY (FieldID)
      REFERENCES oil_n_gas_company.Field(FieldID);


-- Create 'DrillingOperation' table
CREATE TABLE oil_n_gas_company.DrillingOperation
(
  OperationID      BIGINT    IDENTITY(1,1),
  WellID           BIGINT    NOT NULL,
  StartDate        DATETIME2 NOT NULL,
  EndDate          DATETIME2 NULL,
  RigName          NVARCHAR(100) NULL,
  Status           NVARCHAR(50) NOT NULL
);
ALTER TABLE oil_n_gas_company.DrillingOperation
  ADD CONSTRAINT PK_DrillingOperation PRIMARY KEY CLUSTERED (OperationID);
ALTER TABLE oil_n_gas_company.DrillingOperation
  ADD CONSTRAINT FK_Drill_Well FOREIGN KEY (WellID)
      REFERENCES oil_n_gas_company.Well(WellID);
-- Create an index for 'DrillingOperation' table
CREATE INDEX IX_Drill_WellDate
  ON oil_n_gas_company.DrillingOperation(WellID, StartDate DESC);

-- Create 'Production' table
CREATE TABLE oil_n_gas_company.Production
(
  ProductionID     BIGINT     NOT NULL,
  WellID           BIGINT     NOT NULL,
  ProductionDate   DATE       NOT NULL,
  Oil_bbl          DECIMAL(18,2) NOT NULL,
  Gas_mcf          DECIMAL(18,2) NOT NULL,
  Water_bbl        DECIMAL(18,2) NOT NULL,
  CreatedAt        DATETIME2  NOT NULL DEFAULT SYSUTCDATETIME(),
  CreatedBy        SYSNAME    NOT NULL DEFAULT SUSER_SNAME()
);
ALTER TABLE oil_n_gas_company.Production
  ADD CONSTRAINT PK_Production PRIMARY KEY CLUSTERED (ProductionID, ProductionDate)
    ON PS_OilGasYear(ProductionDate);
ALTER TABLE oil_n_gas_company.Production
  ADD CONSTRAINT FK_Prod_Well FOREIGN KEY (WellID)
      REFERENCES oil_n_gas_company.Well(WellID);
-- Create an index for 'Production' table
CREATE INDEX IX_Prod_WellDate
ON oil_n_gas_company.Production(WellID, ProductionDate DESC);

-- Create 'Pipeline' table
CREATE TABLE oil_n_gas_company.Pipeline
(
  PipelineID    INT           IDENTITY(1,1),
  Name          NVARCHAR(150) NOT NULL,
  FromFacility  INT           NOT NULL,
  ToFacility    INT           NOT NULL,
  CapacityBbl   DECIMAL(18,2) NOT NULL,
  CreatedAt     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);
ALTER TABLE oil_n_gas_company.Pipeline
  ADD CONSTRAINT PK_Pipeline PRIMARY KEY CLUSTERED (PipelineID);

-- Create 'PipelineFlow' table
CREATE TABLE oil_n_gas_company.PipelineFlow
(
  FlowID          BIGINT      NOT NULL,
  PipelineID      INT         NOT NULL,
  FlowDate        DATE        NOT NULL,
  Volume_bbl      DECIMAL(18,2) NOT NULL,
  CreatedAt       DATETIME2   NOT NULL DEFAULT SYSUTCDATETIME()
);
ALTER TABLE oil_n_gas_company.PipelineFlow
  ADD CONSTRAINT PK_PipelineFlow PRIMARY KEY CLUSTERED (FlowID, FlowDate)
    ON PS_OilGasYear(FlowDate);
ALTER TABLE oil_n_gas_company.PipelineFlow
  ADD CONSTRAINT FK_PFlow_Pipe FOREIGN KEY (PipelineID)
      REFERENCES oil_n_gas_company.Pipeline(PipelineID);
-- Create an index for 'PipelineFlow' table
CREATE INDEX IX_PFlow_PipeDate
  ON oil_n_gas_company.PipelineFlow(PipelineID, FlowDate DESC);

-- Create 'Facility' table
CREATE TABLE oil_n_gas_company.Facility
(
  FacilityID   INT           IDENTITY(1,1),
  Name         NVARCHAR(150) NOT NULL,
  FacilityType NVARCHAR(50)  NOT NULL,
  Location     NVARCHAR(100) NULL,
  CreatedAt    DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);
ALTER TABLE oil_n_gas_company.Facility
  ADD CONSTRAINT PK_Facility PRIMARY KEY CLUSTERED (FacilityID);

-- Create 'Product' table
CREATE TABLE oil_n_gas_company.Product
(
  ProductID    INT           IDENTITY(1,1),
  Name         NVARCHAR(100) NOT NULL,
  APIGravity   DECIMAL(5,2)  NULL,
  SulfurPct    DECIMAL(5,3)  NULL
);
ALTER TABLE oil_n_gas_company.Product
  ADD CONSTRAINT PK_Product PRIMARY KEY CLUSTERED (ProductID);

-- Create 'Inventory' table
CREATE TABLE oil_n_gas_company.Inventory
(
  InventoryID  BIGINT        IDENTITY(1,1),
  FacilityID   INT           NOT NULL,
  ProductID    INT           NOT NULL,
  SnapshotDate DATE          NOT NULL,
  Quantity_bbl DECIMAL(18,2) NOT NULL,
  CreatedAt    DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);
ALTER TABLE oil_n_gas_company.Inventory
  ADD CONSTRAINT PK_Inventory PRIMARY KEY CLUSTERED (InventoryID);
ALTER TABLE oil_n_gas_company.Inventory
  ADD CONSTRAINT FK_Inv_Facility FOREIGN KEY (FacilityID)
      REFERENCES oil_n_gas_company.Facility(FacilityID);
ALTER TABLE oil_n_gas_company.Inventory
  ADD CONSTRAINT FK_Inv_Product FOREIGN KEY (ProductID)
      REFERENCES oil_n_gas_company.Product(ProductID);
-- Create an index for 'Inventory' table
CREATE INDEX IX_Inv_FacDate
  ON oil_n_gas_company.Inventory(FacilityID, SnapshotDate DESC);

-- Create 'Address' table
CREATE TABLE oil_n_gas_company.Address
(
  AddressID   INT           IDENTITY(1,1),
  Street      NVARCHAR(150) NOT NULL,
  City        NVARCHAR(50)  NOT NULL,
  State       NVARCHAR(50)  NOT NULL,
  ZIP         NVARCHAR(15)  NOT NULL,
  Country     NVARCHAR(50)  NOT NULL
);
ALTER TABLE oil_n_gas_company.Address
ADD CONSTRAINT PK_Address PRIMARY KEY CLUSTERED (AddressID);

-- Create 'Customer' table
CREATE TABLE oil_n_gas_company.Customer
(
  CustomerID   INT           IDENTITY(1,1),
  Name         NVARCHAR(150) NOT NULL,
  AddressID    INT           NULL,
  CreatedAt    DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);
ALTER TABLE oil_n_gas_company.Customer
  ADD CONSTRAINT PK_Customer PRIMARY KEY CLUSTERED (CustomerID);
ALTER TABLE oil_n_gas_company.Customer
  ADD CONSTRAINT FK_Cust_Address FOREIGN KEY (AddressID)
      REFERENCES oil_n_gas_company.Address(AddressID);

-- Create 'Shipment' table
CREATE TABLE oil_n_gas_company.Shipment
(
  ShipmentID    BIGINT       NOT NULL,
  FromFacility  INT          NOT NULL,
  ToCustomer    INT          NOT NULL,
  ProductID     INT          NOT NULL,
  ShipDate      DATE         NOT NULL,
  Volume_bbl    DECIMAL(18,2)NOT NULL,
  RatePerBbl    DECIMAL(12,4)NOT NULL,
  CreatedAt     DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME()
);
ALTER TABLE oil_n_gas_company.Shipment
  ADD CONSTRAINT PK_Shipment PRIMARY KEY CLUSTERED (ShipmentID, ShipDate)
    ON PS_OilGasYear(ShipDate);
ALTER TABLE oil_n_gas_company.Shipment
  ADD CONSTRAINT FK_Shp_FromFac FOREIGN KEY (FromFacility)
      REFERENCES oil_n_gas_company.Facility(FacilityID);
ALTER TABLE oil_n_gas_company.Shipment
  ADD CONSTRAINT FK_Shp_Cust FOREIGN KEY (ToCustomer)
      REFERENCES oil_n_gas_company.Customer(CustomerID);
ALTER TABLE oil_n_gas_company.Shipment
  ADD CONSTRAINT FK_Shp_Product FOREIGN KEY (ProductID)
      REFERENCES oil_n_gas_company.Product(ProductID);
-- Create an index for 'Shipment' table
CREATE INDEX IX_Shp_FromDate
  ON oil_n_gas_company.Shipment(FromFacility, ShipDate DESC);

-- Create 'SalesContract' table
CREATE TABLE oil_n_gas_company.SalesContract
(
  ContractID   BIGINT        IDENTITY(1,1),
  CustomerID   INT           NOT NULL,
  ProductID    INT           NOT NULL,
  StartDate    DATE          NOT NULL,
  EndDate      DATE          NULL,
  VolumeCommit_bbl DECIMAL(18,2) NULL,
  PricePerBbl  DECIMAL(12,4) NULL,
  CreatedAt    DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);
ALTER TABLE oil_n_gas_company.SalesContract
  ADD CONSTRAINT PK_SalesContract PRIMARY KEY CLUSTERED (ContractID);
ALTER TABLE oil_n_gas_company.SalesContract
  ADD CONSTRAINT FK_SC_Cust FOREIGN KEY (CustomerID)
      REFERENCES oil_n_gas_company.Customer(CustomerID);
ALTER TABLE oil_n_gas_company.SalesContract
  ADD CONSTRAINT FK_SC_Product FOREIGN KEY (ProductID)
      REFERENCES oil_n_gas_company.Product(ProductID);

-- Create 'Invoice' table
CREATE TABLE oil_n_gas_company.Invoice
(
  InvoiceID    BIGINT       NOT NULL,
  CustomerID   INT          NOT NULL,
  InvoiceDate  DATE         NOT NULL,
  AmountDue    DECIMAL(18,2)NOT NULL,
  Status       NVARCHAR(20) NOT NULL DEFAULT 'Open',
  CreatedAt    DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME()
);
ALTER TABLE oil_n_gas_company.Invoice
  ADD CONSTRAINT PK_Invoice PRIMARY KEY CLUSTERED (InvoiceID, InvoiceDate)
    ON PS_OilGasYear(InvoiceDate);
ALTER TABLE oil_n_gas_company.Invoice
  ADD CONSTRAINT FK_Inv_Cust FOREIGN KEY (CustomerID)
      REFERENCES oil_n_gas_company.Customer(CustomerID);
-- Create an index for 'Invoice' table
CREATE INDEX IX_Inv_Status
  ON oil_n_gas_company.Invoice(Status)
  INCLUDE (AmountDue);

-- Create 'Payment' table
CREATE TABLE oil_n_gas_company.Payment
(
  PaymentID    BIGINT       IDENTITY(1,1),
  InvoiceID    BIGINT       NOT NULL,
  InvoiceDate  DATE         NOT NULL,
  PaymentDate  DATE         NOT NULL,
  AmountPaid   DECIMAL(18,2)NOT NULL,
  CreatedAt    DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME()
);
ALTER TABLE oil_n_gas_company.Payment
  ADD CONSTRAINT PK_Payment PRIMARY KEY CLUSTERED (PaymentID);
ALTER TABLE oil_n_gas_company.Payment
  ADD CONSTRAINT FK_Pmt_Inv FOREIGN KEY (InvoiceID, InvoiceDate)
      REFERENCES oil_n_gas_company.Invoice(InvoiceID, InvoiceDate);

-- Create 'AssetMaintenance' table
CREATE TABLE oil_n_gas_company.AssetMaintenance
(
  MaintenanceID BIGINT      IDENTITY(1,1),
  AssetType     NVARCHAR(50) NOT NULL,
  AssetID       BIGINT       NOT NULL,
  MaintDate     DATE         NOT NULL,
  Description   NVARCHAR(255) NULL,
  CostUSD       DECIMAL(18,2) NOT NULL,
  CreatedAt     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME()
);
ALTER TABLE oil_n_gas_company.AssetMaintenance
  ADD CONSTRAINT PK_AssetMaintenance PRIMARY KEY CLUSTERED (MaintenanceID);
ALTER TABLE oil_n_gas_company.AssetMaintenance
  ADD CONSTRAINT IX_AM_Asset UNIQUE (AssetType, AssetID, MaintDate);
-- Create an index for 'AssetMaintenance' table
CREATE INDEX IX_AM_Date
  ON oil_n_gas_company.AssetMaintenance(MaintDate DESC);
```

## DML Syntax
```sql
/* ===================================================================
   OIL & GAS – COMPLETE BULK DATA GENERATOR (inline generators)
   Prereq: All tables + PS_OilGasYear already exist (from your DDL)
   ===================================================================*/
SET NOCOUNT ON;

------------------------------------------------------------
-- Tunables
------------------------------------------------------------
DECLARE
  @regionCount     int = 20,
  @fieldCount      int = 100,
  @wellCount       int = 1000,
  @drillOps        int = 1200,
  @prodDays        int = 180,

  @facilityCount   int = 50,
  @productCount    int = 10,
  @invDays         int = 30,
  @invFacilities   int = 24,   -- subset of facilities for inventory snapshots
  @invProducts     int = 6,    -- subset of products for inventory snapshots

  @addrCount       int = 2000,
  @customerCount   int = 5000,

  @shipDays        int = 90,   -- ship over last N days
  @shipments       int = 20000,

  @pipelineCount   int = 50,
  @flowDays        int = 90,

  @contractsCount  int = 2000;

-- AssetMaintenance volumes
DECLARE
  @amWellEvents int = 1800,
  @amPipeEvents int = 600,
  @amFacEvents  int = 1000;

DECLARE
  @today date = CAST(SYSDATETIME() AS date);

------------------------------------------------------------
-- 1) Region
------------------------------------------------------------
INSERT INTO oil_n_gas_company.Region (Name, Country)
SELECT
  CONCAT(N'Region-', n),
  CASE n % 7
    WHEN 0 THEN N'USA' WHEN 1 THEN N'India' WHEN 2 THEN N'Brazil'
    WHEN 3 THEN N'Saudi Arabia' WHEN 4 THEN N'Norway'
    WHEN 5 THEN N'UK' ELSE N'Canada'
  END
FROM (SELECT TOP (@regionCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
      FROM sys.all_objects) N;

DECLARE @regionMax int = (SELECT MAX(RegionID) FROM oil_n_gas_company.Region);

------------------------------------------------------------
-- 2) Field
------------------------------------------------------------
INSERT INTO oil_n_gas_company.Field (RegionID, Name, DiscoveryDate, Status)
SELECT
  ((n-1) % @regionMax) + 1,
  CONCAT(N'Field-', n),
  DATEADD(DAY, - (n % 16000), @today),
  CASE WHEN n % 17 = 0 THEN N'Inactive' ELSE N'Active' END
FROM (SELECT TOP (@fieldCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
      FROM sys.all_objects) N;

DECLARE @fieldMax int = (SELECT MAX(FieldID) FROM oil_n_gas_company.Field);

------------------------------------------------------------
-- 3) Well
------------------------------------------------------------
INSERT INTO oil_n_gas_company.Well (FieldID, Name, WellType, SpudDate, Status)
SELECT
  ((n-1) % @fieldMax) + 1,
  CONCAT(N'Well-', n),
  CASE n % 5 WHEN 0 THEN N'Injector' WHEN 1 THEN N'Oil' WHEN 2 THEN N'Gas' WHEN 3 THEN N'Oil' ELSE N'Gas' END,
  DATEADD(DAY, - (n % 4000), @today),
  CASE n % 20 WHEN 0 THEN N'Shut-In' WHEN 1 THEN N'Drilling' ELSE N'Producing' END
FROM (SELECT TOP (@wellCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
      FROM sys.all_objects a CROSS JOIN sys.all_objects b) N;

DECLARE @wellMax bigint = (SELECT MAX(WellID) FROM oil_n_gas_company.Well);

------------------------------------------------------------
-- 4) DrillingOperation
------------------------------------------------------------
INSERT INTO oil_n_gas_company.DrillingOperation (WellID, StartDate, EndDate, RigName, Status)
SELECT
  ((n-1) % @wellMax) + 1,
  DATEADD(DAY, -((n % 1200) + 10), CAST(@today AS datetime2)),
  CASE WHEN n % 4 = 0 THEN NULL ELSE DATEADD(DAY, -((n % 1200) - (n % 7)), CAST(@today AS datetime2)) END,
  CONCAT(N'Rig-', ((n-1) % 80) + 1),
  CASE n % 3 WHEN 0 THEN N'Planned' WHEN 1 THEN N'Active' ELSE N'Completed' END
FROM (SELECT TOP (@drillOps) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
      FROM sys.all_objects a CROSS JOIN sys.all_objects b) N;

------------------------------------------------------------
-- 5) Production  (composite PK: ProductionID=WellID, per ProductionDate)
--    Only for producing wells; light seasonality by well type
------------------------------------------------------------
INSERT INTO oil_n_gas_company.Production
  (ProductionID, WellID, ProductionDate, Oil_bbl, Gas_mcf, Water_bbl, CreatedAt, CreatedBy)
SELECT
  w.WellID,
  w.WellID,
  DATEADD(DAY, -d, @today) AS ProductionDate,
  CAST(  CASE WHEN w.WellType = N'Oil' THEN 80 + ((w.WellID + d) % 120)
              WHEN w.WellType = N'Gas' THEN 20 + ((w.WellID + d) % 40)
              ELSE 5 + ((w.WellID + d) % 10) END AS decimal(18,2)) AS Oil_bbl,
  CAST(  CASE WHEN w.WellType = N'Gas' THEN 900 + ((w.WellID + d) % 600)
              WHEN w.WellType = N'Oil' THEN 150 + ((w.WellID + d) % 200)
              ELSE 50 + ((w.WellID + d) % 80) END AS decimal(18,2)) AS Gas_mcf,
  CAST(  10 + ((w.WellID + d) % 60) AS decimal(18,2)) AS Water_bbl,
  SYSUTCDATETIME(), SUSER_SNAME()
FROM oil_n_gas_company.Well w
CROSS JOIN (SELECT TOP (@prodDays) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) - 1 AS d
            FROM sys.all_objects) D
WHERE w.Status = N'Producing';

-- Helper index for later queries (optional)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Prod_WellDate_Load' AND object_id=OBJECT_ID('oil_n_gas_company.Production'))
  CREATE INDEX IX_Prod_WellDate_Load ON oil_n_gas_company.Production(WellID, ProductionDate DESC);

------------------------------------------------------------
-- 6) Facility
------------------------------------------------------------
INSERT INTO oil_n_gas_company.Facility (Name, FacilityType, Location)
SELECT
  CONCAT(N'Facility-', n),
  CASE n % 5 WHEN 0 THEN N'Refinery' WHEN 1 THEN N'Terminal'
             WHEN 2 THEN N'Processing' WHEN 3 THEN N'Storage' ELSE N'Export' END,
  CONCAT(N'Area-', ((n-1)%12)+1)
FROM (SELECT TOP (@facilityCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
      FROM sys.all_objects) N;

DECLARE @facMax int = (SELECT MAX(FacilityID) FROM oil_n_gas_company.Facility);

------------------------------------------------------------
-- 7) Product
------------------------------------------------------------
INSERT INTO oil_n_gas_company.Product (Name, APIGravity, SulfurPct)
SELECT
  CASE n
    WHEN 1 THEN N'Gasoline'
    WHEN 2 THEN N'Diesel'
    WHEN 3 THEN N'Jet Fuel'
    WHEN 4 THEN N'LPG'
    WHEN 5 THEN N'Naphtha'
    WHEN 6 THEN N'Fuel Oil'
    WHEN 7 THEN N'Condensate'
    WHEN 8 THEN N'Crude Blend A'
    WHEN 9 THEN N'Crude Blend B'
    ELSE N'Kerosene'
  END,
  CAST(30 + (n % 25) AS decimal(5,2)),
  CAST((n % 30) / 100.0 AS decimal(5,3))
FROM (SELECT TOP (@productCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
      FROM sys.all_objects) N;

DECLARE @prodMax int = (SELECT MAX(ProductID) FROM oil_n_gas_company.Product);

------------------------------------------------------------
-- 8) Inventory (subset of facilities × products × days)
------------------------------------------------------------
;WITH FacPick AS (
  SELECT TOP (@invFacilities) FacilityID, ROW_NUMBER() OVER (ORDER BY FacilityID) AS r
  FROM oil_n_gas_company.Facility ORDER BY FacilityID
),
ProdPick AS (
  SELECT TOP (@invProducts) ProductID, ROW_NUMBER() OVER (ORDER BY ProductID) AS r
  FROM oil_n_gas_company.Product ORDER BY ProductID
)
INSERT INTO oil_n_gas_company.Inventory (FacilityID, ProductID, SnapshotDate, Quantity_bbl)
SELECT
  f.FacilityID,
  p.ProductID,
  DATEADD(DAY, -(d-1), @today) AS SnapshotDate,
  CAST(10000 + ((f.FacilityID * 37 + p.ProductID * 11 + d) % 50000) AS decimal(18,2))
FROM FacPick f
CROSS JOIN ProdPick p
CROSS JOIN (SELECT TOP (@invDays) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS d
            FROM sys.all_objects) D;

------------------------------------------------------------
-- 9) Address
------------------------------------------------------------
INSERT INTO oil_n_gas_company.Address (Street, City, State, ZIP, Country)
SELECT
  CONCAT(N'No.', n, N' Market St'),
  CONCAT(N'City', n % 200),
  CONCAT(N'State', n % 50),
  RIGHT('00000' + CONVERT(varchar(8), 10000 + (n % 90000)), 5),
  N'USA'
FROM (SELECT TOP (@addrCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
      FROM sys.all_objects a CROSS JOIN sys.all_objects b) N;

DECLARE @addrMax int = (SELECT MAX(AddressID) FROM oil_n_gas_company.Address);

------------------------------------------------------------
-- 10) Customer
------------------------------------------------------------
INSERT INTO oil_n_gas_company.Customer (Name, AddressID)
SELECT
  CONCAT(N'Customer-', RIGHT('000000' + CONVERT(varchar(10), n), 6)),
  ((n-1) % @addrMax) + 1
FROM (SELECT TOP (@customerCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
      FROM sys.all_objects a CROSS JOIN sys.all_objects b) N;

DECLARE @custMax int = (SELECT MAX(CustomerID) FROM oil_n_gas_company.Customer);

------------------------------------------------------------
-- 11) Shipment  (composite PK: ShipmentID, ShipDate)
------------------------------------------------------------
INSERT INTO oil_n_gas_company.Shipment
  (ShipmentID, FromFacility, ToCustomer, ProductID, ShipDate, Volume_bbl, RatePerBbl)
SELECT
  5000000 + rn AS ShipmentID,
  ((rn-1) % @facMax) + 1 AS FromFacility,
  ((rn*7-3) % @custMax) + 1 AS ToCustomer,
  ((rn*11-5) % @prodMax) + 1 AS ProductID,
  DATEADD(DAY, -((rn % @shipDays) + 1), @today) AS ShipDate,
  CAST( 100 + (rn % 900) AS decimal(18,2)) AS Volume_bbl,
  CAST( 40 + (rn % 60)  AS decimal(12,4)) AS RatePerBbl
FROM (SELECT TOP (@shipments) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS rn
      FROM sys.all_objects a CROSS JOIN sys.all_objects b) N;

-- Helper index for invoice aggregation (optional)
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_Shp_ToCust_Month' AND object_id=OBJECT_ID('oil_n_gas_company.Shipment'))
  CREATE INDEX IX_Shp_ToCust_Month ON oil_n_gas_company.Shipment(ToCustomer, ShipDate);

------------------------------------------------------------
-- 12) Pipeline
------------------------------------------------------------
INSERT INTO oil_n_gas_company.Pipeline (Name, FromFacility, ToFacility, CapacityBbl)
SELECT
  CONCAT(N'Pipeline-', n),
  ((n*3-1) % @facMax) + 1,
  ((n*5-2) % @facMax) + 1,
  CAST( 50000 + (n % 100000) AS decimal(18,2))
FROM (SELECT TOP (@pipelineCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
      FROM sys.all_objects) N;

DECLARE @pipeMax int = (SELECT MAX(PipelineID) FROM oil_n_gas_company.Pipeline);

------------------------------------------------------------
-- 13) PipelineFlow  (composite PK: FlowID=PipelineID, per day)
------------------------------------------------------------
INSERT INTO oil_n_gas_company.PipelineFlow (FlowID, PipelineID, FlowDate, Volume_bbl)
SELECT
  p.PipelineID,                 -- FlowID
  p.PipelineID,
  DATEADD(DAY, -d, @today) AS FlowDate,
  CAST( 20000 + ((p.PipelineID * 97 + d) % 15000) AS decimal(18,2))
FROM oil_n_gas_company.Pipeline p
CROSS JOIN (SELECT TOP (@flowDays) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) - 1 AS d
            FROM sys.all_objects) D;

------------------------------------------------------------
-- 14) SalesContract
------------------------------------------------------------
INSERT INTO oil_n_gas_company.SalesContract
  (CustomerID, ProductID, StartDate, EndDate, VolumeCommit_bbl, PricePerBbl)
SELECT
  ((n*13-7) % @custMax) + 1,
  ((n*17-9) % @prodMax) + 1,
  DATEADD(DAY, -(n % 700), @today),
  CASE WHEN n % 7 = 0 THEN NULL ELSE DATEADD(DAY, (n % 700), @today) END,
  CAST( 10000 + (n % 90000) AS decimal(18,2)),
  CAST( 45 + (n % 40) AS decimal(12,4))
FROM (SELECT TOP (@contractsCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
      FROM sys.all_objects a CROSS JOIN sys.all_objects b) N;

------------------------------------------------------------
-- 15) Invoice  (composite PK: InvoiceID=CustomerID, by EOMONTH)
--     Build invoices from Shipment totals per customer-month
------------------------------------------------------------
;WITH CustMonth AS (
  SELECT
    s.ToCustomer         AS CustomerID,
    EOMONTH(s.ShipDate)  AS InvoiceDate,
    SUM(CAST(s.Volume_bbl * s.RatePerBbl AS decimal(18,2))) AS AmountDue
  FROM oil_n_gas_company.Shipment s
  GROUP BY s.ToCustomer, EOMONTH(s.ShipDate)
)
INSERT INTO oil_n_gas_company.Invoice (InvoiceID, CustomerID, InvoiceDate, AmountDue, Status)
SELECT
  cm.CustomerID AS InvoiceID,
  cm.CustomerID,
  cm.InvoiceDate,
  cm.AmountDue,
  N'Open'
FROM CustMonth cm;

------------------------------------------------------------
-- 16) Payment  (composite FK: (InvoiceID, InvoiceDate) -> Invoice)
--     Pay ~75% invoices (60% full, 15% partial)
------------------------------------------------------------
;WITH Invoices AS (
  SELECT i.InvoiceID, i.InvoiceDate, i.AmountDue,
         ABS(CHECKSUM(NEWID())) % 100 AS r
  FROM oil_n_gas_company.Invoice i
)
INSERT INTO oil_n_gas_company.Payment
  (InvoiceID, InvoiceDate, PaymentDate, AmountPaid)
SELECT
  inv.InvoiceID,
  inv.InvoiceDate,
  DATEADD(DAY, (inv.InvoiceID % 10) + 2, inv.InvoiceDate),
  CASE
    WHEN inv.r < 60 THEN inv.AmountDue
    WHEN inv.r < 75 THEN CAST(inv.AmountDue * (0.35 + (inv.InvoiceID % 40)/100.0) AS decimal(18,2))
    ELSE NULL
  END
FROM Invoices inv
WHERE inv.r < 75;

------------------------------------------------------------
-- 17) AssetMaintenance — Wells, Pipelines, Facilities
--     Guarantees (AssetType, AssetID, MaintDate) uniqueness
------------------------------------------------------------

-- Wells → AssetType='Well' (about 1–2 per well, capped)
;WITH W AS (
  SELECT WellID, ROW_NUMBER() OVER (ORDER BY WellID) AS r
  FROM oil_n_gas_company.Well
),
E AS (
  SELECT WellID, 1 AS seq FROM W
  UNION ALL
  SELECT WellID, 2 FROM W WHERE (r % 3) = 0
),
Pick AS (
  SELECT TOP (@amWellEvents)
         WellID, seq,
         ROW_NUMBER() OVER (ORDER BY WellID, seq) AS rn
  FROM E
  ORDER BY WellID, seq
)
INSERT INTO oil_n_gas_company.AssetMaintenance
  (AssetType, AssetID, MaintDate, Description, CostUSD)
SELECT
  N'Well',
  p.WellID,
  DATEADD(DAY, -((p.rn % 360) + CASE p.seq WHEN 1 THEN 5 ELSE 12 END), @today),
  CASE (p.WellID + p.seq) % 4
    WHEN 0 THEN N'Inspection'
    WHEN 1 THEN N'Workover / minor repair'
    WHEN 2 THEN N'Preventive maintenance'
    ELSE       N'Pump replacement'
  END,
  CAST( 500 + ((p.WellID * 7 + p.seq * 131 + p.rn) % 9500) AS decimal(18,2))
FROM Pick p;

-- Pipelines → AssetType='Pipeline'
;WITH P AS (
  SELECT PipelineID, ROW_NUMBER() OVER (ORDER BY PipelineID) AS r
  FROM oil_n_gas_company.Pipeline
),
E AS (
  SELECT PipelineID, 1 AS seq FROM P
  UNION ALL
  SELECT PipelineID, 2 FROM P WHERE (r % 2) = 0
),
Pick AS (
  SELECT TOP (@amPipeEvents)
         PipelineID, seq,
         ROW_NUMBER() OVER (ORDER BY PipelineID, seq) AS rn
  FROM E
  ORDER BY PipelineID, seq
)
INSERT INTO oil_n_gas_company.AssetMaintenance
  (AssetType, AssetID, MaintDate, Description, CostUSD)
SELECT
  N'Pipeline',
  p.PipelineID,
  DATEADD(DAY, -((p.rn % 360) + CASE p.seq WHEN 1 THEN 3 ELSE 18 END), @today),
  CASE (p.PipelineID + p.seq) % 4
    WHEN 0 THEN N'Inline inspection (ILI pigging)'
    WHEN 1 THEN N'Corrosion inhibitor dosing'
    WHEN 2 THEN N'Valve service / leak check'
    ELSE       N'Cathodic protection maintenance'
  END,
  CAST( 2000 + ((p.PipelineID * 19 + p.seq * 71 + p.rn) % 28000) AS decimal(18,2))
FROM Pick p;

-- Facilities → AssetType='Facility'
;WITH F AS (
  SELECT FacilityID, ROW_NUMBER() OVER (ORDER BY FacilityID) AS r
  FROM oil_n_gas_company.Facility
),
E AS (
  SELECT FacilityID, 1 AS seq FROM F
  UNION ALL
  SELECT FacilityID, 2 FROM F WHERE (r % 3) = 1
),
Pick AS (
  SELECT TOP (@amFacEvents)
         FacilityID, seq,
         ROW_NUMBER() OVER (ORDER BY FacilityID, seq) AS rn
  FROM E
  ORDER BY FacilityID, seq
)
INSERT INTO oil_n_gas_company.AssetMaintenance
  (AssetType, AssetID, MaintDate, Description, CostUSD)
SELECT
  N'Facility',
  p.FacilityID,
  DATEADD(DAY, -((p.rn % 360) + CASE p.seq WHEN 1 THEN 7 ELSE 21 END), @today),
  CASE (p.FacilityID + p.seq) % 5
    WHEN 0 THEN N'Compressor overhaul'
    WHEN 1 THEN N'Tank integrity inspection'
    WHEN 2 THEN N'Heat exchanger cleaning'
    WHEN 3 THEN N'Electrical systems PM'
    ELSE       N'Fire & safety systems test'
  END,
  CAST( 3000 + ((p.FacilityID * 23 + p.seq * 97 + p.rn) % 45000) AS decimal(18,2))
FROM Pick p;

------------------------------------------------------------
-- 18) Quick counts
------------------------------------------------------------
PRINT '=== BULK LOAD COMPLETE ===';
SELECT
  (SELECT COUNT(*) FROM oil_n_gas_company.Region)            AS RegionCount,
  (SELECT COUNT(*) FROM oil_n_gas_company.Field)             AS FieldCount,
  (SELECT COUNT(*) FROM oil_n_gas_company.Well)              AS WellCount,
  (SELECT COUNT(*) FROM oil_n_gas_company.DrillingOperation) AS DrillingOpCount,
  (SELECT COUNT(*) FROM oil_n_gas_company.Production)        AS ProductionCount,
  (SELECT COUNT(*) FROM oil_n_gas_company.Facility)          AS FacilityCount,
  (SELECT COUNT(*) FROM oil_n_gas_company.Product)           AS ProductCount,
  (SELECT COUNT(*) FROM oil_n_gas_company.Inventory)         AS InventoryCount,
  (SELECT COUNT(*) FROM oil_n_gas_company.Address)           AS AddressCount,
  (SELECT COUNT(*) FROM oil_n_gas_company.Customer)          AS CustomerCount,
  (SELECT COUNT(*) FROM oil_n_gas_company.Shipment)          AS ShipmentCount,
  (SELECT COUNT(*) FROM oil_n_gas_company.Pipeline)          AS PipelineCount,
  (SELECT COUNT(*) FROM oil_n_gas_company.PipelineFlow)      AS PipelineFlowCount,
  (SELECT COUNT(*) FROM oil_n_gas_company.SalesContract)     AS SalesContractCount,
  (SELECT COUNT(*) FROM oil_n_gas_company.Invoice)           AS InvoiceCount,
  (SELECT COUNT(*) FROM oil_n_gas_company.Payment)           AS PaymentCount,
  (SELECT COUNT(*) FROM oil_n_gas_company.AssetMaintenance)  AS AssetMaintenanceCount;
```

## DROP Syntax
```sql
DROP TABLE IF EXISTS oil_n_gas_company.Payment;
DROP TABLE IF EXISTS oil_n_gas_company.AssetMaintenance;

DROP TABLE IF EXISTS oil_n_gas_company.Invoice;
DROP TABLE IF EXISTS oil_n_gas_company.SalesContract;
DROP TABLE IF EXISTS oil_n_gas_company.Shipment;
DROP TABLE IF EXISTS oil_n_gas_company.Inventory;
DROP TABLE IF EXISTS oil_n_gas_company.PipelineFlow;
DROP TABLE IF EXISTS oil_n_gas_company.Production;
DROP TABLE IF EXISTS oil_n_gas_company.DrillingOperation;

DROP TABLE IF EXISTS oil_n_gas_company.Well;
DROP TABLE IF EXISTS oil_n_gas_company.Field;

DROP TABLE IF EXISTS oil_n_gas_company.Customer;
DROP TABLE IF EXISTS oil_n_gas_company.Address;
DROP TABLE IF EXISTS oil_n_gas_company.Pipeline;
DROP TABLE IF EXISTS oil_n_gas_company.Facility;
DROP TABLE IF EXISTS oil_n_gas_company.Product;
DROP TABLE IF EXISTS oil_n_gas_company.Region;

DROP PARTITION SCHEME PS_OilGasYear;
DROP PARTITION FUNCTION PS_OilGasYear;

DROP SCHEMA IF EXISTS oil_n_gas_company;
```

***
### [Assignments](assignments/README.md)
### [Assignments - Solutions](assignments-solutions/README.md)

##### [Back To Contents](../README.md)
***
| &copy; TINITIATE.COM |
|----------------------|
