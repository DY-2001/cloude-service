const { spawn } = require("child_process");

function getTunnelUrl() {
  return new Promise((resolve, reject) => {
    const journalctl = spawn("journalctl", [
      "-u",
      "cloudflared-quick",
      "-n",
      "50",
    ]);

    let output = "";
    let error = "";

    journalctl.stdout.on("data", (data) => {
      output += data.toString();
    });

    journalctl.stderr.on("data", (data) => {
      error += data.toString();
    });

    journalctl.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(error || "Failed to read cloudflared logs."));
      }

      const match = output.match(
        /https:\/\/[a-zA-Z0-9.-]+\.trycloudflare\.com/
      );

      if (!match) {
        return reject(new Error("Cloudflare Tunnel URL not found."));
      }

      resolve(match[0]);
    });

    journalctl.on("error", reject);
  });
}

module.exports = getTunnelUrl;