-- AlterTable
ALTER TABLE "users" ADD COLUMN     "deactivated_at" TIMESTAMP(3),
ADD COLUMN     "email_notifications" JSONB NOT NULL DEFAULT '{"registrationConfirmation":true,"eventReminders":true,"eventUpdates":true,"approvalStatus":true,"newRegistrations":true,"eventCancellations":true,"marketing":false}',
ADD COLUMN     "profile_visibility" TEXT NOT NULL DEFAULT 'public',
ADD COLUMN     "show_bio" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "show_event_history" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "show_location" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "show_profile_photo" BOOLEAN NOT NULL DEFAULT true;
