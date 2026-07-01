const fs = require("fs");

function appendNginxConfig(containerName, port) {
  const nginxConfigPath =
    "/home/will-robinson/projects/infrastructure/nginx/default.conf";

  const locationBlock = `

    location /${containerName}/ {
        proxy_pass http://${containerName}:${port}/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
`;

  const config = fs.readFileSync(nginxConfigPath, "utf8");

  const updated = config.replace(
    "    # DEPLOYMENTS",
    `${locationBlock}\n    # DEPLOYMENTS`
  );

  fs.writeFileSync(nginxConfigPath, updated);
}

module.exports = appendNginxConfig;