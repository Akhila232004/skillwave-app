/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server Tutorial
*  Description  : Database, Schema, and User
*  Author       : Team Tinitiate
*******************************************************************************/



-- DATABASE:
-- Create database tinitiate
CREATE DATABASE tinitiate;
-- SQL Server commands are generally case-insensitive
-- We can use uppercase or lowercase or mix of both for commands
-- But for best practice stick to any one format



-- USER:
-- Step 1:
-- Use the Database where you want to create the USER
USE tinitiate;

-- Step 2:
-- Enable contained database authentication
EXEC sp_configure 'contained database authentication', 1;

-- Step 3:
-- Reconfigure the database to apply the configuration change
RECONFIGURE;

-- Step 4:
-- Set the database containment to partial to allow contained database users
ALTER DATABASE [tinitiate] SET CONTAINMENT = PARTIAL;

-- Step 5:
-- Create a user named 'tiuser' with the password 'Tinitiate!23'
CREATE USER tiuser WITH PASSWORD = 'Tinitiate!23';
-- Create a user named 'developer' with the password 'Tinitiate!23'
CREATE USER developer WITH PASSWORD = 'Tinitiate!23';



-- SCHEMA:
-- Use the Database where you want to create the SCHEMA
USE tinitiate;

-- Create the schema
CREATE SCHEMA employees AUTHORIZATION dbo;
-- Here schema is created with the authorization set to database owner(dbo).
-- We can create schema without authorization also, 'CREATE SCHEMA employees;'

-- Change the authorization of the schema to tiuser
ALTER AUTHORIZATION ON SCHEMA::employees TO tiuser;
