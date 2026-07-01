const express = require("express");
const cors = require("cors");
const path = require("path");
const cloneRepository = require("./utils/cloneRepository");
const validateProjectPath = require("./utils/validateProjectPath");
const buildDockerImage = require("./utils/buildDockerImage");
const generateComposeFile = require("./utils/generateComposeFile");
const startDeployment = require("./utils/startDeployment");
const reloadNginx = require("./utils/reloadNginx");
const appendNginxConfig = require("./utils/appendNginxConfig");
const getTunnelUrl = require("./utils/getTunnelUrl");
const { rateLimit } = require("express-rate-limit");
const crypto = require("crypto");

//////////////////////////////////////////////////////////////////////////
const app = express();
app.use(cors());
app.use(express.json());
app.set("trust proxy", 1);

/////////////////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.send("Backend is running ...");
});

const deploymentRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5,

    message: {
        success: false,
        message: "Too many deployment requests. Please try again later."
    },

    standardHeaders: true,
    legacyHeaders: false,
});

app.post("/deploy", deploymentRateLimiter, async (req, res) => {
  try {
    const { githubUrl, dockerfilePath, port, envVariables } = req.body;

    if (!isValidGithubRepoUrl(githubUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid GitHub repository URL",
      });
    }

    const { owner, repo } = getOwnerAndRepo(githubUrl);

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
    );

    if (response.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Repository not found",
      });
    }

    const deploymentId = crypto.randomBytes(6).toString("hex");
    const folderName = `${deploymentId}_${repo}`;

    const destination = path.join(__dirname, "..", "deployments", folderName);

    await cloneRepository(githubUrl, destination);

    const projectPath = validateProjectPath(destination, dockerfilePath || "");

    const imageName = folderName;
    const containerName = folderName;

    await buildDockerImage(imageName, projectPath);

    generateComposeFile(
      destination,
      imageName,
      containerName,
      port,
      envVariables,
    );

    await startDeployment(destination);

    appendNginxConfig(containerName, port);

    await reloadNginx();
    const tunnelUrl = await getTunnelUrl();
    const publicUrl = `${tunnelUrl}/${containerName}/`;

    res.json({
      success: true,
      message: "Deployment completed successfully",
      publicUrl,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
});

//////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////
function isValidGithubRepoUrl(url) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname !== "github.com") {
      return false;
    }

    const parts = parsedUrl.pathname.split("/").filter(Boolean);
    console.log(parts);
    return parts.length === 2;
  } catch {
    return false;
  }
}

function getOwnerAndRepo(url) {
  const parsedUrl = new URL(url);
  const parts = parsedUrl.pathname.split("/").filter(Boolean);

  return {
    owner: parts[0],
    repo: parts[1],
  };
}

///////////////////////////////////////////////////////////////////////////////////
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
