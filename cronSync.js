const cron = require("node-cron");
const { syncToSanity } = require("./sanity/sanity-utils");


console.log("⏰ Scheduling cron job...");

cron.schedule("0 * * * *", async () => {
  console.log("🚀 Running scheduled sync to Sanity...");

  try {
    await syncToSanity();
    console.log("✅ News synced successfully!");
  } catch (error) {
    console.error("❌ Error syncing news to Sanity:", error.message || error);
  }
});

// Keep the process alive
setInterval(() => {}, 1000 * 60 * 60);
