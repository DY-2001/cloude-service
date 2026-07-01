const { spawn } = require("child_process");

function cloneRepository(githubUrl, destinationPath) {
    return new Promise((resolve, reject) => {

        console.log(`Cloning repository from ${githubUrl} to ${destinationPath}...`);
        const git = spawn("git", [
            "clone",
            githubUrl,
            destinationPath
        ]);

        let error = "";

        git.stderr.on("data", (data) => {
            error += data.toString();
        });

        git.on("close", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(error);
            }
        });

    });
}

module.exports = cloneRepository;