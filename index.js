const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");
const chalk = require("chalk");

// Configuration
const CONFIG = {
  TIMEZONE: "Asia/Kolkata", // Your timezone
  BASE_DIR: path.join(__dirname, "src/main/base"), // Directory for logs
};

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
  return `${timePart}.log`;
};

// Write the header to the file with borders
const writeHeader = (filePath) => {
  const header = `+-----------+---------------------+-------------------------------------------+----------------------+ 
| Commit #  | Timestamp           | Commit Message                           | Developer Name       | 
+-----------+---------------------+-------------------------------------------+----------------------+ \n`;
  fs.writeFileSync(filePath, header, { flag: "w" });
};

// Append a commit row to the file with borders
const appendCommitRow = (filePath, commitNumber, timestamp, commitMessage) => {
  const row = `| ${commitNumber.toString().padEnd(9)} | ${timestamp.padEnd(21)} | ${commitMessage.padEnd(41)} | Developer Name       |\n`;
  fs.appendFileSync(filePath, row);
};

// Write the footer with the bottom border
const writeFooter = (filePath) => {
  const footer = `+-----------+---------------------+-------------------------------------------+----------------------+ \n`;
  fs.appendFileSync(filePath, footer);
};

// Helper to analyze changes and generate commit messages
const generateCommitMessages = async () => {
  try {
    const status = await git.status();
    const messages = [];

    if (status.modified.length > 0) {
      console.log(chalk.blue("\n📄 Files modified:"));
      status.modified.forEach((file) => {
        const extension = path.extname(file);

        let message = "";
        if (extension === ".js") message = `Refactored JavaScript logic in ${file}`;
        else if (extension === ".json") message = `Updated configuration in ${file}`;
        else if (extension === ".swift") message = `Improved Swift code in ${file}`;
        else message = `Updated file: ${file}`;

        messages.push(message);
        console.log(` - ${file} -> ${message}`);
      });
    }

    if (status.not_added.length > 0) {
      console.log(chalk.yellow("\n📄 Files added:"));
      status.not_added.forEach((file) => {
        const message = `Added new file: ${file}`;
        messages.push(message);
        console.log(` - ${file} -> ${message}`);
      });
    }

    if (messages.length === 0) {
      console.log(chalk.green("\n✅ No significant changes detected."));
    }

    return messages;
  } catch (error) {
    console.error(chalk.red("❌ Error analyzing changes:"), error.message);
    return [];
  }
};

// Main function to automate commits
(async () => {
  try {
    console.log(chalk.green("\n🔍 Starting commit process..."));

    // Get current date and time
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

    // Analyze changes and generate commit messages
    const messages = await generateCommitMessages();

    if (messages.length > 0) {
      // Stage all changes
      await git.add("./*");
      console.log(chalk.green("\n✅ All changes staged."));

      // Create a single meaningful commit
      const commitMessage = messages.join(" | ");
      await git.commit(commitMessage);
      console.log(chalk.green("\n✨ Commit created with message:"));
      console.log(chalk.yellow(`   ${commitMessage}`));

      // Write commit details to the log file
      const timestamp = formatTime(currentDate);
      appendCommitRow(filePath, 1, timestamp, commitMessage);

      // Write footer to the log file
      writeFooter(filePath);

      // Push to repository
      await git.push();
      console.log(chalk.green("\n🚀 Changes pushed to the repository!"));
    } else {
      console.log(chalk.blue("\n🌟 No changes to commit."));
    }
  } catch (error) {
    console.error(chalk.red("❌ Error during commit process:"), error.message);
  }
})();
