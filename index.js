const simpleGit = require("simple-git");
const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");

// Configuration
const CONFIG = {
  DAYS: 1, // Number of days to go back
  COMMITS_PER_DAY: 1000, // Number of commits per day
  SRC_DIR: path.join(__dirname, "src/main/database/format/lanDB"), // Directory path
  TIMEZONE: "Asia/Kolkata", // Timezone
  DEVELOPER_NAME: "₦ł₵₭ ₣ɄⱤɎ 🛠️", // Developer's name
};

// Ensure the directory exists
if (!fs.existsSync(CONFIG.SRC_DIR)) {
  fs.mkdirSync(CONFIG.SRC_DIR, { recursive: true });
  console.log(`✅ Directory created: ${CONFIG.SRC_DIR}`);
}

const git = simpleGit();

// Helper: Format timestamp in 12-hour format with AM/PM
const formatTime = (date) => date.format("YYYY-MM-DD hh:mm:ss A");

// Helper: Convert a string into binary representation
const stringToBinary = (text) =>
  text
    .split("")
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");

// Helper: Generate a random developer thought
const generateRandomThought = () => {
  const thoughts = [
    "Write code as if the next developer is a violent psychopath who knows where you live.",
    "Fix one bug, create three more. Such is life.",
    "Keep it simple, but significant.",
    "Always code as if the guy who ends up maintaining your code will be a sociopath.",
    "Code is read more often than it is written. Write accordingly.",
    "Make it work, make it right, make it fast.",
    "If debugging is the process of removing software bugs, then programming must be the process of putting them in.",
    "Documentation is like sex. When it is good, it is very, very good. When it is bad, it is better than nothing.",
    "There are two ways of constructing a software design: One way is to make it so simple that there are obviously no deficiencies. The other way is to make it so complicated that there are no obvious deficiencies.",
  ];
  return thoughts[Math.floor(Math.random() * thoughts.length)];
};

// Helper: Generate a file name
const generateFileName = (date) => {
  const dayName = date.format("dddd"); // Day of the week
  const datePart = date.format("YYYY-MM-DD");
  const timePart = date.format("hh-mm-ss_A");
  return `${dayName}_${datePart}_${timePart}.ejs`;
};

// Write the header to the file with borders
const writeHeader = (filePath) => {
  const header = `
+-----------+---------------------+--------------------------------------------------------+-------------------------------------------+----------------------+
| Commit #  | Timestamp           | Developer Thought                                      | Binary Representation                     | Developer Name       |
+-----------+---------------------+--------------------------------------------------------+-------------------------------------------+----------------------+\n`;
  fs.writeFileSync(filePath, header, { flag: "w" });
};

// Append a commit row to the file with borders
const appendCommitRow = (filePath, commitNumber, timestamp, thought) => {
  const binaryRepresentation = stringToBinary(thought).substring(0, 50) + "..."; // Limit binary length for readability
  const row = `| ${commitNumber.toString().padEnd(9)} | ${timestamp.padEnd(21)} | ${thought.padEnd(55)} | ${binaryRepresentation.padEnd(41)} | ${CONFIG.DEVELOPER_NAME.padEnd(20)} |\n`;
  fs.appendFileSync(filePath, row);
};

// Write the footer with the bottom border
const writeFooter = (filePath) => {
  const footer = `+-----------+---------------------+--------------------------------------------------------+-------------------------------------------+----------------------+\n`;
  fs.appendFileSync(filePath, footer);
};

// Main execution
(async () => {
  try {
    const currentDate = moment.tz(CONFIG.TIMEZONE);
    const fileName = generateFileName(currentDate);
    const filePath = path.join(CONFIG.SRC_DIR, fileName);

    // Write the header to the log file
    writeHeader(filePath);
    console.log(`✅ Log file initialized: ${filePath}`);

    for (let day = 0; day < CONFIG.DAYS; day++) {
      const commitDate = moment.tz(CONFIG.TIMEZONE).subtract(day, "days");

      for (let commit = 0; commit < CONFIG.COMMITS_PER_DAY; commit++) {
        const timestamp = formatTime(commitDate);
        const thought = generateRandomThought(); // Generate a random thought

        // Append the commit to the log file
        appendCommitRow(filePath, commit + 1, timestamp, thought);

        const commitMessage = `Commit #: ${commit + 1} - ${timestamp}`;

        try {
          // Stage and commit changes
          await git.add(filePath);
          await git.commit(commitMessage, filePath, { "--date": timestamp });
          console.log(`✅ Commit created: ${commitMessage}`);
        } catch (error) {
          console.error(`❌ Git error on commit #${commit + 1}:`, error.message);
        }

        // Delay to avoid overlapping Git processes
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }

    // Write the footer to the log file
    writeFooter(filePath);
    console.log("✨ All commits successfully logged!");
  } catch (error) {
    console.error("❌ Error during execution:", error.message);
  }
})();
