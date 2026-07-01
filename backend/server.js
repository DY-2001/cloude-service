const express = require("express");
const cors = require("cors");
const path = require("path");
const cloneRepository = require("./utils/cloneRepository");
const crypto = require("crypto");



//////////////////////////////////////////////////////////////////////////
const app = express();
app.use(cors());
app.use(express.json());




/////////////////////////////////////////////////////////////////////////
app.get("/", (req, res) => {
    res.send("Backend is running ...");
});

app.post("/deploy", async (req, res) => {
    const { githubUrl } = req.body;

    if (!isValidGithubRepoUrl(githubUrl)) {
        return res.status(400).json({
            message: "Invalid GitHub repository URL"
        });
    }

    console.log(githubUrl);
    const { owner, repo } = getOwnerAndRepo(githubUrl);

    const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}`
    );

    if (response.status === 404) {
        return res.status(404).json({
            message: "Repository not found"
        });
    }

    const deploymentId = crypto.randomBytes(6).toString("hex");
    const folderName = `${deploymentId}_${repo}`;

    const destination = path.join(
        __dirname,
        "..",
        "deployments",
        folderName
    );

    await cloneRepository(githubUrl, destination);

    res.json({
        message: "Repository cloned successfully"
    });
});




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
        repo: parts[1]
    };
}




///////////////////////////////////////////////////////////////////////////////////
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});