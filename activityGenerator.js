const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");

// Configuration
const DAYS = 1;             // Number of days to go back
const COMMITS_PER_DAY = 1500;   // Number of commits per day
const FILE_NAME = "activity.txt"; // File to change for each commit

const git = simpleGit();

const getFormattedDate = (date) => date.toISOString().replace('T', ' ').substring(0, 19);

(async () => {
  const filePath = path.join(__dirname, FILE_NAME);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "GitHub Activity Generator\n");
  }

  for (let day = 0; day < DAYS; day++) {
    const commitDate = new Date();
    commitDate.setDate(commitDate.getDate() - day);

    for (let commit = 0; commit < COMMITS_PER_DAY; commit++) {
      const dateString = getFormattedDate(commitDate);

      fs.appendFileSync(filePath, `Commit for ${dateString}\n`);
      await git.add(FILE_NAME);
      await git.commit(`Commit on ${dateString}`, FILE_NAME, { "--date": dateString });
      console.log(`Committed: ${dateString}`);
    }
  }

  console.log("All commits generated successfully!");
})();
