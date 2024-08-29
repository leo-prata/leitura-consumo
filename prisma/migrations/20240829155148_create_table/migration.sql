/*
  Warnings:

  - Added the required column `measureValue` to the `measures` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "measures" ADD COLUMN     "measureValue" DOUBLE PRECISION NOT NULL;
