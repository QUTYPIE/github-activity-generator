const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");
const chalk = require("chalk");

// Configuration
const CONFIG = {
  DAYS: 1, // Number of days to go back
  COMMITS_PER_DAY: 1000, // Number of commits per day
  BASE_DIR: path.join(__dirname, "src/main/base"), // Base directory
  TIMEZONE: "Asia/Kolkata", // Timezone
  DEVELOPER_NAME: "₦ł₵₭ ₣ɄⱤɎ 🛠️", // Developer's name
  LOG_FORMAT: "md", // File format: txt, json, md
};

// Ensure the base directory exists
if (!fs.existsSync(CONFIG.BASE_DIR)) {
  fs.mkdirSync(CONFIG.BASE_DIR, { recursive: true });
  console.log(chalk.green(`✅ Base directory created: ${CONFIG.BASE_DIR}`));
}

const git = simpleGit();

// Helper: Format timestamp in 12-hour format with AM/PM
const formatTime = (date) => date.format("YYYY-MM-DD hh:mm:ss A");

// Helper: Generate a folder name based on current date
const generateFolderName = (date) => {
  const dayName = date.format("dddd"); // Day of the week
  const datePart = date.format("YYYY-MM-DD");
  return `${dayName}_${datePart}`;
};

// Helper: Generate a file name
const generateFileName = (date) => {
  const timePart = date.format("hh-mm-ss_A");
  return `${timePart}.${CONFIG.LOG_FORMAT}`;
};

// Write header for Markdown
const writeHeader = (filePath) => {
  const header =
    CONFIG.LOG_FORMAT === "md"
      ? `| Commit # | Timestamp           | Developer Name       |\n|----------|---------------------|----------------------|\n`
      : "";
  if (header) fs.writeFileSync(filePath, header, { flag: "w" });
};

// Append a commit row to the log file
const appendCommitRow = (filePath, commitNumber, timestamp) => {
  const row =
    CONFIG.LOG_FORMAT === "md"
      ? `| ${commitNumber.toString().padEnd(8)} | ${timestamp.padEnd(
          21
        )} | ${CONFIG.DEVELOPER_NAME.padEnd(20)} |\n`
      : "";
  if (row) fs.appendFileSync(filePath, row);
};

// Write footer for Markdown
const writeFooter = (filePath) => {
  if (CONFIG.LOG_FORMAT === "md") {
    const footer = `|----------|---------------------|----------------------|\n`;
    fs.appendFileSync(filePath, footer);
  }
};

// Main execution
(async () => {
  try {
    const currentDate = moment.tz(CONFIG.TIMEZONE);
    const folderName = generateFolderName(currentDate);
    const folderPath = path.join(CONFIG.BASE_DIR, folderName);

    // Ensure today's folder exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(chalk.green(`✅ Folder created: ${folderPath}`));
    }

    const fileName = generateFileName(currentDate);
    const filePath = path.join(folderPath, fileName);

    // Write the header to the log file
    writeHeader(filePath);
    console.log(chalk.green(`✅ Log file initialized: ${filePath}`));

    for (let day = 0; day < CONFIG.DAYS; day++) {
      const commitDate = moment.tz(CONFIG.TIMEZONE).subtract(day, "days");

      for (let commit = 0; commit < CONFIG.COMMITS_PER_DAY; commit++) {
        const timestamp = formatTime(commitDate);
        const commitMessage = `Automated Commit #: ${commit + 1} - ${timestamp}`;

        // Append commit row to log file
        appendCommitRow(filePath, commit + 1, timestamp);

        try {
          // Stage and commit changes
          await git.add(filePath);
          await git.commit(commitMessage, filePath, { "--date": timestamp });
          console.log(chalk.blue(`✅ Commit created: ${commitMessage}`));
        } catch (error) {
          console.error(
            chalk.red(`❌ Git error on commit #${commit + 1}:`, error.message)
          );
        }

        // Delay to avoid overlapping Git processes
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    // Write footer to log file
    writeFooter(filePath);
    console.log(chalk.yellow("✨ All commits successfully logged!"));
  } catch (error) {
    console.error(chalk.red("❌ Error during execution:", error.message));
  }
})();
