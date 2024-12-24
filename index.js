const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");

// Configuration
const DAYS = 1; // Number of days to go back
const COMMITS_PER_DAY = 1000; // Number of commits per day
const SRC_DIR = path.join(__dirname, "src/main/database/format/lanDB"); // Directory path

// Ensure the `src` directory exists
if (!fs.existsSync(SRC_DIR)) {
  fs.mkdirSync(SRC_DIR, { recursive: true });
  console.log(`✅ Created directory: ${SRC_DIR}`);
}

const git = simpleGit();

// Helper function to format date
const getFormattedDate = (date) => date.toISOString().replace("T", " ").substring(0, 19);

// Generate a unique file name for this execution
const FILE_NAME = `file_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.r`;
const filePath = path.join(SRC_DIR, FILE_NAME);

(async () => {
  try {
    // Create a new file at the start of the script
    const initialContent = `
/**
 * Git Activity Log
 * Author: ₦ł₵₭ ₣ɄⱤɎ 🛠️
 * Timestamp: ${getFormattedDate(new Date())}
 * 
 * Update Summary:
 * - File created at the start of the script execution.
 * - All commits for this run will be stored here.
 */
`;
    fs.writeFileSync(filePath, initialContent);
    console.log(`✅ Created new file: ${filePath}`);

    for (let day = 0; day < DAYS; day++) {
      const commitDate = new Date();
      commitDate.setDate(commitDate.getDate() - day);

      for (let commit = 0; commit < COMMITS_PER_DAY; commit++) {
        const dateString = getFormattedDate(commitDate);

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
