-- AlterTable
ALTER TABLE `fridgeproducts` ADD COLUMN `productid` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `productname` VARCHAR(191) NOT NULL DEFAULT 'EMPTY',
    ADD COLUMN `secamount` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `secprice` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `secreturn` DOUBLE NOT NULL DEFAULT 0,
    ADD COLUMN `sectotal` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `inventoryproducts` ADD COLUMN `famount` DOUBLE NOT NULL DEFAULT 0;