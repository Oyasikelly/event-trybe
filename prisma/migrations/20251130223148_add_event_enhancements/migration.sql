/*
  Warnings:

  - The `category` column on the `events` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[slug]` on the table `events` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ticket_number]` on the table `registrations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('IN_PERSON', 'VIRTUAL', 'HYBRID');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('CONFERENCE', 'WORKSHOP', 'SEMINAR', 'MEETUP', 'WEBINAR', 'NETWORKING', 'SOCIAL', 'SPORTS', 'MUSIC', 'ART', 'TECH', 'BUSINESS', 'EDUCATION', 'OTHER');

-- AlterTable - Add new columns to events
ALTER TABLE "events" ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "event_type" "EventType" NOT NULL DEFAULT 'IN_PERSON',
ADD COLUMN     "is_free" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "location_city" TEXT,
ADD COLUMN     "location_country" TEXT,
ADD COLUMN     "location_state" TEXT,
ADD COLUMN     "location_venue" TEXT,
ADD COLUMN     "price" DECIMAL(10,2),
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "view_count" INTEGER NOT NULL DEFAULT 0;

-- Add slug column with temporary nullable
ALTER TABLE "events" ADD COLUMN "slug" TEXT;

-- Generate slugs for existing events (if any)
UPDATE "events" SET "slug" = LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || SUBSTRING(id FROM 1 FOR 8) WHERE "slug" IS NULL;

-- Make slug NOT NULL after data migration
ALTER TABLE "events" ALTER COLUMN "slug" SET NOT NULL;

-- Handle category column
ALTER TABLE "events" DROP COLUMN "category";
ALTER TABLE "events" ADD COLUMN "category" "EventCategory";

-- AlterTable - Add new columns to registrations
ALTER TABLE "registrations" ADD COLUMN     "amount_paid" DECIMAL(10,2),
ADD COLUMN     "checked_in" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "checked_in_at" TIMESTAMP(3),
ADD COLUMN     "payment_id" TEXT,
ADD COLUMN     "payment_status" TEXT,
ADD COLUMN     "qr_code" TEXT;

-- Add ticket_number column with temporary nullable
ALTER TABLE "registrations" ADD COLUMN "ticket_number" TEXT;

-- Generate ticket numbers for existing registrations (if any)
UPDATE "registrations" SET "ticket_number" = 'TKT-' || UPPER(SUBSTRING(id FROM 1 FOR 12)) WHERE "ticket_number" IS NULL;

-- Make ticket_number NOT NULL after data migration
ALTER TABLE "registrations" ALTER COLUMN "ticket_number" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE INDEX "events_slug_idx" ON "events"("slug");

-- CreateIndex
CREATE INDEX "events_category_idx" ON "events"("category");

-- CreateIndex
CREATE INDEX "events_event_type_idx" ON "events"("event_type");

-- CreateIndex
CREATE UNIQUE INDEX "registrations_ticket_number_key" ON "registrations"("ticket_number");

-- CreateIndex
CREATE INDEX "registrations_ticket_number_idx" ON "registrations"("ticket_number");
