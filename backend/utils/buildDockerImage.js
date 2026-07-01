const { spawn } = require("child_process");

function buildDockerImage(imageName, projectPath) {
    return new Promise((resolve, reject) => {

        console.log(`Building Docker image: ${imageName}...`);

        const docker = spawn("docker", [
            "build",
            "-t",
            imageName,
            projectPath
        ]);

        docker.stdout.on("data", (data) => {
            console.log(data.toString());
        });

        docker.stderr.on("data", (data) => {
            console.error(data.toString());
        });

        docker.on("close", (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error("Failed to build Docker image."));
            }
        });

        docker.on("error", (err) => {
            reject(err);
        });
    });
}

module.exports = buildDockerImage;