const { execSync } = require("child_process");

const sourceFile = process.argv[2];
execSync(
  `convert -background transparent "${sourceFile}" -define icon:auto-resize=16,24,32,48,64,72,96,128,256 public/favicon.ico`,
  { stdio: "inherit" }
);
execSync(`convert "${sourceFile}" -scale 192x192 public/logo192.png`, {
  stdio: "inherit",
});
execSync(`convert "${sourceFile}" -scale 512x512 public/logo512.png`, {
  stdio: "inherit",
});
execSync(`cp "${sourceFile}" src/logo.png`, { stdio: "inherit" });
