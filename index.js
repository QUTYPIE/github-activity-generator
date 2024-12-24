const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");

// Configuration
const DAYS = 1; // Number of days to go back
const COMMITS_PER_DAY = 10; // Number of commits per day (reduced for testing)
const SRC_DIR = path.join(__dirname, "src/main/database"); // Directory path

// Ensure the `src` directory exists
if (!fs.existsSync(SRC_DIR)) {
  fs.mkdirSync(SRC_DIR, { recursive: true });
  console.log(`✅ Created directory: ${SRC_DIR}`);
}

const git = simpleGit();

// Helper function to format date
const getFormattedDate = (date) => date.toISOString().replace("T", " ").substring(0, 19);

// Helper function to generate a random file name
const generateRandomFileName = () => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8); // Alphanumeric random string
  return `file_${timestamp}_${randomString}.txt`;
};

(async () => {
  try {
    for (let day = 0; day < DAYS; day++) {
      const commitDate = new Date();
      commitDate.setDate(commitDate.getDate() - day);

      for (let commit = 0; commit < COMMITS_PER_DAY; commit++) {
        const dateString = getFormattedDate(commitDate);

        // Generate a new file name for each commit
        const FILE_NAME = generateRandomFileName();
        const filePath = path.join(SRC_DIR, FILE_NAME);

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
        fs.writeFileSync(filePath, detailedLog);
        console.log(`✅ Created new file: ${filePath}`);

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
