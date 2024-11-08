const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");

// Configure activity settings
const DAYS = 30;             // Number of days to go back
const COMMITS_PER_DAY = 3;   // Number of commits per day
const FILE_NAME = "activity.txt"; // File to make changes to

// Initialize Git in the current directory
const git = simpleGit();

// Function to create a formatted date
const getFormattedDate = (date) => date.toISOString().replace('T', ' ').substring(0, 19);

(async () => {
  // Ensure the file to modify exists
  const filePath = path.join(__dirname, FILE_NAME);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "GitHub Activity Generator\n");
  }

  // Generate commits
  for (let day = 0; day < DAYS; day++) {
    const commitDate = new Date();
    commitDate.setDate(commitDate.getDate() - day);

    for (let commit = 0; commit < COMMITS_PER_DAY; commit++) {
      const dateString = getFormattedDate(commitDate);

      // Make a change in the file to commit
      fs.appendFileSync(filePath, `Commit for ${dateString}\n`);

      // Stage and commit the change with the specified date
      await git.add(FILE_NAME);
      await git.commit(`Commit on ${dateString}`, FILE_NAME, { "--date": dateString });
      console.log(`Committed: ${dateString}`);
    }
  }

  console.log("All commits generated successfully!");
})();
