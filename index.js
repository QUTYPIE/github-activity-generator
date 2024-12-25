const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");

// Configuration
const DAYS = 3; // Number of days to go back
const COMMITS_PER_DAY = 100; // Number of commits per day
const SRC_DIR = path.join(__dirname, "src/main/database/format/lanDB"); // Directory path

// Ensure the `src` directory exists
if (!fs.existsSync(SRC_DIR)) {
  fs.mkdirSync(SRC_DIR, { recursive: true });
  console.log(`✅ Created directory: ${SRC_DIR}`);
}

const git = simpleGit();

// Helper functions
const formatTime12Hour = (date) => {
  const hours = date.hours();
  const minutes = date.minutes().toString().padStart(2, "0");
  const seconds = date.seconds().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format, 0 becomes 12
  return `${formattedHours}:${minutes}:${seconds} ${ampm}`;
};

const getFormattedDateTime = (date) => {
  const datePart = date.format("YYYY-MM-DD"); // YYYY-MM-DD
  const timePart = formatTime12Hour(date);
  return `${datePart} ${timePart}`;
};

const getCurrentDayName = (date) => date.format("dddd"); // Get the full day name (e.g., "Monday")

const getFormattedFileName = (date) => {
  const dayName = getCurrentDayName(date);
  const dateTime = date.format("YYYY-MM-DD"); // YYYY-MM-DD
  const timePart = formatTime12Hour(date).replace(/:/g, "-").replace(" ", "_");
  return `${dayName}_${dateTime}_${timePart}.r`;
};

// Generate a unique file name for this execution
const currentDate = moment.tz("Asia/Kolkata"); // Set the timezone to Kolkata (India)
const FILE_NAME = getFormattedFileName(currentDate);
const filePath = path.join(SRC_DIR, FILE_NAME);

(async () => {
  try {
    // Create a new file at the start of the script
    const initialContent = `
/**
 * Git Activity Log
 * Author: ₦ł₵₭ ₣ɄⱤɎ 🛠️
 * Timestamp: ${getFormattedDateTime(currentDate)}
 * 
 * Update Summary:
 * - File created at the start of the script execution.
 * - All commits for this run will be stored here.
 */
`;
    fs.writeFileSync(filePath, initialContent);
    console.log(`✅ Created new file: ${filePath}`);

    for (let day = 0; day < DAYS; day++) {
      const commitDate = moment.tz("Asia/Kolkata");
      commitDate.subtract(day, 'days');

      for (let commit = 0; commit < COMMITS_PER_DAY; commit++) {
        const dateString = getFormattedDateTime(commitDate);

        // Append detailed content to the file
        const detailedLog = `
/**
 * Commit #: ${commit + 1}
 * Timestamp: ${dateString}
 * 
 * 💡 Developer Thought: "Write code as if the next developer to maintain it is a violent psychopath who knows where you live."
 */
`;
        fs.appendFileSync(filePath, detailedLog);

        // Construct commit message
        const commitMessage = `Commit #: ${commit + 1} by ₦ł₵₭ ₣ɄⱤɎ 🛠️ - Time Stamped: ${dateString}`;

        try {
          // Stage and commit changes
          await git.add(filePath);
          await git.commit(commitMessage, filePath, { "--date": dateString });
          console.log(`✅ Committed: ${commitMessage}`);
        } catch (gitError) {
          console.error(`❌ Git error on commit #${commit + 1}:`, gitError.message);
        }

        // Add a small delay to avoid overlapping Git processes
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    console.log("✨ All commits generated successfully by the ₦ł₵₭ ₣ɄⱤɎ Legendary Developer! ✨");
  } catch (error) {
    console.error("❌ Error during execution:", error.message);
    console.error(error.stack);
  }
})();
