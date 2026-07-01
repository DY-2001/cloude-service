const fs = require("fs");

function appendNginxConfig(containerName, port) {
  const nginxConfigPath =
    "/home/will-robinson/projects/infrastructure/nginx/default.conf";

  const marker = "    # DEPLOYMENTS";

  const config = fs.readFileSync(nginxConfigPath, "utf8");

  if (!config.includes(marker)) {
    throw new Error("Deployment marker not found in nginx configuration.");
  }

  if (config.includes(`location /${containerName}/`)) {
    return;
  }

  const locationBlock = `

    location /${containerName}/ {
        proxy_pass http://${containerName}:${port}/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }`;

  const updatedConfig = config.replace(marker, `${locationBlock}\n\n${marker}`);

  fs.writeFileSync(nginxConfigPath, updatedConfig);
}

module.exports = appendNginxConfig;
