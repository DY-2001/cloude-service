import { useState } from "react";
import "./App.css";

function App() {
  const [githubUrl, setGithubUrl] = useState("");
  const [dockerfilePath, setDockerfilePath] = useState("");
  const [loading, setLoading] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState("");

  const deploy = async () => {
    setLoading(true);
    setDeploymentUrl("");

    try {
      const res = await fetch("http://localhost:5000/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ githubUrl, dockerfilePath }),
      });

      const data = await res.json();
      setDeploymentUrl(data.url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">☁️ Cloud Service</h1>
        <p className="subtitle">Deploy your backend in seconds</p>

        <div className="form">
          <label className="label">GitHub Repository URL</label>

          <input
            className="input"
            type="text"
            placeholder="https://github.com/user/repository"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
          />

          <label className="label">
            Dockerfile Path ( Leave empty if Dockerfile is in the root directory )
          </label>

          <input
            className="input"
            type="text"
            placeholder="(optional) Path to Dockerfile Ex: backend, app/backend"
            value={dockerfilePath}
            onChange={(e) => setDockerfilePath(e.target.value)}
          />

          <button className="deploy-btn" onClick={deploy} disabled={loading}>
            {loading ? "⏳ Deploying..." : "Deploy Application"}
          </button>

          {deploymentUrl && (
            <div className="deployment-url">
              <a href={deploymentUrl} target="_blank" rel="noopener noreferrer">
                {deploymentUrl}
              </a>

              <button
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText(deploymentUrl)}
                title="Copy URL"
              >
                📋
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
