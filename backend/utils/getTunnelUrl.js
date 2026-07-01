const fs = require("fs");

function getTunnelUrl() {
  const filePath = "/app/cloudflare-url.txt";

  if (!fs.existsSync(filePath)) {
    throw new Error("Cloudflare Tunnel URL not found.");
  }

  return fs.readFileSync(filePath, "utf8").trim();
}

module.exports = getTunnelUrl;