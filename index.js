const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");

// Ensure FILE_NAME is properly exported
let FILE_NAME;
try {
  ({ FILE_NAME } = require("./FILE_NAME"));
  if (!FILE_NAME) {
    throw new Error("`FILE_NAME` is not defined or exported in `./FILE_NAME.js`.");
  }
} catch (error) {
  console.error("Error loading FILE_NAME:", error.message);
  process.exit(1); // Exit script if FILE_NAME is invalid
}

// Configuration
const DAYS = 1; // Number of days to go back
const COMMITS_PER_DAY = 1000; // Number of commits per day
const SRC_DIR = path.join(__dirname, "src/main/database/formart");

// Ensure the `src` directory exists
if (!fs.existsSync(SRC_DIR)) {
  fs.mkdirSync(SRC_DIR, { recursive: true });
}

const git = simpleGit();
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

        // Construct a dynamic, programming-themed commit message
        const commitMessage = ```python

🔧 Commit #${commit + 1} 🚀 by ₦ł₵₭ ₣ɄⱤɎ 
🕒 Timestamp: ${dateString}
📖 "Refactored life and committed to excellence. One line at a time."
        ```;

        // Generate structured, programming-centric content for the file
        const content = `

  🚀 Git Activity Log
  Author: ₦ł₵₭ ₣ɄⱤɎ 🛠️
  Commit #: ${commit + 1}
  Timestamp: ${dateString}
  
  Update Summary:
   Codebase optimization in progress...
   Contributions written with ❤️ and executed with precision.
  
 * 💡 Developer Thought: "Write code as if the next developer to maintain it is a violent psychopath who knows where you live."
 
 //[---------------------------------------------------------]
   [---------------------------------------------------------]

console.log("🚀 Commit Log: Mission Success - Timestamp: ${dateString}");
console.log("✨ Lines of Innovation Added By ₦ł₵₣ɄⱤɎ 🛠️");
        `;

        // Append the content to the file
        fs.appendFileSync(filePath, content);

        try {
          // Stage and commit changes
          await git.add(filePath);
          await git.commit(commitMessage, filePath, { "--date": dateString });
        } catch (gitError) {
          console.error(`❌ Git error on commit #${commit + 1}:`, gitError.message);
        }

        console.log(`✅ Committed: Commit #${commit + 1}  by ₦ł₵₭ ₣ɄⱤɎ 🛠️  Time Stamped at ${dateString}`);

        // Add a small delay to avoid overlapping Git processes
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    console.log("✨ All commits generated successfully by the ₦ł₵₭ ₣ɄⱤɎ Legendary Developer! ✨");
  } catch (error) {
    console.error("❌ Error during execution:", error.message);
    console.error(error.stack);
    console.error("Ensure no other Git processes are running.");
  }
})();
