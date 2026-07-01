const { spawn } = require("child_process");

function runCommand(args) {
  return new Promise((resolve, reject) => {
    const process = spawn("docker", args);

    let error = "";

    process.stderr.on("data", (data) => {
      error += data.toString();
    });

    process.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(error));
      }
    });

    process.on("error", reject);
  });
}

async function reloadNginx() {
  await runCommand([
    "exec",
    "nginx",
    "nginx",
    "-t"
  ]);

  await runCommand([
    "exec",
    "nginx",
    "nginx",
    "-s",
    "reload"
  ]);
}

module.exports = reloadNginx;