const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");

// Configuration
const DAYS = 1;              // Number of days to go back
const COMMITS_PER_DAY = 1000; // Number of commits per day
const FILE_NAME = "SATSDB.vue"; // File to change for each commit
const SRC_DIR = path.join(__dirname, "src/DATADB");

// Ensure the `src` directory exists
if (!fs.existsSync(SRC_DIR)) {
  fs.mkdirSync(SRC_DIR);
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

        // Append content to the file
        fs.appendFileSync(filePath, `Commit for ${dateString}\n`);

        // Stage and commit changes
        await git.add(filePath);
        await git.commit(`Commit on ${dateString}`, filePath, { "--date": dateString });

        // Add a small delay to avoid overlapping Git processes
        await new Promise((resolve) => setTimeout(resolve, 50));

        console.log(`Committed: ${dateString}`);
      }
    }

    console.log("All commits generated successfully!");
  } catch (error) {
    console.error("Error during execution:", error.message);
    console.error("Ensure no other Git processes are running.");
  }
})();
