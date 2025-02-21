/*
  Warnings:

  - Changed the type of `category` on the `Catalogue` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `status` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('APPROVED', 'REJECTED', 'PENDING');

-- CreateEnum
CREATE TYPE "CategoryEnum" AS ENUM ('SPORTS', 'FINANCE', 'HISTORY', 'GEOGRAPHY');

-- AlterTable
ALTER TABLE "Catalogue" DROP COLUMN "category",
ADD COLUMN     "category" "CategoryEnum" NOT NULL;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "status" "QuestionStatus" NOT NULL;
