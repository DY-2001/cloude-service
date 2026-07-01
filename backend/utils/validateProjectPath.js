const fs = require("fs");
const path = require("path");

function validateProjectPath(clonePath, dockerfilePath) {
    const projectPath = path.join(clonePath, dockerfilePath);

    if (!fs.existsSync(projectPath)) {
        throw new Error("Invalid Dockerfile path.");
    }

    const files = fs.readdirSync(projectPath);

    const dockerfile = files.find(
        file => file.toLowerCase() === "dockerfile"
    );

    if (!dockerfile) {
        throw new Error("Dockerfile not found.");
    }

    return projectPath;
}

module.exports = validateProjectPath;