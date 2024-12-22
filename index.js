const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");

// Import FILE_NAME from the external configuration
let FILE_NAME;
try {
  ({ FILE_NAME } = require("./FILE_NAME"));
  if (!FILE_NAME || typeof FILE_NAME !== "string") {
    throw new Error("Invalid `FILE_NAME` in `./FILE_NAME.js`. Ensure it exports a valid string.");
  }
} catch (error) {
  console.error("❌ Error loading FILE_NAME:", error.message);
  process.exit(1);
}

// Configuration
const DAYS = 1; // Number of days to go back
const COMMITS_PER_DAY = 1000; // Number of commits per day
const SRC_DIR = path.join(__dirname, "src"); // Extra file path "/main/database/formart;"

// Ensure the `src` directory exists
if (!fs.existsSync(SRC_DIR)) {
  fs.mkdirSync(SRC_DIR, { recursive: true });
  console.log(`✅ Created directory: ${SRC_DIR}`);
}

const git = simpleGit();

// Helper function to format date
const getFormattedDate = (date) => date.toISOString().replace("T", " ").substring(0, 19);

(async () => {
  try {
    const filePath = path.join(SRC_DIR, FILE_NAME);

    // Ensure the file exists
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "GitHub Activity Generator\n");
      console.log(`✅ Created new file: ${filePath}`);
    }

    for (let day = 0; day < DAYS; day++) {
      const commitDate = new Date();
      commitDate.setDate(commitDate.getDate() - day);

      for (let commit = 0; commit < COMMITS_PER_DAY; commit++) {
        const dateString = getFormattedDate(commitDate);

        // Construct commit message
        const commitMessage = `Commit #: ${commit + 1} by ₦ł₵₭ ₣ɄⱤɎ 🛠️ - Time Stamped: ${dateString}`;

        // Append detailed content to the file
        const detailedLog = `
/**
 * Git Activity Log
 * Author: ₦ł₵₭ ₣ɄⱤɎ 🛠️
 * Commit #: ${commit + 1}
 * Timestamp: ${dateString}
 * 
 * Update Summary:
 * 💡 Developer Thought: "Write code as if the next developer to maintain it is a violent psychopath who knows where you live."
 */
`;
        fs.appendFileSync(filePath, detailedLog);

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
