// this is not working fine we need to fix it so that it can update the news content at sanity
import cron from "node-cron";
import { syncToSanity } from "./sanity/sanity-utils";

console.log("⏰ Scheduling cron job...");

// Schedule to run every hour at minute 0 (you can change this pattern)
cron.schedule("0 * * * *", async () => {
  console.log("🚀 Running scheduled sync to Sanity...");

  try {
    await syncToSanity();
    console.log("✅ News synced successfully!");
  } catch (error) {
    console.error("❌ Error syncing news to Sanity:", error.message || error);
  }
});

console.log("✅ Cron job scheduled. Waiting for next execution...");
