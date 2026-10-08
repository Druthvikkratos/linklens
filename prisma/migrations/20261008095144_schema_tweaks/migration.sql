/*
  Warnings:

  - The primary key for the `links` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `links` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `link_id` on the `clicks` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "clicks" DROP CONSTRAINT "clicks_link_id_fkey";

-- AlterTable
ALTER TABLE "clicks" ALTER COLUMN "browser" DROP NOT NULL,
ALTER COLUMN "os" DROP NOT NULL,
ALTER COLUMN "device" DROP NOT NULL,
DROP COLUMN "link_id",
ADD COLUMN     "link_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "links" DROP CONSTRAINT "links_pkey",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "links_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "clicks_link_id_created_at_idx" ON "clicks"("link_id", "created_at");

-- CreateIndex
CREATE INDEX "links_user_id_idx" ON "links"("user_id");

-- AddForeignKey
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_link_id_fkey" FOREIGN KEY ("link_id") REFERENCES "links"("id") ON DELETE CASCADE ON UPDATE CASCADE;
