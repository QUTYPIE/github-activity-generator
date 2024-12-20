const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");
const { FILE_NAME } = require("./FILE_NAME"); // Ensure this file exists and exports `FILE_NAME`

// Configuration
const DAYS = 1;              // Number of days to go back
const COMMITS_PER_DAY = 1000; // Number of commits per day
const SRC_DIR = path.join(__dirname, "src/main/database/formart"); // extra file path : /database/formart

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
    }

    for (let day = 0; day < DAYS; day++) {
      const commitDate = new Date();
      commitDate.setDate(commitDate.getDate() - day);

      for (let commit = 0; commit < COMMITS_PER_DAY; commit++) {
        const dateString = getFormattedDate(commitDate);

        // Epic Commit Message
        const commitMessage = `  #${commit + 1} by ₦ł₵₭ ₣ɄⱤɎ 🛠️ - Time Stamped: ${dateString}`;


        // Append content to the file
        fs.appendFileSync(filePath, `Commit by ₦ł₵₭ ₣ɄⱤɎ 🛠️ - Time Stamped ${dateString}\n`);

        // Stage and commit changes
        await git.add(filePath);
        await git.commit(commitMessage, filePath, { "--date": dateString });

        // Add a small delay to avoid overlapping Git processes
        await new Promise((resolve) => setTimeout(resolve, 50));

        console.log(`Committed: ${commitMessage}`);
      }
    }

    console.log("All commits generated successfully by the ₦ł₵₭ ₣ɄⱤɎ Legendary Developer!");
  } catch (error) {
    console.error("Error during execution:", error.message);
    console.error(error.stack);
    console.error("Ensure no other Git processes are running.");
  }
})();
