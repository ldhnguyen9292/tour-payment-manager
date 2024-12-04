const { exec } = require('child_process');
const fs = require('fs');

const folderName = process.argv[2];

if (!folderName) {
  console.error(
    'Please provide a folder name: npm run create:folder <folder-name>',
  );
  process.exit(1);
}

// Create folder and use Nest CLI to generate files
const createFolderAndFiles = async () => {
  // Check if folder exists
  const folderPath = `src/${folderName}`;
  if (fs.existsSync(folderPath)) {
    console.error(`Folder "${folderPath}" already exists.`);
    process.exit(1);
  }

  try {
    console.log(
      `Creating module, controller, and service in "${folderName}"...`,
    );

    // Generate module
    exec(`nest g module ${folderName}`, (err) => {
      if (err) {
        console.error(`Error creating module: ${err.message}`);
        return;
      }

      // Generate controller
      exec(`nest g controller ${folderName}`, (err) => {
        if (err) {
          console.error(`Error creating controller: ${err.message}`);
          return;
        }

        // Generate service
        exec(`nest g service ${folderName}`, (err) => {
          if (err) {
            console.error(`Error creating service: ${err.message}`);
            return;
          }

          console.log(
            `Successfully created module, controller, and service in "${folderName}"!`,
          );
        });
      });
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

createFolderAndFiles();
