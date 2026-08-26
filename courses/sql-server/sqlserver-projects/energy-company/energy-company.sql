/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server Tutorial
*  Description  : Energy Company Data Model
*  Author       : Team Tinitiate
*******************************************************************************/



-- DDL Syntax:
-- Create 'energy_company' schema
CREATE SCHEMA energy_company;

-- Create 'PS_EnergyYear' partition scheme
IF NOT EXISTS (SELECT 1 FROM sys.partition_functions WHERE name = 'PS_EnergyYear')
BEGIN
  EXEC('CREATE PARTITION FUNCTION PS_EnergyYear (date)
        AS RANGE RIGHT FOR VALUES (''2023-01-01'',''2024-01-01'',''2025-01-01'',''2026-01-01'',''2027-01-01'');');
END;
IF NOT EXISTS (SELECT 1 FROM sys.partition_schemes WHERE name = 'PS_EnergyYear')
BEGIN
  EXEC('CREATE PARTITION SCHEME PS_EnergyYear
        AS PARTITION PS_EnergyYear
        ALL TO ([PRIMARY]);');
END;

-- Create 'Address' table
CREATE TABLE energy_company.Address
(
  AddressID   INT           IDENTITY(1,1),
  Street      NVARCHAR(150) NOT NULL,
  City        NVARCHAR(50)  NOT NULL,
  State       NVARCHAR(50)  NOT NULL,
  ZIP         NVARCHAR(15)  NOT NULL,
  Country     NVARCHAR(50)  NOT NULL
);
ALTER TABLE energy_company.Address
ADD CONSTRAINT PK_Address PRIMARY KEY CLUSTERED (AddressID);

-- Create 'Customer' table
CREATE TABLE energy_company.Customer
(
  CustomerID    INT           IDENTITY(1,1),
  FirstName     NVARCHAR(50)  NOT NULL,
  LastName      NVARCHAR(50)  NOT NULL,
  Email         VARCHAR(100)  NULL,
  Phone         VARCHAR(20)   NULL,
  AddressID     INT           NULL,
  CreatedAt     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
  CreatedBy     SYSNAME       NOT NULL DEFAULT SUSER_SNAME(),
  UpdatedAt     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
  UpdatedBy     SYSNAME       NOT NULL DEFAULT SUSER_SNAME()
);
ALTER TABLE energy_company.Customer
ADD CONSTRAINT PK_Customer PRIMARY KEY CLUSTERED (CustomerID);
ALTER TABLE energy_company.Customer
ADD CONSTRAINT FK_Cust_Address
FOREIGN KEY (AddressID) REFERENCES energy_company.Address(AddressID);

-- Create 'Department' table
CREATE TABLE energy_company.Department
(
  DepartmentID  INT           IDENTITY(1,1),
  Name          NVARCHAR(100) NOT NULL
);
ALTER TABLE energy_company.Department
ADD CONSTRAINT PK_Department PRIMARY KEY CLUSTERED (DepartmentID);

-- Create 'Facility' table
CREATE TABLE energy_company.Facility
(
  FacilityID    INT           IDENTITY(1,1),
  Name          NVARCHAR(150) NOT NULL,
  Location      NVARCHAR(100) NULL,
  DepartmentID  INT           NULL,
  CreatedAt     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
  CreatedBy     SYSNAME       NOT NULL DEFAULT SUSER_SNAME(),
  UpdatedAt     DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
  UpdatedBy     SYSNAME       NOT NULL DEFAULT SUSER_SNAME()
);
ALTER TABLE energy_company.Facility
ADD CONSTRAINT PK_Facility PRIMARY KEY CLUSTERED (FacilityID);
ALTER TABLE energy_company.Facility
ADD CONSTRAINT FK_Fac_Department
FOREIGN KEY (DepartmentID) REFERENCES energy_company.Department(DepartmentID);

-- Create 'AssetType' table
CREATE TABLE energy_company.AssetType
(
  AssetTypeID   INT           IDENTITY(1,1),
  Name          NVARCHAR(100) NOT NULL,
  Description   NVARCHAR(255) NULL
);
ALTER TABLE energy_company.AssetType
ADD CONSTRAINT PK_AssetType PRIMARY KEY CLUSTERED (AssetTypeID);

-- Create 'Asset' table
CREATE TABLE energy_company.Asset
(
  AssetID         BIGINT       IDENTITY(1,1),
  FacilityID      INT          NOT NULL,
  AssetTypeID     INT          NOT NULL,
  Name            NVARCHAR(150) NOT NULL,
  CommissionDate  DATE         NULL,
  Status          NVARCHAR(50)  NOT NULL DEFAULT 'Active',
  CapacityMW      DECIMAL(10,2) NULL,
  CreatedAt       DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
  CreatedBy       SYSNAME       NOT NULL DEFAULT SUSER_SNAME(),
  UpdatedAt       DATETIME2     NOT NULL DEFAULT SYSUTCDATETIME(),
  UpdatedBy       SYSNAME       NOT NULL DEFAULT SUSER_SNAME()
);
ALTER TABLE energy_company.Asset
ADD CONSTRAINT PK_Asset PRIMARY KEY CLUSTERED (AssetID);
ALTER TABLE energy_company.Asset
ADD CONSTRAINT FK_Asset_Facility
FOREIGN KEY (FacilityID) REFERENCES energy_company.Facility(FacilityID);
ALTER TABLE energy_company.Asset
ADD CONSTRAINT FK_Asset_Type
FOREIGN KEY (AssetTypeID) REFERENCES energy_company.AssetType(AssetTypeID);
-- Create an index for 'Asset' table
CREATE INDEX IX_Asset_Status
ON energy_company.Asset(Status)
INCLUDE (CommissionDate, CapacityMW);

-- Create 'EnergyProduction' table
CREATE TABLE energy_company.EnergyProduction
(
  ProductionID     BIGINT       NOT NULL,
  AssetID          BIGINT       NOT NULL,
  ProductionDate   DATE         NOT NULL,
  EnergyMWh        DECIMAL(18,4)NOT NULL,
  CreatedAt        DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME(),
  CreatedBy        SYSNAME      NOT NULL DEFAULT SUSER_SNAME()
);
ALTER TABLE energy_company.EnergyProduction
ADD CONSTRAINT PK_EnergyProduction PRIMARY KEY CLUSTERED (ProductionID, ProductionDate)
ON PS_EnergyYear(ProductionDate);
ALTER TABLE energy_company.EnergyProduction
ADD CONSTRAINT FK_EP_Asset
FOREIGN KEY (AssetID) REFERENCES energy_company.Asset(AssetID);
-- Create an index for 'EnergyProduction' table
CREATE INDEX IX_EP_AssetDate
ON energy_company.EnergyProduction(AssetID, ProductionDate DESC);

-- Create 'Meter' table
CREATE TABLE energy_company.Meter
(
  MeterID          BIGINT       IDENTITY(1,1),
  CustomerID       INT          NOT NULL,
  InstallationDate DATE         NOT NULL,
  MeterType        NVARCHAR(50) NULL,
  SerialNumber     VARCHAR(50)  NULL UNIQUE,
  Status           NVARCHAR(50) NOT NULL DEFAULT 'Active',
  CreatedAt        DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME(),
  CreatedBy        SYSNAME      NOT NULL DEFAULT SUSER_SNAME(),
  UpdatedAt        DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME(),
  UpdatedBy        SYSNAME      NOT NULL DEFAULT SUSER_SNAME()
);
ALTER TABLE energy_company.Meter
ADD CONSTRAINT PK_Meter PRIMARY KEY CLUSTERED (MeterID);
ALTER TABLE energy_company.Meter
ADD CONSTRAINT FK_Meter_Cust
FOREIGN KEY (CustomerID) REFERENCES energy_company.Customer(CustomerID);

-- Create 'MeterReading' table
CREATE TABLE energy_company.MeterReading
(
  ReadingID       BIGINT       NOT NULL,
  MeterID         BIGINT       NOT NULL,
  ReadDate        DATE         NOT NULL,
  Consumption_kWh DECIMAL(18,4)NOT NULL,
  CreatedAt       DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME(),
  CreatedBy       SYSNAME      NOT NULL DEFAULT SUSER_SNAME()
);
ALTER TABLE energy_company.MeterReading
ADD CONSTRAINT PK_MeterReading PRIMARY KEY CLUSTERED (ReadingID, ReadDate)
ON PS_EnergyYear(ReadDate);
ALTER TABLE energy_company.MeterReading
ADD CONSTRAINT FK_MR_Meter
FOREIGN KEY (MeterID) REFERENCES energy_company.Meter(MeterID);
-- Create an index for 'MeterReading' table
CREATE INDEX IX_MR_MeterDate
ON energy_company.MeterReading(MeterID, ReadDate DESC);

-- Create 'RatePlan' table
CREATE TABLE energy_company.RatePlan
(
  RatePlanID     INT           IDENTITY(1,1),
  Name           NVARCHAR(100) NOT NULL,
  Description    NVARCHAR(255) NULL,
  PricePerkWh    DECIMAL(10,4) NOT NULL,
  EffectiveDate  DATE         NOT NULL,
  ExpirationDate DATE         NULL
);
ALTER TABLE energy_company.RatePlan
ADD CONSTRAINT PK_RatePlan PRIMARY KEY CLUSTERED (RatePlanID);
-- Create an index for 'RatePlan' table
CREATE INDEX IX_RatePlan_Eff
ON energy_company.RatePlan(EffectiveDate, ExpirationDate);

-- Create 'EnergySale' table
CREATE TABLE energy_company.EnergySale
(
  SaleID         BIGINT       NOT NULL,
  CustomerID     INT          NOT NULL,
  RatePlanID     INT          NOT NULL,
  SaleDate       DATE         NOT NULL,
  kWhSold        DECIMAL(18,4)NOT NULL,
  TotalCharge    DECIMAL(18,2)NOT NULL,
  CreatedAt      DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME(),
  CreatedBy      SYSNAME      NOT NULL DEFAULT SUSER_SNAME()
);
ALTER TABLE energy_company.EnergySale
ADD CONSTRAINT PK_EnergySale PRIMARY KEY CLUSTERED (SaleID, SaleDate)
ON PS_EnergyYear(SaleDate);
ALTER TABLE energy_company.EnergySale
ADD CONSTRAINT FK_ES_Cust
FOREIGN KEY (CustomerID) REFERENCES energy_company.Customer(CustomerID);
ALTER TABLE energy_company.EnergySale
ADD CONSTRAINT FK_ES_Rate
FOREIGN KEY (RatePlanID) REFERENCES energy_company.RatePlan(RatePlanID);
-- Create an index for 'EnergySale' table
CREATE INDEX IX_ES_CustDate
ON energy_company.EnergySale(CustomerID, SaleDate DESC);

-- Create 'Invoice' table
CREATE TABLE energy_company.Invoice
(
  InvoiceID      BIGINT       NOT NULL,
  CustomerID     INT          NOT NULL,
  SaleID         BIGINT       NOT NULL,
  SaleDate       DATE         NOT NULL,
  InvoiceDate    DATE         NOT NULL,
  DueDate        DATE         NOT NULL,
  AmountDue      DECIMAL(18,2)NOT NULL,
  Status         NVARCHAR(20) NOT NULL DEFAULT 'Open',
  CreatedAt      DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME(),
  CreatedBy      SYSNAME      NOT NULL DEFAULT SUSER_SNAME()
);
ALTER TABLE energy_company.Invoice
ADD CONSTRAINT PK_Invoice PRIMARY KEY CLUSTERED (InvoiceID, InvoiceDate)
ON PS_EnergyYear(InvoiceDate);
ALTER TABLE energy_company.Invoice
ADD CONSTRAINT FK_Inv_Cust
FOREIGN KEY (CustomerID) REFERENCES energy_company.Customer(CustomerID);
ALTER TABLE energy_company.Invoice
ADD CONSTRAINT FK_Inv_Sale
FOREIGN KEY (SaleID, SaleDate) REFERENCES energy_company.EnergySale(SaleID, SaleDate);
-- Create an index for 'Invoice' table
CREATE INDEX IX_Inv_Status
ON energy_company.Invoice(Status)
INCLUDE (DueDate, AmountDue);

-- Create 'Payment' table
CREATE TABLE energy_company.Payment
(
  PaymentID      BIGINT       IDENTITY(1,1),
  InvoiceID      BIGINT       NOT NULL,
  InvoiceDate    DATE         NOT NULL,
  PaymentDate    DATE         NOT NULL,
  AmountPaid     DECIMAL(18,2)NOT NULL,
  PaymentMethod  NVARCHAR(50) NULL,
  CheckRef       VARCHAR(50)  NULL,
  CreatedAt      DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME(),
  CreatedBy      SYSNAME      NOT NULL DEFAULT SUSER_SNAME()
);
ALTER TABLE energy_company.Payment
ADD CONSTRAINT PK_Payment PRIMARY KEY CLUSTERED (PaymentID);
ALTER TABLE energy_company.Payment
ADD CONSTRAINT FK_Pmt_Inv
FOREIGN KEY (InvoiceID, InvoiceDate) REFERENCES energy_company.Invoice(InvoiceID, InvoiceDate);

-- Create 'AssetMaintenance' table
CREATE TABLE energy_company.AssetMaintenance
(
  MaintenanceID   BIGINT       IDENTITY(1,1),
  AssetID         BIGINT       NOT NULL,
  MaintenanceDate DATE         NOT NULL,
  Description     NVARCHAR(255) NULL,
  CostUSD         DECIMAL(18,2) NOT NULL,
  PerformedBy     INT          NULL,  -- could FK to a Staff table
  CreatedAt       DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME(),
  CreatedBy       SYSNAME      NOT NULL DEFAULT SUSER_SNAME(),
  UpdatedAt       DATETIME2    NOT NULL DEFAULT SYSUTCDATETIME(),
  UpdatedBy       SYSNAME      NOT NULL DEFAULT SUSER_SNAME()
);
ALTER TABLE energy_company.AssetMaintenance
ADD CONSTRAINT PK_AssetMaintenance PRIMARY KEY CLUSTERED (MaintenanceID);
ALTER TABLE energy_company.AssetMaintenance
ADD CONSTRAINT FK_AM_Asset
FOREIGN KEY (AssetID) REFERENCES energy_company.Asset(AssetID);
-- Create an index for 'AssetMaintenance' table
CREATE INDEX IX_AM_AssetDate
ON energy_company.AssetMaintenance(AssetID, MaintenanceDate DESC);



-- DML Syntax:
/* ===================================================================
   ENERGY COMPANY – BULK DATA GENERATOR (inline generators)
   Prereq: Tables + PF_EnergyYear/PS_EnergyYear already exist.
   ===================================================================*/
SET NOCOUNT ON;

/* ===================================================================
   Tunables
   ===================================================================*/
DECLARE 
  @addrCount        int = 100,
  @customerCount    int = 500,
  @deptCount        int = 6,
  @facilityCount    int = 20,
  @assetTypeCount   int = 8,
  @assetCount       int = 120,
  @ratePlanCount    int = 3,
  @daysProd         int = 90,
  @daysMeter        int = 180,
  @monthsSales      int = 6,
  @maintEvents      int = 100;

DECLARE 
  @startDate date = '2025-07-01',
  @endDate   date = '2025-07-31';

/* ===================================================================
   1) Address
   ===================================================================*/
INSERT INTO energy_company.Address (Street, City, State, ZIP, Country)
SELECT 
  CONCAT('No.', N.n, ' Main St'),
  CONCAT('City', N.n % 50),
  CONCAT('State', N.n % 20),
  CONCAT('Z', RIGHT('00000'+CONVERT(varchar(8), 10000 + (N.n%90000)), 5)),
  'USA'
FROM (
  SELECT TOP (@addrCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
  FROM sys.all_objects
) AS N;

DECLARE @addrMax int = (SELECT MAX(AddressID) FROM energy_company.Address);

/* ===================================================================
   2) Customer
   ===================================================================*/
INSERT INTO energy_company.Customer (FirstName, LastName, Email, Phone, AddressID)
SELECT
  CONCAT('First', N.n),
  CONCAT('Last',  N.n),
  CONCAT('cust', N.n, '@example.com'),
  CONCAT('+1-555-', RIGHT('0000'+CONVERT(varchar(10), 2000+(N.n%8000)),4)),
  ((N.n-1)%@addrMax)+1
FROM (
  SELECT TOP (@customerCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
  FROM sys.all_objects
) AS N;

/* ===================================================================
   3) Department
   ===================================================================*/
INSERT INTO energy_company.Department (Name)
VALUES (N'Generation'), (N'Transmission'), (N'Distribution'),
       (N'Maintenance'), (N'Finance'), (N'IT');

/* ===================================================================
   4) Facility
   ===================================================================*/
INSERT INTO energy_company.Facility (Name, Location, DepartmentID)
SELECT
  CONCAT('Facility-', N.n),
  CONCAT('Zone-', (N.n%5)+1),
  ((N.n-1)%@deptCount)+1
FROM (
  SELECT TOP (@facilityCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
  FROM sys.all_objects
) AS N;

/* ===================================================================
   5) AssetType
   ===================================================================*/
INSERT INTO energy_company.AssetType (Name, Description)
VALUES 
  (N'Gas Turbine', N'Natural gas-fired turbine'),
  (N'Steam Turbine', N'Steam cycle turbine'),
  (N'Wind Turbine', N'Onshore wind unit'),
  (N'Solar PV Array', N'Photovoltaic array'),
  (N'Hydro Turbine', N'Run-of-river hydro'),
  (N'Battery Storage', N'Lithium-ion BESS'),
  (N'Transformer', N'High-voltage transformer'),
  (N'Boiler', N'Industrial boiler');

DECLARE @facMax int = (SELECT MAX(FacilityID) FROM energy_company.Facility);
DECLARE @atypeMax int = (SELECT MAX(AssetTypeID) FROM energy_company.AssetType);

/* ===================================================================
   6) Asset
   ===================================================================*/
INSERT INTO energy_company.Asset (FacilityID, AssetTypeID, Name, CommissionDate, Status, CapacityMW)
SELECT
  ((N.n-1)%@facMax)+1,
  ((N.n-1)%@atypeMax)+1,
  CONCAT('Asset-', N.n),
  DATEADD(DAY, -((N.n%3650)+30), @endDate),
  CASE N.n%20 WHEN 0 THEN 'Retired' WHEN 1 THEN 'Maintenance' ELSE 'Active' END,
  CAST(50 + (N.n%450) AS decimal(10,2))
FROM (
  SELECT TOP (@assetCount) ROW_NUMBER() OVER (ORDER BY (SELECT NULL)) AS n
  FROM sys.all_objects
) AS N;

DECLARE @assetMax int = (SELECT MAX(AssetID) FROM energy_company.Asset);

/* ===================================================================
   7) EnergyProduction (generation assets × days)
   ===================================================================*/
INSERT INTO energy_company.EnergyProduction (ProductionID, AssetID, ProductionDate, EnergyMWh)
SELECT
  A.AssetID,
  A.AssetID,
  DATEADD(DAY, -D.d, @endDate),
  CAST(50 + ((A.AssetID+D.d)%500) AS decimal(18,4))
FROM (
  SELECT AssetID FROM energy_company.Asset WHERE AssetTypeID <= 5 AND Status <> 'Retired'
) AS A
CROSS JOIN (
  SELECT TOP (@daysProd) ROW_NUMBER() OVER (ORDER BY (SELECT NULL))-1 AS d
  FROM sys.all_objects
) AS D;

/* ===================================================================
   8) Meter (one per customer)
   ===================================================================*/
INSERT INTO energy_company.Meter (CustomerID, InstallationDate, MeterType, SerialNumber, Status)
SELECT
  C.CustomerID,
  DATEADD(DAY, -((C.CustomerID%2000)+30), @endDate),
  CASE C.CustomerID%3 WHEN 0 THEN 'Smart' ELSE 'Basic' END,
  CONCAT('SN', RIGHT('0000000'+CONVERT(varchar(10), C.CustomerID), 7)),
  'Active'
FROM energy_company.Customer C;

DECLARE @meterMax int = (SELECT MAX(MeterID) FROM energy_company.Meter);

/* ===================================================================
   9) MeterReading (meter × days)
   ===================================================================*/
INSERT INTO energy_company.MeterReading (ReadingID, MeterID, ReadDate, Consumption_kWh)
SELECT
  M.MeterID,
  M.MeterID,
  DATEADD(DAY, -D.d, @endDate),
  CAST(10 + ((M.MeterID+D.d)%900) AS decimal(18,4))
FROM energy_company.Meter M
CROSS JOIN (
  SELECT TOP (@daysMeter) ROW_NUMBER() OVER (ORDER BY (SELECT NULL))-1 AS d
  FROM sys.all_objects
) AS D;

/* ===================================================================
   10) RatePlan
   ===================================================================*/
INSERT INTO energy_company.RatePlan (Name, Description, PricePerkWh, EffectiveDate, ExpirationDate)
VALUES
  ('Home Saver 2024', 'All customers, 2024 pricing', 0.0950, '2024-01-01', '2024-12-31'),
  ('Standard 2025 H1', 'Jan–Jun 2025',               0.1025, '2025-01-01', '2025-06-30'),
  ('Standard 2025 H2', 'Jul 2025 onwards',           0.1080, '2025-07-01', NULL);

DECLARE @rpMax int = (SELECT MAX(RatePlanID) FROM energy_company.RatePlan);

/* ===================================================================
   11) EnergySale
   ===================================================================*/
INSERT INTO energy_company.EnergySale (SaleID, CustomerID, RatePlanID, SaleDate, kWhSold, TotalCharge)
SELECT
  C.CustomerID,
  C.CustomerID,
  ((C.CustomerID + M.m) % @rpMax) + 1,
  EOMONTH(DATEADD(MONTH, -M.m, @endDate)),
  CAST(300 + ((C.CustomerID+M.m)%700) AS decimal(18,4)),
  CAST((300 + ((C.CustomerID+M.m)%700)) * 0.10 AS decimal(18,2))
FROM energy_company.Customer C
CROSS JOIN (
  SELECT TOP (@monthsSales) ROW_NUMBER() OVER (ORDER BY (SELECT NULL))-1 AS m
  FROM sys.all_objects
) AS M;

DECLARE @saleMax int = (SELECT COUNT(*) FROM energy_company.EnergySale);

/* ===================================================================
   12) Invoice (matches sale)
   ===================================================================*/
INSERT INTO energy_company.Invoice (InvoiceID, CustomerID, SaleID, SaleDate, InvoiceDate, DueDate, AmountDue, Status)
SELECT
  S.SaleID,
  S.CustomerID,
  S.SaleID,
  S.SaleDate,
  DATEADD(DAY, 1, S.SaleDate),
  DATEADD(DAY, 30, S.SaleDate),
  S.TotalCharge,
  'Open'
FROM energy_company.EnergySale S;

/* ===================================================================
   13) Payment (70% invoices get paid)
   ===================================================================*/
INSERT INTO energy_company.Payment (InvoiceID, InvoiceDate, PaymentDate, AmountPaid, PaymentMethod, CheckRef)
SELECT
  I.InvoiceID,
  I.InvoiceDate,
  DATEADD(DAY, ((I.InvoiceID)%10)+2, I.InvoiceDate),
  I.AmountDue,
  CASE I.InvoiceID%3 WHEN 0 THEN 'Check' WHEN 1 THEN 'Card' ELSE 'ACH' END,
  CASE I.InvoiceID%3 WHEN 0 THEN CONCAT('CHK', RIGHT('000000'+CONVERT(varchar(10), I.InvoiceID), 6)) ELSE NULL END
FROM energy_company.Invoice I
WHERE I.InvoiceID%4 <> 0;

/* ===================================================================
   14) AssetMaintenance
   ===================================================================*/
INSERT INTO energy_company.AssetMaintenance (AssetID, MaintenanceDate, Description, CostUSD, PerformedBy)
SELECT
  A.AssetID,
  DATEADD(DAY, -((A.AssetID%365)+1), @endDate),
  CASE A.AssetID%4 WHEN 0 THEN 'Inspection' WHEN 1 THEN 'Preventive' WHEN 2 THEN 'Repair' ELSE 'Overhaul' END,
  CAST(200 + ((A.AssetID%1000)) AS decimal(18,2)),
  NULL
FROM energy_company.Asset A
WHERE A.Status <> 'Retired'
  AND A.AssetID <= @maintEvents;

PRINT '=== BULK LOAD COMPLETE ===';
SELECT 
  (SELECT COUNT(*) FROM energy_company.Address) AS AddressCount,
  (SELECT COUNT(*) FROM energy_company.Customer) AS CustomerCount,
  (SELECT COUNT(*) FROM energy_company.Department) AS DepartmentCount,
  (SELECT COUNT(*) FROM energy_company.Facility) AS FacilityCount,
  (SELECT COUNT(*) FROM energy_company.AssetType) AS AssetTypeCount,
  (SELECT COUNT(*) FROM energy_company.Asset) AS AssetCount,
  (SELECT COUNT(*) FROM energy_company.EnergyProduction) AS EnergyProductionCount,
  (SELECT COUNT(*) FROM energy_company.Meter) AS MeterCount,
  (SELECT COUNT(*) FROM energy_company.MeterReading) AS MeterReadingCount,
  (SELECT COUNT(*) FROM energy_company.RatePlan) AS RatePlanCount,
  (SELECT COUNT(*) FROM energy_company.EnergySale) AS EnergySaleCount,
  (SELECT COUNT(*) FROM energy_company.Invoice) AS InvoiceCount,
  (SELECT COUNT(*) FROM energy_company.Payment) AS PaymentCount,
  (SELECT COUNT(*) FROM energy_company.AssetMaintenance) AS AssetMaintenanceCount;



-- DROP Syntax:
DROP TABLE IF EXISTS energy_company.Payment;
DROP TABLE IF EXISTS energy_company.AssetMaintenance;

DROP TABLE IF EXISTS energy_company.Invoice;
DROP TABLE IF EXISTS energy_company.EnergySale;
DROP TABLE IF EXISTS energy_company.MeterReading;
DROP TABLE IF EXISTS energy_company.EnergyProduction;

DROP TABLE IF EXISTS energy_company.Meter;
DROP TABLE IF EXISTS energy_company.Asset;
DROP TABLE IF EXISTS energy_company.RatePlan;

DROP TABLE IF EXISTS energy_company.Facility;
DROP TABLE IF EXISTS energy_company.AssetType;
DROP TABLE IF EXISTS energy_company.Customer;

DROP TABLE IF EXISTS energy_company.Department;
DROP TABLE IF EXISTS energy_company.Address;

DROP PARTITION SCHEME PS_EnergyYear;
DROP PARTITION FUNCTION PS_EnergyYear;

DROP SCHEMA IF EXISTS energy_company;
