const { spawn } = require("child_process");

function startDeployment(deploymentPath) {
  return new Promise((resolve, reject) => {

    const docker = spawn("docker", [
      "compose",
      "-f",
      `${deploymentPath}/compose.yaml`,
      "up",
      "-d"
    ]);

    let error = "";

    docker.stderr.on("data", (data) => {
      error += data.toString();
    });

    docker.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(error || "Failed to start deployment."));
      }
    });

    docker.on("error", reject);

  });
}

module.exports = startDeployment;