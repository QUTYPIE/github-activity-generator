Here's a complete guide with everything you need to set up and run a GitHub activity generator in JavaScript, from start to finish.

### Step 1: Create the Project Folder

1. Open a terminal or command prompt.
2. Create a new directory and navigate to it:
   ```bash
   mkdir github-activity-generator
   cd github-activity-generator
   ```

### Step 2: Initialize the Node.js Project

1. Run the following command to create a `package.json` file:
   ```bash
   npm init -y
   ```

This will generate a basic `package.json` file to manage dependencies and scripts.

### Step 3: Install Dependencies

1. Install the `simple-git` package, which provides a Git wrapper for Node.js:
   ```bash
   npm install simple-git
   ```

### Step 4: Create the Script File

1. Create a new file named `activityGenerator.js` in your project folder:
   ```bash
   touch activityGenerator.js
   ```

2. Open `activityGenerator.js` in a text editor and paste the following code:

   ```javascript
   const simpleGit = require("simple-git");
   const fs = require("fs");
   const path = require("path");

   // Configuration
   const DAYS = 30;             // Number of days to go back
   const COMMITS_PER_DAY = 3;   // Number of commits per day
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
   ```

### Explanation of the Code
- **DAYS** and **COMMITS_PER_DAY**: Adjust these constants to control how many days of history you want and how many commits per day.
- **activity.txt**: The script writes to this file to create a change for each commit.
- **getFormattedDate()**: Formats the date for the `--date` option in the commit command.

### Step 5: Update `package.json` with a Script Command

Edit your `package.json` to add a `generate` script. Hereâ€™s what it should look like:

```json
{
  "name": "github-activity-generator",
  "version": "1.0.0",
  "description": "A simple GitHub activity generator",
  "main": "activityGenerator.js",
  "scripts": {
    "generate": "node activityGenerator.js"
  },
  "dependencies": {
    "simple-git": "^3.10.0"
  },
  "author": "NICK-FURY-6023",
  "license": "ISC"
}
```

Now you can run the script with:
```bash
npm run generate
```

### Step 6: Initialize the Git Repository (if not already done)

1. If this is your first time setting up this repository, initialize it with Git:
   ```bash
   git init
   ```

2. **Add your GitHub repository as the remote origin**:
   ```bash
   git remote add origin https://github.com/NICK-FURY-6023/github-activity-generator.git
   ```

### Step 7: Push the Commits to GitHub

After generating the commits locally, push them to your GitHub repository to display the activity on your profile:

1. Push the commits:
   ```bash
   git push -u origin main
   ```

### Step 8: Verify on GitHub

1. Go to your GitHub profile and check the activity graph to confirm that the simulated activity appears as expected.

---

This setup should give you all you need to generate and push commit history to GitHub. Let me know if you run into any issues!
