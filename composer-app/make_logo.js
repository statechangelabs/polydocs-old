const { execSync } = require("child_process");

const sourceFile = process.argv[2];
execSync(
  `convert "${sourceFile}" -resize x192 -gravity center -extent 192x192 -background transparent public/logo192.png`,
  {
    stdio: "inherit",
  }
);
execSync(
  `convert "${sourceFile}" -resize x512 -gravity center -extent 512x512 -background transparent public/logo512.png`,
  {
    stdio: "inherit",
  }
);
execSync(
  `convert -background transparent public/logo512.png -define icon:auto-resize=16,24,32,48,64,72,96,128,256 public/favicon.ico`,
  { stdio: "inherit" }
);
execSync(`cp "${sourceFile}" src/logo.png`, { stdio: "inherit" });
