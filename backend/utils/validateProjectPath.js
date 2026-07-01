const fs = require("fs");
const path = require("path");

function validateProjectPath(clonePath, dockerfilePath) {
  const projectPath = path.join(clonePath, dockerfilePath);

  if (!fs.existsSync(projectPath)) {
    throw new Error("Invalid Dockerfile path.");
  }

  const dockerfileFullPath = path.join(projectPath, "Dockerfile");

  if (!fs.existsSync(dockerfileFullPath)) {
    throw new Error("Dockerfile not found.");
  }

  return projectPath;
}

module.exports = validateProjectPath;