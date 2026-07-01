const { spawn } = require("child_process");

function runCommand(args) {
  return new Promise((resolve, reject) => {
    const command = spawn("docker", args);

    let error = "";

    command.stderr.on("data", (data) => {
      error += data.toString();
    });

    command.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(error || "Docker command failed."));
      }
    });

    command.on("error", reject);
  });
}

async function reloadNginx() {
  await runCommand(["exec", "nginx", "nginx", "-t"]);

  await runCommand(["exec", "nginx", "nginx", "-s", "reload"]);
}

module.exports = reloadNginx;
