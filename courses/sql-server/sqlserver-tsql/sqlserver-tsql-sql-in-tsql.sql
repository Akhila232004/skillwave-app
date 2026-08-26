/*******************************************************************************
*  Organization : TINITIATE TECHNOLOGIES PVT LTD
*  Website      : tinitiate.com
*  Script Title : SQL Server - TSQL Tutorial
*  Description  : SQL in TSQL
*  Author       : Team Tinitiate
*******************************************************************************/



-- Embedding SQL in TSQL
BEGIN
    -- Data Input Variables
    -- -------------------------------------------------
    DECLARE @l_in_product_id INT = 6;
    DECLARE @l_in_product_category VARCHAR(100) = 'kitchen';
    DECLARE @l_in_product_name VARCHAR(25) = 'Milk';
    DECLARE @l_in_product_unit_price DECIMAL = 1.17;

    -- Code Variables
    -- -------------------------------------------------
    DECLARE @l_product_id INT
    DECLARE @product_count INT

    -- -------------------------------------------------
    -- DQL
    -- -------------------------------------------------
    -- 1. SQL Select: Get product count and print it
    -- -------------------------------------------------
    SELECT @product_count = COUNT(*) 
    FROM  tinitiate.invoicing.products;

    PRINT CONCAT('Number of Products: ',@product_count)

    -- -------------------------------------------------
    -- DML
    -- -------------------------------------------------
    -- 1. Insert product data if that product is missing
    -- 2. Update the Column values if supplied input PK exists
    -- -------------------------------------------------
    SELECT @l_product_id = product_id
    FROM   tinitiate.invoicing.products
    WHERE   product_id = @l_in_product_id;

    SELECT @product_count = COUNT(*)
    FROM   tinitiate.invoicing.products
    WHERE   product_id = @l_in_product_id;

    IF @l_product_id IS NULL
        BEGIN
            PRINT CONCAT('Product: ',@l_in_product_id,' doesnt exists, Adding it NOW!')

            INSERT INTO tinitiate.invoicing.products
            VALUES ( @l_in_product_id
                    ,@l_in_product_category
                    ,@l_in_product_name
                    ,@l_in_product_unit_price);

            PRINT CONCAT('Rows Inserted ',@@rowcount)                         
        END
    ELSE
        BEGIN
            PRINT CONCAT('Product: ',@l_in_product_id,' exists!, Updating the new values')
    
            UPDATE tinitiate.invoicing.products
            SET    product_category   = @l_in_product_category
                  ,product_name       = @l_in_product_name
                  ,product_unit_price = @l_in_product_unit_price
            WHERE  product_id = @l_in_product_id;
        END
END;

-- Test Query
SELECT * FROM tinitiate.invoicing.products;
