const fs = require("fs");
const path = require("path");

function generateComposeFile(
  deploymentPath,
  imageName,
  containerName,
  port,
  envVariables = []
) {
  const environment = [`      PORT: "${port}"`];

  envVariables.forEach(({ key, value }) => {
    if (key.trim() && key.trim().toUpperCase() !== "PORT") {
      environment.push(`      ${key}: "${value}"`);
    }
  });

  const compose = `services:
  app:
    image: ${imageName}
    container_name: ${containerName}
    restart: unless-stopped

    environment:
${environment.join("\n")}

    networks:
      - server-network

networks:
  server-network:
    external: true
`;

  fs.writeFileSync(
    path.join(deploymentPath, "compose.yaml"),
    compose
  );
}

module.exports = generateComposeFile;